const StatementUI          = require('./statement.ui');
const ViewPopup            = require('../../view_popup/view_popup');
const Client               = require('../../../../base/client');
const showLocalTimeOnHover = require('../../../../base/clock').showLocalTimeOnHover;
const BinarySocket         = require('../../../../base/socket');
const DateTo               = require('../../../../common/attach_dom/date_to');
const isEuCountry          = require('../../../../common/country_base').isEuCountry;
const addTooltip           = require('../../../../common/get_app_details').addTooltip;
const buildOauthApps       = require('../../../../common/get_app_details').buildOauthApps;
const localize             = require('../../../../../_common/localize').localize;

const StatementInit = (() => {
    // Batch refer to number of data get from ws service per request
    // chunk refer to number of data populate to ui for each append
    // receive means receive from ws service
    // consume means consume by UI and displayed to page

    let batch_size,
        chunk_size,
        no_more_data,
        pending,
        current_batch,
        transactions_received,
        transactions_consumed;

    const tableExist = () => document.getElementById('statement-table');

    const finishedConsumed = () => (transactions_consumed === transactions_received);

    const getStatement = (opts) => {
        const req = { statement: 1, description: 1 };

        if (opts) $.extend(true, req, opts);

        const obj_date_to_from = DateTo.getDateToFrom();
        if (obj_date_to_from) $.extend(true, req, obj_date_to_from);

        BinarySocket.send(req).then((response) => {
            statementHandler(response);
            $('.barspinner').setVisibility(0);
        });
    };

    const getNextBatchStatement = () => {
        getStatement({ offset: transactions_received, limit: batch_size });
        pending = true;
    };

    const getNextChunkStatement = () => {
        const chunk = current_batch.splice(0, chunk_size);
        transactions_consumed += chunk.length;
        $('#rows_count').text(transactions_consumed);
        return chunk;
    };

    const getAccountStatistics = () => {
        // only show Account Statistics to MLT/MX clients
        if (!/^(malta|iom)$/.test(Client.get('landing_company_shortcode'))) return;

        BinarySocket.send({ account_statistics: 1 }).then(response => {
            StatementUI.updateAccountStatistics(response.account_statistics);
        });
    };

    const statementHandler = (response) => {
        if (response.error) {
            StatementUI.errorMessage(response.error.message);
            return;
        }

        pending = false;

        const statement = response.statement;
        current_batch   = statement.transactions;
        transactions_received += current_batch.length;

        if (current_batch.length < batch_size) {
            no_more_data = true;
        }

        if (!tableExist()) {
            StatementUI.createEmptyStatementTable().appendTo('#statement-container');
            $('.act, .credit').addClass('nowrap');
            StatementUI.updateStatementTable(getNextChunkStatement());

            // Show a message when the table is empty
            if (transactions_received === 0 && current_batch.length === 0) {
                $('#statement-table').find('tbody')
                    .append($('<tr/>', { class: 'flex-tr' })
                        .append($('<td/>', { colspan: 7 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('Your account has no trading activity.') }))));
            } else {
                $('#util_row').setVisibility(1);
                // uncomment to enable export to CSV
                // $('#download_csv')
                //     .setVisibility(1)
                //     .find('a')
                //     .off('click')
                //     .on('click', () => { StatementUI.exportCSV(); });
            }
        }
        showLocalTimeOnHover('td.date');
    };

    const loadStatementChunkWhenScroll = () => {
        $(document).scroll(() => {
            const hidableHeight = (percentage) => {
                const total_hideable = $(document).height() - $(window).height();
                return Math.floor((total_hideable * percentage) / 100);
            };

            const p_from_top = $(document).scrollTop();

            if (!tableExist() || p_from_top < hidableHeight(70)) return;

            if (finishedConsumed() && !no_more_data && !pending) {
                getNextBatchStatement();
                return;
            }

            if (!finishedConsumed()) StatementUI.updateStatementTable(getNextChunkStatement());
        });
    };

    const onUnload = () => {
        pending      = false;
        no_more_data = false;

        current_batch = [];

        transactions_received = 0;
        transactions_consumed = 0;

        StatementUI.errorMessage(null);
        StatementUI.clearTableContent();
    };

    const initPage = () => {
        batch_size            = 200;
        chunk_size            = batch_size / 2;
        no_more_data          = false;
        pending               = false;            // serve as a lock to prevent ws request is sequential
        current_batch         = [];
        transactions_received = 0;
        transactions_consumed = 0;

        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            addTooltip(StatementUI.setOauthApps(buildOauthApps(response)));
        });
        getNextBatchStatement();
        loadStatementChunkWhenScroll();
        getAccountStatistics();

        BinarySocket.wait('website_status', 'authorize', 'landing_company').then(() => {
            if (isEuCountry() && !Client.get('is_virtual')) {
                initDownloadStatement();
            }
        });
    };

    const onLoad = () => {
        initPage();
        DateTo.attachDateToPicker(() => {
            StatementUI.clearTableContent();
            $('.barspinner').setVisibility(1);
            initPage();
        });
        ViewPopup.viewButtonOnClick('#statement-container');
    };

    const initDownloadStatement = () => {
        const $statement_container    = $('#statement-container');
        const $ds_container           = $('#download-statement-container');
        const $download_statement_btn = $('#download_statement_btn');
        const $request_statement_btn  = $('#request_statement_btn');
        const $success_msg            = $ds_container.find('.success-msg');
        const $error_msg              = $ds_container.find('.error-msg');

        const download_from_id        = '#download_from';
        const download_to_id          = '#download_to';

        $download_statement_btn.setVisibility(1);
        $download_statement_btn.off('click').on('click', (e) => {
            e.preventDefault();

            $statement_container.setVisibility(0);
            $ds_container.setVisibility(1);

            DateTo.attachDateRangePicker(download_from_id, download_to_id, () => {
                $success_msg.setVisibility(0);
                $error_msg.setVisibility(0);

                setTimeout(() => {
                    // need to wrap with setTimeout 0 to execute this chunk of code right
                    // after datepicker value are updated with newly selected date,
                    // otherwise we will get the previously selected date
                    // More info: https://javascript.info/settimeout-setinterval#settimeout-0
                    const date_from  = DateTo.getDatePickerValue(download_from_id);
                    const date_to    = DateTo.getDatePickerValue(download_to_id, true);
                    const can_submit = date_from && date_to;

                    if (can_submit) {
                        $request_statement_btn.removeClass('button-disabled')
                            .off('click')
                            .on('click', (evt) => {
                                evt.preventDefault();
                                BinarySocket.send({
                                    request_report: 1,
                                    report_type   : 'statement',
                                    date_from,
                                    date_to,
                                }).then((response) => {
                                    if (response.error) {
                                        $error_msg.text(response.error.message).setVisibility(1);
                                    } else {
                                        $success_msg.setVisibility(1);
                                    }
                                    $request_statement_btn.addClass('button-disabled').off('click');
                                });
                            });
                    } else {
                        $request_statement_btn.addClass('button-disabled').off('click');
                    }
                }, 0);
            });
        });

        $('#go_back_btn').off('click').on('click', (e) => {
            e.preventDefault();
            $ds_container.setVisibility(0);
            $statement_container.setVisibility(1);
            $success_msg.setVisibility(0);
            $error_msg.setVisibility(0);
            $request_statement_btn.addClass('button-disabled').off('click');
            $(download_from_id).val('').removeAttr('data-value');
            $(download_to_id).val('').removeAttr('data-value');
        });
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = StatementInit;

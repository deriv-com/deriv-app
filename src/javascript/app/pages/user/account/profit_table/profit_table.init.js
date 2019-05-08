const ProfitTableUI        = require('./profit_table.ui');
const ViewPopup            = require('../../view_popup/view_popup');
const showLocalTimeOnHover = require('../../../../base/clock').showLocalTimeOnHover;
const BinarySocket         = require('../../../../base/socket');
const DateTo               = require('../../../../common/attach_dom/date_to');
const addTooltip           = require('../../../../common/get_app_details').addTooltip;
const buildOauthApps       = require('../../../../common/get_app_details').buildOauthApps;
const localize             = require('../../../../../_common/localize').localize;

const ProfitTableInit = (() => {
    let batch_size,
        chunk_size,
        transactions_received,
        transaction_consumed,
        no_more_data,
        pending,
        current_batch;

    const tableExist = () => document.getElementById('profit-table');

    const finishedConsumed = () => (transaction_consumed === transactions_received);

    const onUnload = () => {
        current_batch         = [];
        transaction_consumed  = 0;
        transactions_received = 0;
        pending               = false;

        ProfitTableUI.errorMessage(null);

        if (tableExist()) {
            ProfitTableUI.cleanTableContent();
        }
    };

    const getNextBatchTransactions = () => {
        getProfitTable({ offset: transactions_received, limit: batch_size });
        pending = true;
    };

    const getNextChunk = () => {
        const chunk = current_batch.splice(0, chunk_size);
        transaction_consumed += chunk.length;
        return chunk;
    };

    const profitTableHandler = (response) => {
        if (response.error) {
            ProfitTableUI.errorMessage(response.error.message);
            return;
        }

        pending            = false;
        const profit_table = response.profit_table;
        current_batch      = profit_table.transactions;
        transactions_received += current_batch.length;

        if (current_batch.length < batch_size) {
            no_more_data = true;
        }

        if (!tableExist()) {
            ProfitTableUI.createEmptyTable().appendTo('#profit-table-container');
            ProfitTableUI.updateProfitTable(getNextChunk());

            // Show a message when the table is empty
            if ((transactions_received === 0) && (current_batch.length === 0)) {
                $('#profit-table').find('tbody')
                    .append($('<tr/>', { class: 'flex-tr' })
                        .append($('<td/>', { colspan: 8 })
                            .append($('<p/>', { class: 'notice-msg center-text', text: localize('Your account has no trading activity.') }))));
            } else {
                $('#util_row').setVisibility(1);
            }
        }
    };

    const onScrollLoad = () => {
        $(document).scroll(() => {
            const hidableHeight = (percentage) => {
                const total_hidable = $(document).height() - $(window).height();
                return Math.floor((total_hidable * percentage) / 100);
            };

            const p_from_top = $(document).scrollTop();

            if (!tableExist() || p_from_top < hidableHeight(50)) {
                return;
            }

            if (finishedConsumed() && !no_more_data && !pending) {
                getNextBatchTransactions();
                return;
            }

            if (!finishedConsumed()) {
                ProfitTableUI.updateProfitTable(getNextChunk());
            }
        });
    };

    const getProfitTable = (opts) => {
        const req = { profit_table: 1, description: 1 };

        if (opts) $.extend(true, req, opts);

        const obj_date_to_from = DateTo.getDateToFrom();
        if (obj_date_to_from) $.extend(true, req, obj_date_to_from);

        BinarySocket.send(req).then((response) => {
            profitTableHandler(response);
            showLocalTimeOnHover('td.buy-date,td.sell-date');
            $('.barspinner').setVisibility(0);
        });
    };

    const onLoad = () => {
        batch_size            = 50;
        chunk_size            = batch_size / 2;
        transactions_received = 0;
        transaction_consumed  = 0;
        no_more_data          = false;
        pending               = false;
        current_batch         = [];

        DateTo.attachDateToPicker(() => {
            ProfitTableUI.cleanTableContent();
            $('.barspinner').setVisibility(1);
            transactions_received = 0;
            getNextBatchTransactions();
        });
        BinarySocket.send({ oauth_apps: 1 }).then((response) => {
            addTooltip(ProfitTableUI.setOauthApps(buildOauthApps(response)));
        });
        getNextBatchTransactions();
        onScrollLoad();
        ViewPopup.viewButtonOnClick('#profit-table-container');
    };

    return {
        onLoad,
        onUnload,
    };
})();

module.exports = ProfitTableInit;

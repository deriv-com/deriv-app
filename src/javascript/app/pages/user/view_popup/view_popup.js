const moment         = require('moment');
const ViewPopupUI    = require('./view_popup.ui');
const Highchart      = require('../../trade/charts/highchart');
const Callputspread  = require('../../trade/callputspread');
const DigitDisplay   = require('../../trade/digit_trade');
const Lookback       = require('../../trade/lookback');
const Reset          = require('../../trade/reset');
const TickDisplay    = require('../../trade/tick_trade');
const Clock          = require('../../../base/clock');
const BinarySocket   = require('../../../base/socket');
const getElementById = require('../../../../_common/common_functions').getElementById;
const localize       = require('../../../../_common/localize').localize;
const State          = require('../../../../_common/storage').State;
const urlFor         = require('../../../../_common/url').urlFor;
const Utility        = require('../../../../_common/utility');

const ViewPopup = (() => {
    let contract_id,
        contract,
        is_sold,
        is_sold_before_start,
        is_sell_clicked,
        chart_started,
        chart_init,
        chart_updated,
        ticks_requested,
        sell_text_updated,
        btn_view,
        multiplier,
        $container,
        $loading;

    const popupbox_id   = 'inpage_popup_content_box';
    const wrapper_id    = 'sell_content_wrapper';
    const hidden_class  = 'invisible';
    const id_tick_chart = 'tick_chart';

    const init = (button, onClose) => {
        btn_view             = button;
        contract_id          = +$(btn_view).attr('contract_id');
        contract             = {};
        is_sold              = false;
        is_sold_before_start = false;
        is_sell_clicked      = false;
        chart_started        = false;
        chart_init           = false;
        chart_updated        = false;
        ticks_requested      = false;
        sell_text_updated    = false;
        $container           = '';

        if (typeof onClose === 'function') {
            ViewPopupUI.setOnCloseFunction(onClose);
        }

        if (btn_view) {
            ViewPopupUI.disableButton($(btn_view));
            ViewPopupUI.cleanup(false);
        }

        getContract();

        setLoadingState(true);
    };

    const responseContract = (response) => {
        if (!response.proposal_open_contract || Utility.isEmptyObject(response.proposal_open_contract)) {
            showErrorPopup(response);
            return;
        }
        // In case of error such as legacy shortcode, this call is returning the error message
        // but no error field. To specify those cases, we check for other fields existence
        if (!Utility.getPropertyValue(response, ['proposal_open_contract', 'shortcode'])) {
            showErrorPopup(response, response.proposal_open_contract.validation_error);
            return;
        }

        $.extend(contract, response.proposal_open_contract);
        is_sold_before_start = contract.sell_time && contract.sell_time < contract.date_start;
        // Lookback multiplier value
        multiplier = contract.multiplier;

        if (contract && document.getElementById(wrapper_id)) {
            update();
            return;
        }

        showContract();
    };

    const ContractTypeDisplay = (() => {
        let contract_type_display;

        const initContractTypeDisplay = () => ({
            ASIANU      : localize('Asian Up'),
            ASIAND      : localize('Asian Down'),
            CALL        : localize('Higher'),
            CALLE       : localize('Higher or equal'),
            PUT         : localize('Lower'),
            PUTE        : localize('Lower or equal'),
            DIGITMATCH  : localize('Digit Matches'),
            DIGITDIFF   : localize('Digit Differs'),
            DIGITODD    : localize('Digit Odd'),
            DIGITEVEN   : localize('Digit Even'),
            DIGITOVER   : localize('Digit Over'),
            DIGITUNDER  : localize('Digit Under'),
            EXPIRYMISS  : localize('Ends Outside'),
            EXPIRYRANGE : localize('Ends Between'),
            EXPIRYRANGEE: localize('Ends Between'),
            LBFLOATCALL : localize('Close-Low'),
            LBFLOATPUT  : localize('High-Close'),
            LBHIGHLOW   : localize('High-Low'),
            RANGE       : localize('Stays Between'),
            RESETCALL   : localize('Reset Call'),
            RESETPUT    : localize('Reset Put'),
            UPORDOWN    : localize('Goes Outside'),
            ONETOUCH    : localize('Touches'),
            NOTOUCH     : localize('Does Not Touch'),
            CALLSPREAD  : localize('Call Spread'),
            PUTSPREAD   : localize('Put Spread'),
            TICKHIGH    : localize('High Tick'),
            TICKLOW     : localize('Low Tick'),
            RUNHIGH     : localize('Only Ups'),
            RUNLOW      : localize('Only Downs'),
        });

        return {
            get: () => {
                if (!contract_type_display) {
                    contract_type_display = initContractTypeDisplay();
                }
                return contract_type_display;
            },
        };
    })();

    const showContract = () => {
        setLoadingState(false);

        if (!$container) {
            $container = makeTemplate();
        }

        containerSetText('trade_details_contract_type', ContractTypeDisplay.get()[contract.contract_type]);
        containerSetText('trade_details_purchase_price', formatMoney(contract.currency, contract.buy_price));
        containerSetText('trade_details_multiplier', formatMoney(contract.currency, multiplier, false, 3, 2));
        if (Lookback.isLookback(contract.contract_type)) {
            containerSetText('trade_details_payout', Lookback.getFormula(contract.contract_type, formatMoney(contract.currency, multiplier, false, 3, 2)));
        } else {
            containerSetText('trade_details_payout', formatMoney(contract.currency, contract.payout));
        }
        Clock.setExternalTimer(updateTimers);
        update();
        ViewPopupUI.repositionConfirmation();

        if (State.get('is_mb_trading')) {
            State.call('ViewPopup.onDisplayed');
        }
    };

    const update = () => {
        const is_started       = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
        const is_ended         = contract.status !== 'open' || contract.is_expired || contract.is_settleable;
        const indicative_price = contract.sell_price || (contract.bid_price || null);

        if (is_sold_before_start) {
            $('#trade_details_start_date').parent().setVisibility(0);
            containerSetText('trade_details_purchase_time', epochToDateTime(contract.purchase_time), '', true);
        } else {
            $('#trade_details_purchase_time').parent().setVisibility(0);
            containerSetText('trade_details_start_date', epochToDateTime(contract.date_start), '', true);
        }

        if (Callputspread.isCallputspread(contract.contract_type)) {
            Callputspread.update(null, contract);
        }

        if (contract.barrier_count > 1) {
            containerSetText('trade_details_barrier', is_sold_before_start ? '-' : addComma(contract.high_barrier), '', true);
            containerSetText('trade_details_barrier_low', is_sold_before_start ? '-' : addComma(contract.low_barrier), '', true);
        } else if (contract.barrier) {
            const formatted_barrier = addComma(contract.barrier);
            const mapping           = {
                DIGITMATCH: localize('Equals'),
                DIGITDIFF : localize('Not'),
            };
            const contract_text     = mapping[contract.contract_type];
            const barrier_prefix    = contract_text ? `${contract_text} ` : '';
            // only show entry spot if available and contract was not sold before start time
            containerSetText(
                'trade_details_barrier',
                contract.entry_tick_time && is_sold_before_start ? '-' : (barrier_prefix + formatted_barrier),
                '',
                true);

            if (Reset.isReset(contract.contract_type) && Reset.isNewBarrier(contract.entry_spot, contract.barrier)) {
                containerSetText(
                    'trade_details_barrier',
                    is_sold_before_start ? '-' : addComma(contract.entry_spot),
                    '',
                    true);
                containerSetText(
                    'trade_details_reset_barrier',
                    contract.entry_tick_time && is_sold_before_start ? '-' : (barrier_prefix + formatted_barrier),
                    '',
                    true);
            }
        }

        let current_spot      = contract.status === 'sold' ? '' : contract.current_spot;
        let current_spot_time = contract.status === 'sold' ? '' : contract.current_spot_time;
        if (is_ended && contract.status !== 'sold') {
            current_spot      = contract.exit_tick;
            current_spot_time = contract.exit_tick_time;
        }

        if (current_spot) {
            containerSetText('trade_details_current_spot > span', addComma(current_spot));
            $('#trade_details_current_spot').parent().setVisibility(1);
        } else {
            $('#trade_details_current_spot').parent().setVisibility(0);
        }

        if (current_spot_time) {
            if (window.time && current_spot_time > window.time.unix()) {
                // epoch needs to be 13 digits before turning to moment
                window.time = moment(+current_spot_time * 1000).utc();
                updateTimers();
            }
            containerSetText('trade_details_current_date', epochToDateTime(current_spot_time));
            $('#trade_details_current_date').parent().setVisibility(1);
        } else {
            $('#trade_details_current_date').parent().setVisibility(0);
        }

        containerSetText('trade_details_ref_id', `${contract.transaction_ids.buy} (${localize('Buy')}) ${contract.transaction_ids.sell ? `<br>${contract.transaction_ids.sell} (${localize('Sell')})` : ''}`);
        containerSetText('trade_details_indicative_price', indicative_price ? formatMoney(contract.currency, indicative_price) : '-');

        if (is_ended && !contract.sell_price) {
            containerSetText('trade_details_profit_loss', localize('Waiting for contract settlement.'), { class: 'pending' });
        } else if (contract.sell_price || contract.bid_price) {
            containerSetText('trade_details_profit_loss',
                `${formatMoney(contract.currency, contract.profit)}<span class="percent">(${(contract.profit_percentage > 0 ? '+' : '')}${addComma(contract.profit_percentage, 2)}%)</span>`,
                { class: (contract.profit >= 0 ? 'profit' : 'loss') }
            );
        } else {
            containerSetText('trade_details_profit_loss', '-', { class: 'loss' });
        }

        if (!is_started) {
            containerSetText('trade_details_entry_spot > span', '-');
            containerSetText('trade_details_message', localize('Contract has not started yet'));
        } else {
            if (contract.entry_spot > 0) {
                // only show entry spot if available and contract was not sold before start time
                containerSetText('trade_details_entry_spot > span', is_sold_before_start ? '-' : addComma(contract.entry_spot));
            }
            containerSetText('trade_details_message', contract.validation_error ? contract.validation_error : '&nbsp;');
        }

        const is_digit = /digit/i.test(contract.contract_type);
        if (is_digit) {
            if (!chart_started) {
                DigitDisplay.init(id_tick_chart, contract);
                chart_started = true;
            }
        } else if (!chart_started && !contract.tick_count) {
            if (!chart_init) {
                chart_init = true;
                Highchart.showChart(contract);
            }
            Highchart.showChart(contract, 'update');
            if (contract.entry_tick_time) {
                chart_started = true;
            }
        } else if (contract.tick_count && !chart_updated) {
            TickDisplay.updateChart({ id_render: id_tick_chart, request_ticks: !ticks_requested }, contract);
            ticks_requested = true;
            if ('barrier' in contract) {
                chart_updated = true;
            }
        }

        if (!is_sold && contract.status === 'sold') {
            is_sold = true;
            if (!contract.tick_count) Highchart.showChart(contract, 'update');
            else TickDisplay.updateChart({ is_sold: true }, contract);
        }
        if (contract.is_valid_to_sell && contract.is_settleable && !contract.is_sold && !is_sell_clicked) {
            ViewPopupUI.forgetStreams();
            BinarySocket.send({ sell_expired: 1 }).then((response) => {
                getContract(response);
            });
        }
        if (is_ended) {
            contractEnded();
            if (is_digit) {
                DigitDisplay.end(contract);
            } else if (!contract.tick_count) {
                Highchart.showChart(contract, 'update');
            } else {
                TickDisplay.updateChart({ is_sold: true }, contract);
            }
            containerSetText('trade_details_live_remaining', '-');
            Clock.setExternalTimer(); // stop timer
        } else {
            $container.find('#notice_ongoing').setVisibility(1);
        }

        if (!contract.is_valid_to_sell) {
            $container.find('#errMsg').setVisibility(0);
        }

        const { barrier, contract_type, entry_spot } = contract;
        if (Reset.isReset(contract_type) && Reset.isNewBarrier(entry_spot, barrier)) {
            TickDisplay.plotResetSpot(barrier);
        }
        // next line is responsible for 'sell at market' flashing on the last tick
        sellSetVisibility(!is_sell_clicked && !is_sold && !is_ended && +contract.is_valid_to_sell === 1);
        contract.chart_validation_error = contract.validation_error;
        contract.validation_error       = '';
    };

    // This is called by clock.js in order to sync time updates on header as well as view popup
    const updateTimers = () => {
        const now = Math.max(Math.floor((window.time || 0) / 1000), contract.current_spot_time || 0);
        containerSetText('trade_details_live_date', epochToDateTime(now));
        Clock.showLocalTimeOnHover('#trade_details_live_date');

        const is_started = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
        let remained     = contract.date_expiry - now;
        if (!is_started || contract.status !== 'open' || remained < 0) {
            containerSetText('trade_details_live_remaining', '-');
        } else {
            let days = 0;
            const day_seconds = 24 * 60 * 60;
            if (remained > day_seconds) {
                days = Math.floor(remained / day_seconds);
                remained %= day_seconds;
            }
            containerSetText('trade_details_live_remaining',
                (days > 0 ? `${days} ${days > 1 ? localize('days') : localize('day')}, ` : '') + moment((remained) * 1000).utc().format('HH:mm:ss'));
        }
    };

    const contractEnded = () => {
        const el_live_date = getElementById('trade_details_live_date');
        if (el_live_date.parentNode) {
            el_live_date.parentNode.setVisibility(0);
        }

        containerSetText('trade_details_current_title', localize('Contract Result'));
        containerSetText('trade_details_indicative_label', localize('Payout'));
        containerSetText('trade_details_profit_loss_label', localize('Profit/Loss'));
        if (contract.status === 'sold') {
            containerSetText('trade_details_end_label', localize('End Time'));
            containerSetText('trade_details_end_date', epochToDateTime(contract.sell_time), '', true);
        }
        if (Lookback.isLookback(contract.contract_type)) {
            containerSetText('trade_details_spot_label', localize('Close'));
            containerSetText('trade_details_spottime_label', localize('Close Time'));
        } else {
            containerSetText('trade_details_spot_label', localize('Exit Spot'));
            containerSetText('trade_details_spottime_label', localize('Exit Spot Time'));
        }

        // show validation error if contract is not settled yet
        if (!(contract.is_settleable && !contract.is_sold)) {
            containerSetText('trade_details_message', '&nbsp;');
        }
        $container.find('#errMsg').setVisibility(0);
        $container.find('#notice_ongoing').setVisibility(0);
        sellSetVisibility(false);
        // don't show for contracts that are manually sold before starting
        // Hide audit table for Lookback
        if (contract.audit_details && !Lookback.isLookback(contract.contract_type) &&
            (!contract.exit_tick_time || contract.exit_tick_time > contract.date_start)) {
            initAuditTable(0);
        }
    };

    const appendAuditLink = (element_id) => {
        const link = Utility.createElement('a', { href: `${'javascript:;'}`, class: 'link-audit button-secondary' });
        const span = Utility.createElement('span', { text: localize('Audit') });
        link.appendChild(span);
        link.addEventListener('click', () => { initAuditTable(1); });
        getElementById(element_id).appendChild(link);
    };

    // by default shows audit table and hides chart
    const setAuditVisibility = (show = true) => {
        setAuditButtonsVisibility(!show);
        getElementById('sell_details_chart_wrapper').setVisibility(!show);
        getElementById('sell_details_audit').setVisibility(show);
        ViewPopupUI.repositionConfirmation();
        $('#sell_content_wrapper').scrollTop(0);
    };

    const setAuditButtonsVisibility = (show = true) => {
        const links = document.getElementsByClassName('link-audit');
        for (let i = 0; i < links.length; i++) {
            links[i].setVisibility(show);
        }
    };

    const initAuditTable = (show) => {
        if (document.getElementById('sell_details_audit')) {
            if (show) {
                setAuditVisibility(1);
            } else {
                setAuditButtonsVisibility(1);
            }
            return;
        }

        const div         = Utility.createElement('div', { id: 'sell_details_audit', class: 'gr-8 gr-12-p gr-12-m gr-no-gutter invisible' });
        const table       = Utility.createElement('table', { id: 'audit_header', class: 'gr-12' });
        const tr          = Utility.createElement('tr', { class: 'gr-row' });
        const th_previous = Utility.createElement('th', { class: 'gr-2 gr-3-t gr-3-p gr-4-m' });
        const link        = Utility.createElement('a', { class: 'previous-wrapper' });

        link.appendChild(Utility.createElement('span', { class: 'previous align-self-center' }));
        link.appendChild(Utility.createElement('span', { class: 'nowrap view-chart', text: localize('View chart') }));
        link.addEventListener('click', () => { setAuditVisibility(0); });
        th_previous.appendChild(link);

        tr.appendChild(th_previous);
        tr.appendChild(Utility.createElement('th', { class: 'gr-8 gr-6-t gr-6-p gr-4-m', text: localize('Audit Page') }));
        tr.appendChild(Utility.createElement('th', { class: 'gr-2 gr-3-t gr-3-p gr-4-m' }));
        table.appendChild(tr);
        div.appendChild(table);
        div.insertAfter(getElementById('sell_details_chart_wrapper'));
        populateAuditTable(show);
        showExplanation(div);
    };

    const map_contract_type = {
        'expiry'          : 'endsinout',
        'asian'           : 'asian',
        'even|odd'        : 'evenodd',
        'over|under'      : 'overunder',
        'digit'           : 'digits',
        'upordown|range'  : 'staysinout',
        'touch'           : 'touchnotouch',
        'reset'           : 'reset',
        '(call|put)spread': 'callputspread',
        'tick(high|low)'  : 'highlowticks',
        'run(high|low)'   : 'runs',
        'call|put'        : () => +contract.entry_tick === +contract.barrier ? 'risefall' : 'higherlower',
    };

    const showExplanation = (div) => {
        let explanation_section = 'explain_';
        Object.keys(map_contract_type).some((type) => {
            if (new RegExp(type, 'i').test(contract.contract_type)) {
                explanation_section += typeof map_contract_type[type] === 'function' ? map_contract_type[type]() : map_contract_type[type];
                return true;
            }
            return false;
        });
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState !== 4 || this.status !== 200) {
                return;
            }
            const div_response = Utility.createElement('div', { html: this.responseText });
            const div_to_show = div_response.querySelector(`#${explanation_section}`);
            if (div_to_show) {
                div_to_show.classList.add('align-start', 'gr-padding-20', 'explanation-section', 'gr-parent');
                div.appendChild(div_to_show);
                div_to_show.setVisibility(1);
            }
        };
        xhttp.open('GET', urlFor('explanation'), true);
        xhttp.send();
    };

    const parseAuditResponse = (table, array_audit_data) => (
        new Promise((resolve) => {
            const primary_classes   = ['secondary-bg-color', 'content-inverse-color'];
            const secondary_classes = ['fill-bg-color', 'secondary-time'];
            array_audit_data.forEach((audit_data) => {
                let color;
                if (audit_data.flag === 'highlight_tick') {
                    color = primary_classes;
                } else if (audit_data.flag === 'highlight_time') {
                    color = secondary_classes;
                }

                createAuditRow(table, audit_data.epoch, audit_data.tick, audit_data.name, color);
            });
            resolve();
        })
    );

    const createAuditTable = (title) => {
        const div      = Utility.createElement('div', { class: 'audit-table' });
        const fieldset = Utility.createElement('fieldset', { class: 'align-start' });
        const table    = Utility.createElement('table', { class: 'gr-12 gr-centered gr-12-p gr-12-m' });
        fieldset.appendChild(Utility.createElement('legend', { text: title }));
        fieldset.appendChild(table);
        div.appendChild(fieldset);
        let insert_after = getElementById('audit_header');
        const audit_table  = document.getElementsByClassName('audit-table')[0];
        if (audit_table) {
            insert_after = audit_table;
        }
        div.insertAfter(insert_after);
        return {
            table,
            div,
        };
    };

    const createAuditHeader = (table) => {
        const tr = Utility.createElement('tr', { class: 'gr-row' });

        tr.appendChild(Utility.createElement('td', { class: 'gr-4' }));
        tr.appendChild(Utility.createElement('td', { class: 'gr-3 no-margin secondary-color', text: localize('Spot') }));
        tr.appendChild(Utility.createElement('td', { class: 'gr-4 no-margin secondary-color', text: localize('Spot Time (GMT)') }));

        table.insertBefore(tr, table.childNodes[0]);
    };

    const createAuditRow = (table, date, tick, remark, td_class) => {
        // if we have already added this timestamp in first table, skip adding it again to second table
        // unless it is a highlighted tick like entry or exit spot, or start or end time
        if (document.querySelector(`.audit-dates[data-value='${date}']`) && !remark) {
            return;
        }

        const tr        = Utility.createElement('tr', { class: 'gr-row' });
        const td_remark = Utility.createElement('td', { class: 'gr-4 remark', text: remark || '' });
        const td_tick   = Utility.createElement('td', { class: 'gr-3 spot-value', text: (tick && !isNaN(tick) ? addComma(tick) : (tick || '')) });
        const td_date   = Utility.createElement('td', { class: 'gr-4 audit-dates', 'data-value': date, 'data-balloon-pos': 'down', text: (date && !isNaN(date) ? moment.unix(date).utc().format('YYYY-MM-DD HH:mm:ss') : (date || '')) });

        tr.appendChild(td_remark);
        tr.appendChild(td_tick);
        tr.appendChild(td_date);

        if (td_class && td_class.length) {
            td_class.forEach((c) => {
                td_tick.classList.add(c);
                td_date.classList.add(c);
            });
        }

        table.appendChild(tr);
    };

    const populateAuditTable = (show_audit_table) => {
        if (!contract.tick_count) {
            const contract_starts = createAuditTable(localize('Contract Starts'));
            parseAuditResponse(contract_starts.table, contract.audit_details.contract_start).then(() => {
                if (contract.audit_details.contract_start) {
                    createAuditHeader(contract_starts.table);
                    appendAuditLink('trade_details_entry_spot');
                } else {
                    contract_starts.div.remove();
                }
                // don't show exit tick information if missing or manual sold
                if (contract.audit_details.contract_end && contract.status !== 'sold') {
                    const contract_ends = createAuditTable(localize('Contract Ends'));
                    parseAuditResponse(contract_ends.table, contract.audit_details.contract_end).then(() => {
                        if (contract.audit_details.contract_end) {
                            createAuditHeader(contract_ends.table);
                            appendAuditLink('trade_details_current_spot');
                        } else {
                            contract_ends.div.remove();
                        }
                        onAuditTableComplete(show_audit_table);
                    });
                } else {
                    onAuditTableComplete(show_audit_table);
                }
            });
        } else {
            const contract_details = createAuditTable(localize('Contract Details'));
            parseAuditResponse(contract_details.table, contract.audit_details.all_ticks).then(() => {
                if (contract.audit_details.all_ticks) {
                    createAuditHeader(contract_details.table);
                    appendAuditLink('trade_details_entry_spot');
                    appendAuditLink('trade_details_current_spot');
                } else {
                    contract_details.div.remove();
                }

                if (contract.status !== 'open') {
                    onAuditTableComplete(show_audit_table);
                }
            });
        }
    };

    const onAuditTableComplete = (show_audit_table) => {
        Clock.showLocalTimeOnHover('.audit-dates');
        setAuditVisibility(show_audit_table);
    };

    const makeTemplate = () => {
        $container = $('<div/>').append($('<div/>', { id: wrapper_id }));

        const longcode = contract.longcode;

        $container.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: longcode }));
        const $sections  = $('<div/>').append($('<div class="gr-row container"><div id="sell_details_chart_wrapper" class="gr-8 gr-12-p gr-12-m"></div><div id="sell_details_table" class="gr-4 gr-12-p gr-12-m"></div></div>'));
        let [barrier_text, low_barrier_text] = localize(['Barrier', 'Low Barrier']);
        if (Lookback.isLookback(contract.contract_type)) {
            [barrier_text, low_barrier_text] =
                Lookback.getBarrierLabel(contract.contract_type, contract.barrier_count);
        } else if (contract.barrier_count > 1) {
            barrier_text = localize('High Barrier');
        } else if (/^DIGIT(MATCH|DIFF)$/.test(contract.contract_type)) {
            barrier_text = localize('Target');
        } else if (/^(tickhigh|ticklow)$/i.test(contract.contract_type)) {
            barrier_text = localize('Selected Tick');
        }

        const should_show_entry_spot = !Lookback.isLookback(contract.contract_type) && !/digit/i.test(contract.contract_type);
        const should_show_barrier = !/runhigh|runlow/i.test(contract.contract_type);
        $sections.find('#sell_details_table').append($(
            `<table>
            <tr id="contract_tabs"><th colspan="2" id="contract_information_tab">${localize('Contract Information')}</th></tr><tbody id="contract_information_content">
            ${createRow(localize('Contract Type'), '', 'trade_details_contract_type')}
            ${createRow(localize('Transaction ID'), '', 'trade_details_ref_id')}
            ${createRow(localize('Start Time'), '', 'trade_details_start_date', true)}
            ${createRow(localize('Purchase Time'), '', 'trade_details_purchase_time', true)}
            ${(!contract.tick_count ? createRow(localize('Remaining Time'), '', 'trade_details_live_remaining') : '')}
            ${should_show_entry_spot ? createRow(localize('Entry Spot'), '', 'trade_details_entry_spot', 0, '<span></span>') : ''}
            ${should_show_barrier ? createRow(barrier_text, '', 'trade_details_barrier', true) : ''}
            ${Reset.isReset(contract.contract_type) ? createRow(localize('Reset Barrier'), '', 'trade_details_reset_barrier', true) : ''}
            ${(contract.barrier_count > 1 ? createRow(low_barrier_text, '', 'trade_details_barrier_low', true) : '')}
            ${createRow(Callputspread.isCallputspread(contract.contract_type) ? localize('Maximum payout') : localize('Potential Payout'), '', 'trade_details_payout')}
            ${multiplier && Lookback.isLookback(contract.contract_type) ? createRow(localize('Multiplier'), '', 'trade_details_multiplier') : ''}
            ${createRow(localize('Purchase Price'), '', 'trade_details_purchase_price')}
            </tbody>
            <th colspan="2" id="barrier_change" class="invisible">${localize('Barrier Change')}</th>
            <tbody id="barrier_change_content" class="invisible"></tbody>
            <tr><th colspan="2" id="trade_details_current_title">${localize('Current')}</th></tr>
            ${createRow(localize('Spot'), 'trade_details_spot_label', 'trade_details_current_spot', 0, '<span></span>')}
            ${createRow(localize('Spot Time'), 'trade_details_spottime_label', 'trade_details_current_date')}
            ${createRow(localize('Current Time'), '', 'trade_details_live_date')}
            ${!contract.tick_count ? createRow('', 'trade_details_end_label', 'trade_details_end_date', true) : ''}
            ${createRow(localize('Indicative'), 'trade_details_indicative_label', 'trade_details_indicative_price')}
            ${createRow(localize('Potential Profit/Loss'), 'trade_details_profit_loss_label', 'trade_details_profit_loss')}
            <tr><td colspan="2" class="last_cell" id="trade_details_message">&nbsp;</td></tr>
            </table>
            <div id="errMsg" class="notice-msg ${hidden_class}"></div>
            <div id="trade_details_bottom"><div id="contract_sell_wrapper" class="${hidden_class}"></div><div id="contract_sell_message"></div><div id="contract_win_status" class="${hidden_class}"></div></div>`));

        $sections.find('#sell_details_chart_wrapper').html($('<div/>', { id: (contract.tick_count ? id_tick_chart : 'analysis_live_chart'), class: 'live_chart_wrapper' }));

        $container.find(`#${wrapper_id}`)
            .append($sections.html())
            .append($('<div/>', { id: 'errMsg', class: `notice-msg ${hidden_class}` }))
            .append($('<div/>', { id: 'notice_ongoing', class: `fill-bg-color gr-padding-10 ${hidden_class}`, text: localize('You can close this window without interrupting your trade.') }));

        ViewPopupUI.showInpagePopup(`<div class="${popupbox_id}">${$container.html()}</div>`, '', '#sell_bet_desc');
        return $(`#${wrapper_id}`);
    };

    const createRow = (localized_label, label_id, value_id, is_hidden, value) => (
        `<tr${(is_hidden ? ` class="${hidden_class}"` : '')}><td${(label_id ? ` id="${label_id}"` : '')}>${localized_label}</td><td${(value_id ? ` id="${value_id}"` : '')}>${(value || '')}</td></tr>`
    );

    const epochToDateTime = epoch => `${moment.utc(epoch * 1000).format('YYYY-MM-DD HH:mm:ss')} GMT`;

    // ===== Tools =====
    const containerSetText = (id, string, attributes, is_visible) => {
        if (!$container || $container.length === 0) {
            $container = $(`#${wrapper_id}`);
        }

        const $target = $container.find(`#${id}`);
        if ($target && $target.length > 0) {
            $target.html(string);
            if (attributes) $target.attr(attributes);
            if (is_visible) $target.parent('tr').setVisibility(1);
        }
    };

    const setLoadingState = (show_loading) => {
        if (show_loading) {
            $loading = $('#trading_init_progress');
            if ($loading.length) {
                $loading.show();
            }
        } else {
            if ($loading.length) {
                $loading.hide();
            }
            if (btn_view) {
                ViewPopupUI.enableButton($(btn_view));
            }
        }
    };

    const showMessagePopup = (localized_text, localized_title, msg_class) => {
        setLoadingState(false);
        const $con = $('<div/>');
        $con.prepend($('<div/>', { id: 'sell_bet_desc', class: 'popup_bet_desc drag-handle', text: localized_title }));
        $con.append(
            $('<div/>', { id: wrapper_id })
                .append($('<div/>', { class: msg_class, html: localized_text })));
        ViewPopupUI.showInpagePopup(`<div class="${popupbox_id}">${$con.html()}</div>`, 'message_popup', '#sell_bet_desc');
    };

    const showErrorPopup = (response, localized_text) => {
        showMessagePopup(localized_text || localize('Sorry, an error occurred while processing your request.'), localize('There was an error'), 'notice-msg');
        // eslint-disable-next-line no-console
        console.log(response);
    };

    const sellSetVisibility = (show) => {
        const sell_wrapper_id = 'sell_at_market_wrapper';
        const sell_button_id  = 'sell_at_market';
        const is_exist        = $container.find(`#${sell_wrapper_id}`).length > 0;
        if (show) {
            const is_started    = !contract.is_forward_starting || contract.current_spot_time > contract.date_start;
            const $sell_wrapper = $container.find('#contract_sell_wrapper');
            if (is_exist) {
                if (!sell_text_updated && is_started) {
                    addSellNote($sell_wrapper);
                    $sell_wrapper.find(`#${sell_button_id}`).text(localize('Sell at market'));
                }
                return;
            }

            $sell_wrapper.setVisibility(1)
                .append($('<div/>', { id: sell_wrapper_id })
                    .append($('<button/>', { id: sell_button_id, class: 'button', text: is_started ? localize('Sell at market') : localize('Sell') })));
            if (is_started) {
                addSellNote($sell_wrapper);
            }

            $container.find(`#${sell_button_id}`).unbind('click').click((e) => {
                e.preventDefault();
                e.stopPropagation();
                is_sell_clicked = true;
                sellSetVisibility(false);
                BinarySocket.send({ sell: contract_id, price: contract.bid_price }).then((response) => {
                    responseSell(response);
                });
            });
        } else {
            if (!is_exist) return;
            $container.find(`#${sell_button_id}`).unbind('click');
            $container.find(`#${sell_wrapper_id}`).remove();
        }
    };

    const addSellNote = ($sell_wrapper) => {
        sell_text_updated = true;
        $sell_wrapper.find('#sell_at_market_wrapper').append($('<div/>', { class: 'note' })
            .append($('<strong/>', { text: `${localize('Note')}: ` }))
            .append($('<span/>', { text: localize('Contract will be sold at the prevailing market price when the request is received by our servers. This price may differ from the indicated price.') })));
    };

    // ===== Requests & Responses =====
    // ----- Get Contract -----
    const getContract = (option) => {
        if (contract_id) {
            ViewPopupUI.forgetStreams();
            const req = {
                contract_id,
                proposal_open_contract: 1,
                subscribe             : 1,
            };
            if (option === 'no-subscribe') delete req.subscribe;
            BinarySocket.send(req, { callback: responseProposal });
        }
    };

    const responseSell = (response) => {
        if (Utility.getPropertyValue(response, 'error')) {
            if (response.error.code === 'NoOpenPosition') {
                getContract();
            } else {
                $container.find('#errMsg').text(response.error.message).setVisibility(1);
            }
            sellSetVisibility(true);
            is_sell_clicked = false;
            return;
        }
        ViewPopupUI.forgetStreams();
        $container.find('#errMsg').setVisibility(0);
        sellSetVisibility(false);
        if (is_sell_clicked) {
            containerSetText('contract_sell_message',
                `${localize('You have sold this contract at [_1] [_2]', [contract.currency, response.sell.sold_for])}
                <br />
                ${localize('Your transaction reference number is [_1]', response.sell.transaction_id)}`);
        }
        getContract('no-subscribe');
    };

    const responseProposal = (response) => {
        if (response.error) {
            if (response.error.code !== 'AlreadySubscribed' && +response.echo_req.contract_id === contract_id) {
                showErrorPopup(response, response.error.message);
            }
            return;
        }
        if (+response.proposal_open_contract.contract_id === contract_id) {
            ViewPopupUI.storeSubscriptionID(response.proposal_open_contract.id);
            responseContract(response);
        } else if (response.proposal_open_contract.id) {
            BinarySocket.send({ forget: response.proposal_open_contract.id });
        }
        const dates = ['#trade_details_start_date', '#trade_details_end_date', '#trade_details_current_date', '#trade_details_live_date'];
        for (let i = 0; i < dates.length; i++) {
            Clock.showLocalTimeOnHover(dates[i]);
            $(dates[i]).attr('data-balloon-pos', 'left');
        }
    };

    const viewButtonOnClick = (container_selector) => {
        $(container_selector).on('click', '.open_contract_details', function (e) {
            e.preventDefault();
            init(this);
        });
    };

    return {
        init,
        viewButtonOnClick,
    };
})();
const addComma             = require('../../../common/currency').addComma;

const formatMoney          = require('../../../common/currency').formatMoney;

module.exports = ViewPopup;

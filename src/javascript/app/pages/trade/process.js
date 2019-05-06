const refreshDropdown   = require('@binary-com/binary-style').selectDropdown;
const moment            = require('moment');
const TradingAnalysis   = require('./analysis');
const commonTrading     = require('./common');
const Contract          = require('./contract');
const Defaults          = require('./defaults');
const Durations         = require('./duration');
const GetTicks          = require('./get_ticks');
const Lookback          = require('./lookback');
const Notifications     = require('./notifications');
const Price             = require('./price');
const Reset             = require('./reset');
const StartDates        = require('./starttime').StartDates;
const Symbols           = require('./symbols');
const Tick              = require('./tick');
const BinarySocket      = require('../../base/socket');
const getMinPayout      = require('../../common/currency').getMinPayout;
const isCryptocurrency  = require('../../common/currency').isCryptocurrency;
const elementInnerHtml  = require('../../../_common/common_functions').elementInnerHtml;
const getElementById    = require('../../../_common/common_functions').getElementById;
const getVisibleElement = require('../../../_common/common_functions').getVisibleElement;
const localize          = require('../../../_common/localize').localize;
const State             = require('../../../_common/storage').State;
const getPropertyValue  = require('../../../_common/utility').getPropertyValue;

const Process = (() => {
    /*
     * This function process the active symbols to get markets
     * and underlying list
     */
    const processActiveSymbols = () => {
        BinarySocket.send({ active_symbols: 'brief' }).then((response) => {
            if (response.active_symbols && response.active_symbols.length) {
                // populate the Symbols object
                Symbols.details(response);

                const market = commonTrading.getDefaultMarket();

                // store the market
                Defaults.set('market', market);

                commonTrading.displayMarkets();
                processMarket();
            } else {
                $('#content').empty().html($('<div/>', { class: 'container' }).append($('<p/>', { class: 'notice-msg center-text', text: localize('Trading is unavailable at this time.') })));
            }
        });
    };

    /*
     * Function to call when market has changed
     */
    const processMarket = () => {
        // we can get market from sessionStorage as allowed market
        // is already set when this is called
        let market = Defaults.get('market');
        let symbol = Defaults.get('underlying');

        // change to default market if query string contains an invalid market
        if (!market || !Symbols.underlyings()[market]) {
            market = commonTrading.getDefaultMarket();
            Defaults.set('market', market);
        }
        if ((!symbol || !Symbols.underlyings()[market][symbol])) {
            symbol = undefined;
        }

        processMarketUnderlying();
    };

    /*
     * Function to call when underlying has changed
     */
    const processMarketUnderlying = () => {
        const underlying_element = document.getElementById('underlying');
        const underlying = underlying_element.value;

        Defaults.set('underlying', underlying);

        commonTrading.showFormOverlay();

        // get ticks for current underlying
        GetTicks.request(underlying);

        Tick.clean();

        commonTrading.updateWarmChart();

        BinarySocket.clearTimeouts();

        getContracts(underlying);

        commonTrading.displayTooltip();
    };

    const getContracts = (underlying) => {
        BinarySocket.send({ contracts_for: underlying }).then((response) => {
            Notifications.hide('CONNECTION_ERROR');
            processContract(response);
        });
    };

    /*
     * Function to display contract form for current underlying
     */
    const processContract = (contracts) => {
        if (getPropertyValue(contracts, ['error', 'code']) === 'InvalidSymbol') {
            Price.processForgetProposals();
            getElementById('contract_confirmation_container').style.display      = 'block';
            getElementById('contracts_list').style.display = 'none';
            getElementById('confirmation_message').hide();

            const confirmation_error = getElementById('confirmation_error');
            confirmation_error.show();
            elementInnerHtml(confirmation_error, `${contracts.error.message} <a href="javascript:;" onclick="sessionStorage.removeItem('underlying'); window.location.reload();">${localize('Please reload the page')}</a>`);
            return;
        }

        State.set('is_chart_allowed', !(contracts.contracts_for && contracts.contracts_for.feed_license && contracts.contracts_for.feed_license === 'chartonly'));

        getElementById('trading_socket_container').classList.add('show');

        const init_logo = getElementById('trading_init_progress');
        if (init_logo && init_logo.style.display !== 'none') {
            init_logo.style.display = 'none';
            Defaults.update();
        }

        Contract.setContracts(contracts);

        const contract_categories = Contract.contractForms();
        let formname;
        if (Defaults.get('formname') && contract_categories && contract_categories[Defaults.get('formname')]) {
            formname = Defaults.get('formname');
        } else {
            const tree = commonTrading.getContractCategoryTree(contract_categories);
            if (tree[0]) {
                if (typeof tree[0] === 'object') {
                    formname = tree[0][1][0];
                } else {
                    formname = tree[0];
                }
            }
        }

        commonTrading.displayContractForms('contract_form_name_nav', contract_categories, formname);

        processContractForm(formname);

        TradingAnalysis.request();

        commonTrading.hideFormOverlay();
    };

    const processContractForm = (formname_to_set = getElementById('contract').value || Defaults.get('formname')) => {
        setFormName(formname_to_set);

        // get updated formname
        Contract.details(Defaults.get('formname'));

        StartDates.display();

        displayPrediction();
        refreshDropdown('#prediction');
        displaySelectedTick();
        refreshDropdown('#selected_tick');
        Lookback.display();

        if (!Reset.isReset(Defaults.get('formname'))) {
            Reset.hideResetTime();
        }

        let r1;
        if (State.get('is_start_dates_displayed') && Defaults.get('date_start') && Defaults.get('date_start') !== 'now') {
            r1 = Durations.onStartDateChange(Defaults.get('date_start'));
            if (!r1 || Defaults.get('expiry_type') === 'endtime') Durations.display();
        } else {
            Durations.display();
        }

        // needs to be called after durations are populated
        displayEquals();

        const currency  = Defaults.get('currency') || getVisibleElement('currency').value;
        const is_crypto = isCryptocurrency(currency);
        const amount    = is_crypto ? 'amount_crypto' : 'amount';
        if (Defaults.get(amount)) {
            $('#amount').val(Defaults.get(amount));
        } else {
            const default_value = getMinPayout(currency);
            Defaults.set(amount, default_value);
            getElementById('amount').value = default_value;
        }
        if (Defaults.get('amount_type')) {
            commonTrading.selectOption(Defaults.get('amount_type'), getElementById('amount_type'));
        } else {
            Defaults.set('amount_type', getElementById('amount_type').value);
        }

        if (Contract.form() === 'callputspread') {
            commonTrading.selectOption('payout', getElementById('amount_type'));
            refreshDropdown('#amount_type');
            // hide stake option
            getElementById('stake_option').setVisibility(0);
            $('[data-value="stake"]').hide();
        } else {
            getElementById('stake_option').setVisibility(1);
            refreshDropdown('#amount_type');
        }

        if (Defaults.get('currency')) {
            commonTrading.selectOption(Defaults.get('currency'), getVisibleElement('currency'));
        }

        const expiry_type        = Defaults.get('expiry_type') || 'duration';
        const make_price_request = onExpiryTypeChange(expiry_type);

        if (make_price_request >= 0) {
            Price.processPriceRequest();
        }
    };

    const displayPrediction = () => {
        const prediction_row = getElementById('prediction_row');
        if (Contract.form() === 'digits' && sessionStorage.getItem('formname') !== 'evenodd') {
            prediction_row.show();
            const prediction = getElementById('prediction');
            if (Defaults.get('prediction')) {
                commonTrading.selectOption(Defaults.get('prediction'), prediction);
            } else {
                Defaults.set('prediction', prediction.value);
            }
        } else {
            prediction_row.hide();
            Defaults.remove('prediction');
        }
    };

    const displaySelectedTick = () => {
        const selected_tick_row       = getElementById('selected_tick_row');
        const highlowticks_expiry_row = getElementById('highlowticks_expiry_row');
        if (sessionStorage.getItem('formname') === 'highlowticks') {
            selected_tick_row.show();
            highlowticks_expiry_row.show();
            const selected_tick = getElementById('selected_tick');
            if (Defaults.get('selected_tick')) {
                commonTrading.selectOption(Defaults.get('selected_tick'), selected_tick);
            } else {
                Defaults.set('selected_tick', selected_tick.value);
            }
        } else {
            selected_tick_row.hide();
            highlowticks_expiry_row.hide();
            Defaults.remove('selected_tick');
        }
    };

    const hasCallPutEqual = (contracts = getPropertyValue(Contract.contracts(), ['contracts_for', 'available']) || []) =>
        contracts.find(contract => contract.contract_category === 'callputequal');

    const displayEquals = (expiry_type = 'duration') => {
        const formname  = Defaults.get('formname');
        const el_equals = document.getElementById('callputequal');
        const durations = getPropertyValue(Contract.durations(), [commonTrading.durationType(Defaults.get('duration_units'))]) || [];
        if (/^(callputequal|risefall)$/.test(formname) && (('callputequal' in durations || expiry_type === 'endtime') && hasCallPutEqual())) {
            if (+Defaults.get('is_equal')) {
                el_equals.checked = true;
            }
            el_equals.parentElement.setVisibility(1);
        } else {
            el_equals.parentElement.setVisibility(0);
        }
    };

    const setFormName = (formname) => {
        let formname_to_set    = formname;
        const has_callputequal = hasCallPutEqual();
        if (formname_to_set === 'callputequal' && (!has_callputequal || !+Defaults.get('is_equal'))) {
            formname_to_set = 'risefall';
        } else if (formname_to_set === 'risefall' && has_callputequal && +Defaults.get('is_equal')) {
            formname_to_set = 'callputequal';
        }
        Defaults.set('formname', formname_to_set);
        getElementById('contract').setAttribute('value', formname_to_set);
    };

    const forgetTradingStreams = () => {
        Price.processForgetProposals();
        Price.processForgetProposalOpenContract();
        processForgetTicks();
    };

    /*
     * cancel the current tick stream
     * this need to be invoked before makin
     */
    const processForgetTicks = () => {
        BinarySocket.send({ forget_all: 'ticks' });
    };

    const onExpiryTypeChange = (value) => {
        const $expiry_type    = $('#expiry_type');
        const validated_value = value && $expiry_type.find(`option[value=${value}]`).length ? value : 'duration';
        const is_edge = window.navigator.userAgent.indexOf('Edge') !== -1;
        $expiry_type.val(validated_value);

        let make_price_request = 0;
        if (validated_value === 'endtime') {
            Durations.displayEndTime();
            if (Defaults.get('expiry_date')) {
                // if time changed, proposal will be sent there if not we should send it here
                make_price_request = Durations.selectEndDate(moment(Defaults.get('expiry_date'))) ? -1 : 1;
            }
            Defaults.remove('duration_units', 'duration_amount');
            if (is_edge) {
                document.getSelection().empty(); // microsoft edge 18 automatically start selecting text when select expiry time after changing expiry type to end time
            }
        } else {
            StartDates.enable();
            Durations.display();
            if (Defaults.get('duration_units')) {
                onDurationUnitChange(Defaults.get('duration_units'));
            }
            const duration_amount = Defaults.get('duration_amount');
            if (duration_amount && duration_amount > $('#duration_minimum').text()) {
                $('#duration_amount').val(duration_amount);
            }
            make_price_request = 1;
            Defaults.remove('expiry_date', 'expiry_time', 'end_date');
            Durations.validateMinDurationAmount();
        }
        displayEquals(validated_value);

        return make_price_request;
    };

    const onDurationUnitChange = (value) => {
        const $duration_units = $('#duration_units');
        if (!value || !$duration_units.find(`option[value=${value}]`).length) {
            return 0;
        }

        $duration_units.val(value);
        Defaults.set('duration_units', value);

        Durations.selectUnit(value);
        Durations.populate();

        return 1;
    };

    return {
        displayEquals,
        processActiveSymbols,
        processMarket,
        processContract,
        processContractForm,
        forgetTradingStreams,
        onExpiryTypeChange,
        onDurationUnitChange,
    };
})();

module.exports = Process;

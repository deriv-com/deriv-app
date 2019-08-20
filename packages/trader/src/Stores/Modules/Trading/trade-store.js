import debounce                       from 'lodash.debounce';
import {
    action,
    computed,
    observable,
    reaction,
    runInAction }                     from 'mobx';
import BinarySocket                   from '_common/base/socket_base';
import { localize }                   from 'App/i18n';
import {
    cloneObject,
    isEmptyObject,
    getPropertyValue }                from '_common/utility';
import {
    getMinPayout,
    isCryptocurrency }                from '_common/base/currency_base';
import { WS }                         from 'Services';
import { isDigitTradeType }           from 'Modules/Trading/Helpers/digits';
import { processPurchase }            from './Actions/purchase';
import * as Symbol                    from './Actions/symbol';
import getValidationRules             from './Constants/validation-rules';
import {
    pickDefaultSymbol,
    showUnavailableLocationError,
    isMarketClosed,
}                                     from './Helpers/active-symbols';
import { setChartBarrier }            from './Helpers/chart';
import ContractType                   from './Helpers/contract-type';
import {
    convertDurationLimit,
    resetEndTimeOnVolatilityIndices } from './Helpers/duration';
import { processTradeParams }         from './Helpers/process';
import {
    createProposalRequests,
    getProposalErrorField,
    getProposalInfo }                 from './Helpers/proposal';
import { BARRIER_COLORS }             from '../SmartChart/Constants/barriers';
import BaseStore                      from '../../base-store';

const store_name = 'trade_store';

export default class TradeStore extends BaseStore {
    // Control values
    @observable is_trade_component_mounted = false;
    @observable is_purchase_enabled        = false;
    @observable is_trade_enabled           = false;
    @observable is_equal                   = 0;

    // Underlying
    @observable symbol;
    @observable is_market_closed = false;
    @observable previous_symbol = '';
    @observable active_symbols = [];

    // Contract Type
    @observable contract_expiry_type = '';
    @observable contract_start_type  = '';
    @observable contract_type        = '';
    @observable contract_types_list  = {};
    @observable form_components      = [];
    @observable trade_types          = {};

    // Amount
    @observable amount     = 10;
    @observable basis      = '';
    @observable basis_list = [];
    @observable currency   = '';

    // Duration
    @observable duration            = 5;
    @observable duration_unit       = '';
    @observable duration_units_list = [];
    @observable duration_min_max    = {};
    @observable expiry_date         = '';
    @observable expiry_time         = '';
    @observable expiry_type         = 'duration';

    // Barrier
    @observable barrier_1     = '';
    @observable barrier_2     = '';
    @observable barrier_count = 0;

    // Start Time
    @observable start_date       = Number(0); // Number(0) refers to 'now'
    @observable start_dates_list = [];
    @observable start_time       = null;
    @observable sessions         = [];

    @observable market_open_times = [];
    // End Date Time
    /**
     * An array that contains market closing time.
     *
     * e.g. ["04:00:00", "08:00:00"]
     *
     */
    @observable market_close_times = [];

    // Last Digit
    @observable last_digit = 5;

    // Purchase
    @observable proposal_info = {};
    @observable purchase_info = {};

    debouncedProposal = debounce(this.requestProposal, 500);
    proposal_requests = {};

    initial_barriers;
    is_initial_barrier_applied = false;

    @action.bound
    init = async () => {
        // To be sure that the website_status response has been received before processing trading page.
        await BinarySocket.expectResponse('website_status');
               WS.activeSymbols().then(({ active_symbols }) => {
                       runInAction(() => {
                               this.active_symbols = active_symbols;
                       });
               });
    };

    constructor({ root_store }) {
        const local_storage_properties = [
            'amount',
            'barrier_1',
            'barrier_2',
            'basis',
            'contract_start_type',
            'contract_type',
            'duration',
            'duration_unit',
            'expiry_date',
            'expiry_type',
            'is_equal',
            'last_digit',
            'start_date',
            'start_time',
            'symbol',
        ];
        super({
            root_store,
            local_storage_properties,
            store_name,
            validation_rules: getValidationRules(),
        });

        // Adds intercept to change min_max value of duration validation
        reaction(
            () => [this.contract_expiry_type, this.duration_min_max, this.duration_unit, this.expiry_type],
            () => {
                this.changeDurationValidationRules();
            },
        );
        reaction(
            () => this.is_equal,
            () => {
                this.onAllowEqualsChange();
            },
        );
        reaction(
            () => this.symbol,
            () => {
                const date = resetEndTimeOnVolatilityIndices(this.symbol, this.expiry_type);
                if (date) {
                    this.expiry_date = date;
                }
            }
        );
        reaction(
            () => this.duration_unit,
            () => {
                this.contract_expiry_type = this.duration_unit === 't' ? 'tick' : 'intraday';
            }
        );
    }

    @computed
    get is_symbol_in_active_symbols() {
        return this.active_symbols
            .some(symbol_info => symbol_info.symbol === this.symbol && symbol_info.exchange_is_open === 1);
    }

    @action.bound
    refresh = () => {
        this.proposal_info     = {};
        this.purchase_info     = {};
        this.proposal_requests = {};
        WS.forgetAll('proposal');
    };

    @action.bound
    clearContract = () => {
        if (this.root_store.modules.smart_chart.is_contract_mode) {
            this.root_store.modules.contract_trade.onCloseContract();
        }
    };

    @action.bound
    setDefaultSymbol() {
        if (!this.is_symbol_in_active_symbols) {
            this.processNewValuesAsync({
                symbol: pickDefaultSymbol(this.active_symbols),
            });
        }
    }

    @action.bound
    async setActiveSymbols() {
        const { active_symbols, error } = this.smart_chart.should_refresh_active_symbols ?
            // if SmartCharts has requested active_symbols, we wait for the response
            await BinarySocket.expectResponse('active_symbols')
            : // else requests new active_symbols
            await WS.activeSymbols({ forced: true });

        if (error) {
            this.root_store.common.showError(localize('Trading is unavailable at this time.'));
            this.root_store.ui.setAppLoading(false);
            return;
        } else if (!active_symbols || !active_symbols.length) {
            showUnavailableLocationError(this.root_store.common.showError);
            this.root_store.ui.setAppLoading(false);
            return;
        }

        this.processNewValuesAsync({ active_symbols });
    }

    @action.bound
    async setContractTypes() {
        if (this.symbol && this.is_symbol_in_active_symbols) {
            await Symbol.onChangeSymbolAsync(this.symbol);
            runInAction(() => {
                this.processNewValuesAsync({
                    ...ContractType.getContractValues(this),
                    ...ContractType.getContractCategories(),
                });
            });
        }
    }

    @action.bound
    async prepareTradeStore() {
        this.smart_chart      = this.root_store.modules.smart_chart;
        this.currency         = this.root_store.client.currency;
        this.initial_barriers = { barrier_1: this.barrier_1, barrier_2: this.barrier_2 };

        await BinarySocket.expectResponse('authorize');
        await this.setActiveSymbols();
        runInAction(async() => {
            this.setDefaultSymbol();
            await this.setContractTypes();
            runInAction(() => {
                this.processNewValuesAsync({
                    is_market_closed: isMarketClosed(this.active_symbols, this.symbol),
                });
            });
        });
    }

    @action.bound
    onChangeMultiple(values) {
        Object.keys(values).forEach((name) => {
            if (!(name in this)) {
                throw new Error(`Invalid Argument: ${name}`);
            }
        });

        this.processNewValuesAsync({ ...values }, true);
    }

    @action.bound
    onChange(e) {
        const { name, value } = e.target;

        // save trade_chart_symbol upon user change
        if (name === 'symbol' && value) {
            this.root_store.modules.smart_chart.trade_chart_symbol = value;
        }

        if (name === 'currency') {
            this.root_store.client.selectCurrency(value);
        } else if (name === 'expiry_date') {
            this.expiry_time = null;
        } else if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }

        this.validateAllProperties();
        this.processNewValuesAsync({ [name]: value }, true);
    }

    @action.bound
    setPreviousSymbol(symbol) {
        if (this.previous_symbol !== symbol) this.previous_symbol = symbol;
    }

    @action.bound
    async resetPreviousSymbol() {
        this.setMarketStatus(isMarketClosed(this.active_symbols, this.previous_symbol));
        await Symbol.onChangeSymbolAsync(this.previous_symbol);
        runInAction(() => {
            this.previous_symbol = ''; // reset the symbol to default
        });
    }

    @action.bound
    onHoverPurchase(is_over, contract_type) {
        if (this.is_purchase_enabled) {
            this.smart_chart.updateBarrierShade(is_over, contract_type);
        }
    }

    @action.bound
    onPurchase(proposal_id, price, type) {
        if (!this.is_purchase_enabled) return;
        if (proposal_id) {
            this.is_purchase_enabled = false;
            processPurchase(proposal_id, price).then(action((response) => {
                if (this.proposal_info[type].id !== proposal_id) {
                    this.smart_chart.cleanupContractChartView();
                    this.smart_chart.applySavedTradeChartLayout();
                    throw new Error('Proposal ID does not match.');
                }
                if (response.buy) {
                    this.smart_chart.switchToContractMode();
                    const contract_data = {
                        ...this.proposal_requests[type],
                        ...this.proposal_info[type],
                        buy_price: response.buy.buy_price,
                    };
                    const {
                        contract_id,
                        longcode,
                        start_time,
                    } = response.buy;
                    // toggle smartcharts to contract mode
                    if (contract_id) {
                        // NOTE: changing chart granularity and chart_type has to be done in a different render cycle
                        // so we have to set chart granularity to zero, and change the chart_type to 'mountain' first,
                        // and then set the chart view to the start_time
                        this.smart_chart.setChartView(start_time);
                        // draw the start time line and show longcode then mount contract
                        this.root_store.modules.contract_trade.drawContractStartTime(start_time, longcode, contract_id);
                        this.root_store.ui.openPositionsDrawer();
                    }
                    this.root_store.gtm.pushPurchaseData(contract_data);
                } else if (response.error) {
                    // using javascript to disable purchase-buttons manually to compensate for mobx lag
                    this.disablePurchaseButtons();
                    this.root_store.common.services_error = {
                        type: response.msg_type,
                        ...response.error,
                    };
                    this.root_store.ui.toggleServicesErrorModal(true);
                }
                WS.forgetAll('proposal');
                this.purchase_info = response;
                this.is_purchase_enabled = true;
            }));
        }
    }

    disablePurchaseButtons = () => {
        const el_purchase_value    = document.getElementsByClassName('trade-container__price-info');
        const el_purchase_buttons  = document.getElementsByClassName('btn-purchase');
        [].forEach.bind(el_purchase_buttons, (el) => {
            el.classList.add('btn-purchase--disabled');
        })();
        [].forEach.bind(el_purchase_value, (el) => {
            el.classList.add('trade-container__price-info--fade');
        })();
    }

    /**
     * Updates the store with new values
     * @param  {Object} new_state - new values to update the store with
     * @return {Object} returns the object having only those values that are updated
     */
    @action.bound
    updateStore(new_state) {
        Object.keys(cloneObject(new_state)).forEach((key) => {
            if (key === 'root_store' || ['validation_rules', 'validation_errors', 'currency', 'smart_chart'].indexOf(key) > -1) return;
            if (JSON.stringify(this[key]) === JSON.stringify(new_state[key])) {
                delete new_state[key];
            } else {
                if (key === 'symbol') {
                    this.is_purchase_enabled = false;
                    this.is_trade_enabled    = false;
                }

                if (new_state.start_date && typeof new_state.start_date === 'string') {
                    new_state.start_date = parseInt(new_state.start_date);
                }

                this[key] = new_state[key];

                // validation is done in mobx intercept (base_store.js)
                // when barrier_1 is set, it is compared with store.barrier_2 (which is not updated yet)
                if (key === 'barrier_2' && new_state.barrier_1) {
                    this.barrier_1 = new_state.barrier_1; // set it again, after barrier_2 is updated in store
                }
            }
        });
        return new_state;
    }

    async processNewValuesAsync(
        obj_new_values = {},
        is_changed_by_user = false,
        obj_old_values = {},
        should_forget_first = true,
    ) {
        // Sets the default value to Amount when Currency has changed from Fiat to Crypto and vice versa.
        // The source of default values is the website_status response.
        if (should_forget_first) WS.forgetAll('proposal');
        if (is_changed_by_user &&
            /\bcurrency\b/.test(Object.keys(obj_new_values))
        ) {
            const prev_currency = obj_old_values &&
            !isEmptyObject(obj_old_values) &&
            obj_old_values.currency ? obj_old_values.currency : this.currency;
            if (isCryptocurrency(obj_new_values.currency) !== isCryptocurrency(prev_currency)) {
                obj_new_values.amount = is_changed_by_user && obj_new_values.amount ?
                    obj_new_values.amount : getMinPayout(obj_new_values.currency);
            }
            this.currency = obj_new_values.currency;
        }

        let has_only_forward_starting_contracts;

        if (Object.keys(obj_new_values).includes('symbol')) {
            this.setPreviousSymbol(this.symbol);
            await Symbol.onChangeSymbolAsync(obj_new_values.symbol);
            this.setMarketStatus(isMarketClosed(this.active_symbols, obj_new_values.symbol));
            has_only_forward_starting_contracts =
                ContractType.getContractCategories().has_only_forward_starting_contracts;
        }
        // TODO: remove all traces of setHasOnlyForwardingContracts and has_only_forward_starting_contracts in app
        //  once future contracts are implemented
        this.root_store.ui.setHasOnlyForwardingContracts(has_only_forward_starting_contracts);
        if (has_only_forward_starting_contracts) return;

        const new_state = this.updateStore(cloneObject(obj_new_values));

        if (is_changed_by_user || /\b(symbol|contract_types_list)\b/.test(Object.keys(new_state))) {
            this.updateStore({ // disable purchase button(s), clear contract info
                is_purchase_enabled: false,
                proposal_info      : {},
            });

            // To prevent infinite loop when changing from advanced end_time to digit type contract
            if (obj_new_values.contract_type && this.root_store.ui.is_advanced_duration) {
                if (isDigitTradeType(obj_new_values.contract_type)) {
                    this.barrier_1     = '';
                    this.barrier_2     = '';
                    this.expiry_type = 'duration';
                    this.root_store.ui.is_advanced_duration = false;
                }
            }

            if (!this.smart_chart.is_contract_mode) {
                const is_barrier_changed = 'barrier_1' in new_state || 'barrier_2' in new_state;
                if (is_barrier_changed) {
                    this.smart_chart.updateBarriers(this.barrier_1, this.barrier_2);
                } else {
                    this.smart_chart.removeBarriers();
                }
            }

            const snapshot            = await processTradeParams(this, new_state);
            snapshot.is_trade_enabled = true;

            this.updateStore({
                ...snapshot,
                ...(!this.is_initial_barrier_applied ? this.initial_barriers : {}),
            });
            this.is_initial_barrier_applied = true;

            if (/\bcontract_type\b/.test(Object.keys(new_state))) {
                this.validateAllProperties();
            }

            if (!this.smart_chart.is_contract_mode) {
                this.debouncedProposal();
            }
        }
    }

    @action.bound
    clearPurchaseInfo() {
        this.purchase_info = {};
        this.proposal_requests = {};
        this.proposal_info = {};
    }

    @action.bound
    requestProposal() {
        const requests = createProposalRequests(this);

        if (Object.values(this.validation_errors).some(e => e.length)) {
            this.proposal_info = {};
            this.purchase_info = {};
            WS.forgetAll('proposal');
            return;
        }

        if (!isEmptyObject(requests)) {
            this.proposal_requests = requests;
            this.proposal_info     = {};
            this.purchase_info     = {};
            this.root_store.modules.contract_trade.setIsDigitContract(Object.keys(this.proposal_requests)[0]);

            Object.keys(this.proposal_requests).forEach((type) => {
                WS.subscribeProposal(this.proposal_requests[type], this.onProposalResponse);
            });
        }
        this.root_store.ui.resetPurchaseStates();
    }

    @action.bound
    setMarketStatus(status) {
        this.is_market_closed = status;
    }

    @action.bound
    onProposalResponse(response) {
        // We do not want new proposal requests when in contract mode
        if (this.root_store.modules.smart_chart.is_contract_mode) return;
        const contract_type           = response.echo_req.contract_type;
        const prev_proposal_info      = getPropertyValue(this.proposal_info, contract_type) || {};
        const obj_prev_contract_basis = getPropertyValue(prev_proposal_info, 'obj_contract_basis') || {};

        this.proposal_info  = {
            ...this.proposal_info,
            [contract_type]: getProposalInfo(this, response, obj_prev_contract_basis),
        };

        if (!this.smart_chart.is_contract_mode) {
            const color = this.root_store.ui.is_dark_mode_on ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY;
            const barrier_config = { color };
            setChartBarrier(this.smart_chart, response, this.onChartBarrierChange, barrier_config);
        }

        if (response.error) {
            const error_id = getProposalErrorField(response);
            if (error_id) {
                this.setValidationErrorMessages(error_id, [response.error.message]);
            }
        } else {
            this.validateAllProperties();
        }

        this.is_purchase_enabled = true;
    }

    @action.bound
    onChartBarrierChange(barrier_1, barrier_2) {
        this.processNewValuesAsync({ barrier_1, barrier_2 }, true);
    }

    @action.bound
    onAllowEqualsChange() {
        this.processNewValuesAsync({ contract_type: parseInt(this.is_equal) ? 'rise_fall_equal' : 'rise_fall' }, true);
    }

    @action.bound
    updateSymbol(underlying) {
        if (!underlying) return;
        this.onChange({
            target: {
                name : 'symbol',
                value: underlying,
            },
        });
    }

    @action.bound
    changeDurationValidationRules() {
        if (this.expiry_type === 'endtime') {
            this.validation_errors.duration = [];
            return;
        }

        const index  = this.validation_rules.duration.rules.findIndex(item => item[0] === 'number');
        const limits = this.duration_min_max[this.contract_expiry_type] || false;

        if (limits) {
            const duration_options = {
                min: convertDurationLimit(+limits.min, this.duration_unit),
                max: convertDurationLimit(+limits.max, this.duration_unit),
            };

            if (index > -1) {
                this.validation_rules.duration.rules[index][1] = duration_options;
            } else {
                this.validation_rules.duration.rules.push(['number', duration_options]);
            }
            this.validateProperty('duration', this.duration);
        }
    }

    @action.bound
    accountSwitcherListener() {
        return new Promise(async (resolve) => {
            await this.processNewValuesAsync(
                { currency: this.root_store.client.currency },
                true,
                { currency: this.currency },
                false,
            );
            await this.clearContract();
            await this.resetErrorServices();
            await this.refresh();
            return resolve(this.debouncedProposal());
        });
    }

    @action.bound
    resetErrorServices() {
        this.root_store.ui.toggleServicesErrorModal(false);
    }

    @action.bound
    async onMount() {
        this.onLoadingMount();
        await this.prepareTradeStore();
        this.debouncedProposal();
        runInAction(() => {
            this.is_trade_component_mounted = true;
        });
        this.onSwitchAccount(this.accountSwitcherListener);
    }

    onLoadingMount() {
        const first_timeout = setTimeout(() => {
            const loading_message = localize('Your network connection might be slow.');
            const secondary_message = localize('Please wait for the page to finish loading.');
            this.root_store.ui.setSlowLoading(true, [loading_message, secondary_message]);
        }, 8000);

        const second_timeout = setTimeout(() => {
            const loading_message = localize('This page is taking too long to load.');
            const secondary_message = localize('Please wait for the page to finish loading or check your network connection.');
            this.root_store.ui.setSlowLoading(true, [loading_message, secondary_message]);
        }, 15000);

        const loading_interval = setInterval(() => {
            if (this.smart_chart) {
                if (this.smart_chart.is_chart_ready && this.is_trade_component_mounted) {
                    this.root_store.ui.setAppLoading(false);
                    clearInterval(loading_interval);
                    clearTimeout(first_timeout);
                    clearTimeout(second_timeout);
                }
            }
        }, 400);
    }

    @action.bound
    restoreTradeChart() {
        const smart_chart_store = this.root_store.modules.smart_chart;
        if (smart_chart_store.trade_chart_symbol &&
            (smart_chart_store.trade_chart_symbol !== this.symbol)) {
            this.symbol = smart_chart_store.trade_chart_symbol;
        }
        if (smart_chart_store.trade_chart_granularity &&
            (smart_chart_store.trade_chart_granularity !== smart_chart_store.granularity)) {
            smart_chart_store.granularity = smart_chart_store.trade_chart_granularity;
        } else {
            smart_chart_store.granularity = 0;
        }
        if (smart_chart_store.trade_chart_type !== smart_chart_store.chart_type) {
            smart_chart_store.chart_type = smart_chart_store.trade_chart_type;
        } else {
            smart_chart_store.chart_type = 'mountain';
        }
    }

    @action.bound
    onUnmount() {
        this.disposeSwitchAccount();
        this.proposal_info = {};
        this.purchase_info = {};
        WS.forgetAll('proposal');
        this.resetErrorServices();
        this.restoreTradeChart();
        this.is_trade_component_mounted = false;
        // clear url query string
        window.history.pushState(null, null, window.location.pathname);
    }
}

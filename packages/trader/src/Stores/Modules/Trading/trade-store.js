import debounce                       from 'lodash.debounce';
import {
    action,
    computed,
    observable,
    reaction,
    runInAction,
    toJS,
}                                     from 'mobx';
import CurrencyUtils                  from 'deriv-shared/utils/currency';
import ObjectUtils                    from 'deriv-shared/utils/object';
import { localize }                   from 'deriv-translations';
import { WS }                         from 'Services/ws-methods';
import {
    isDigitContractType,
    isDigitTradeType      }           from 'Modules/Trading/Helpers/digits';
import ServerTime                     from '_common/base/server_time';
import Shortcode                      from 'Modules/Reports/Helpers/shortcode';
import { processPurchase }            from './Actions/purchase';
import * as Symbol                    from './Actions/symbol';
import getValidationRules             from './Constants/validation-rules';
import {
    pickDefaultSymbol,
    showUnavailableLocationError,
    isMarketClosed,
}                                     from './Helpers/active-symbols';
import ContractType                   from './Helpers/contract-type';
import {
    convertDurationLimit,
    resetEndTimeOnVolatilityIndices } from './Helpers/duration';
import { processTradeParams }         from './Helpers/process';
import {
    createProposalRequests,
    getProposalErrorField,
    getProposalInfo }                 from './Helpers/proposal';
import { isBarrierSupported }         from '../SmartChart/Helpers/barriers';
import { ChartBarrierStore }          from '../SmartChart/chart-barrier-store';
import { BARRIER_COLORS }             from '../SmartChart/Constants/barriers';
import BaseStore                      from '../../base-store';

const store_name = 'trade_store';
const g_subscribers_map = {}; // blame amin.m

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
    @observable should_refresh_active_symbols = false;

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
    @observable main_barrier  = null;

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

    // Chart loader observables
    @observable is_chart_loading;

    debouncedProposal = debounce(this.requestProposal, 500);
    proposal_requests = {};

    initial_barriers;
    is_initial_barrier_applied = false;

    @action.bound
    init = async () => {
        // To be sure that the website_status response has been received before processing trading page.
        await WS.wait('authorize', 'website_status');
        WS.storage.activeSymbols('brief').then(({ active_symbols }) => {
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
    setTradeStatus(status) {
        this.is_trade_enabled = status;
    }

    @action.bound
    refresh() {
        this.proposal_info     = {};
        this.purchase_info     = {};
        this.proposal_requests = {};
        WS.forgetAll('proposal');
    }

    @action.bound
    clearContracts = () => {
        this.root_store.modules.contract_trade.contracts = [];
    };

    @action.bound
    async setDefaultSymbol() {
        if (!this.is_symbol_in_active_symbols) {
            await this.processNewValuesAsync({
                symbol: pickDefaultSymbol(this.active_symbols),
            });
        }
    }

    @action.bound
    async setActiveSymbols() {
        const { active_symbols, error } = this.should_refresh_active_symbols ?
            // if SmartCharts has requested active_symbols, we wait for the response
            await WS.wait('active_symbols')
            : // else requests new active_symbols
            await WS.activeSymbols();

        if (error) {
            this.root_store.common.showError(localize('Trading is unavailable at this time.'));
            return;
        } else if (!active_symbols || !active_symbols.length) {
            showUnavailableLocationError(this.root_store.common.showError);
            return;
        }

        this.processNewValuesAsync({ active_symbols });
    }

    @action.bound
    async setContractTypes() {
        if (this.symbol && this.is_symbol_in_active_symbols) {
            await Symbol.onChangeSymbolAsync(this.symbol);
            runInAction(() => {
                this.processNewValuesAsync(
                    {
                        ...ContractType.getContractValues(this),
                        ...ContractType.getContractCategories(),
                    },
                    false,
                    {},
                    false,
                );
            });
        }
    }

    @action.bound
    async prepareTradeStore() {
        this.currency         = this.root_store.client.currency;
        this.initial_barriers = { barrier_1: this.barrier_1, barrier_2: this.barrier_2 };

        await WS.wait('authorize');
        await this.setActiveSymbols();
        runInAction(async() => {
            await WS.contractsFor(this.symbol).then(async(r) => {
                if (r.error && r.error.code === 'InvalidSymbol') {
                    await this.resetRefresh();
                    await this.setActiveSymbols();
                    await pickDefaultSymbol();
                    runInAction(() => this.should_refresh_active_symbols = true);
                }
            });
            await this.setDefaultSymbol();
            await this.setContractTypes();
            await this.processNewValuesAsync({
                is_market_closed: isMarketClosed(this.active_symbols, this.symbol),
            },
            true,
            null,
            false,
            );
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

        if (name === 'symbol' && value) {
            // set trade params skeleton and chart loader to true until processNewValuesAsync resolves
            this.setChartStatus(true);
            this.is_trade_enabled = false;
            // this.root_store.modules.contract_trade.contracts = [];
            // TODO: Clear the contracts in contract-trade-store
        }

        if (name === 'currency') {
            // Only allow the currency dropdown change if client is not logged in
            if (!this.root_store.client.is_logged_in) {
                this.root_store.client.selectCurrency(value);
            }
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
    updateBarrierColor(is_dark_mode) {
        if (this.main_barrier) {
            this.main_barrier.updateBarrierColor(is_dark_mode);
        }
    }

    @action.bound
    onHoverPurchase(is_over, contract_type) {
        if (this.is_purchase_enabled && this.main_barrier) {
            this.main_barrier.updateBarrierShade(is_over, contract_type);
        }
    }

    @computed
    get main_barrier_flattened() {
        const is_digit_trade_type = isDigitTradeType(this.contract_type);
        return is_digit_trade_type ? null : toJS(this.main_barrier);
    }

    setMainBarrier = (proposal_info) => {
        if (!proposal_info) { return ; }
        const { contract_type, barrier, high_barrier, low_barrier } = proposal_info;

        if (isBarrierSupported(contract_type)) {
            const color = this.root_store.ui.is_dark_mode_on ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY;
            // create barrier only when it's available in response
            const main_barrier = new ChartBarrierStore(
                barrier || high_barrier,
                low_barrier,
                this.onChartBarrierChange,
                { color },
            );

            this.main_barrier = main_barrier;
            // this.main_barrier.updateBarrierShade(true, contract_type);
        } else { this.main_barrier = null; }
    };

    @action.bound
    onPurchase(proposal_id, price, type) {
        if (!this.is_purchase_enabled) return;
        if (proposal_id) {
            this.is_purchase_enabled = false;
            const is_tick_contract = this.duration_unit === 't';
            processPurchase(proposal_id, price).then(action((response) => {
                const last_digit = +this.last_digit;
                if (this.proposal_info[type].id !== proposal_id) {
                    throw new Error('Proposal ID does not match.');
                }
                if (response.buy) {
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
                        const shortcode = response.buy.shortcode;
                        const { category, underlying } = Shortcode.extractInfoFromShortcode(shortcode);
                        const is_digit_contract = isDigitContractType(category.toUpperCase());
                        const contract_type = category.toUpperCase();
                        this.root_store.modules.contract_trade.addContract({
                            contract_id,
                            start_time,
                            longcode,
                            underlying,
                            barrier: is_digit_contract ? last_digit : null,
                            contract_type,
                            is_tick_contract,
                        });
                        this.root_store.modules.portfolio.onBuyResponse({
                            contract_id,
                            longcode,
                            contract_type,
                        });
                        // NOTE: changing chart granularity and chart_type has to be done in a different render cycle
                        // so we have to set chart granularity to zero, and change the chart_type to 'mountain' first,
                        // and then set the chart view to the start_time
                        // draw the start time line and show longcode then mount contract
                        // this.root_store.modules.contract_trade.drawContractStartTime(start_time, longcode, contract_id);
                        this.root_store.ui.openPositionsDrawer();
                        this.proposal_info = {};
                        WS.forgetAll('proposal');
                        this.purchase_info = response;
                        this.proposal_requests = {};
                        this.debouncedProposal();
                        this.pushPurchaseDataToGtm(contract_data);
                        return;
                    }
                } else if (response.error) {
                    // using javascript to disable purchase-buttons manually to compensate for mobx lag
                    this.disablePurchaseButtons();
                    // invalidToken error will handle in socket-general.js
                    if (response.error.code !== 'InvalidToken') {
                        this.root_store.common.services_error = {
                            type: response.msg_type,
                            ...response.error,
                        };
                        this.root_store.ui.toggleServicesErrorModal(true);
                    }
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
    };

    /**
     * Updates the store with new values
     * @param  {Object} new_state - new values to update the store with
     * @return {Object} returns the object having only those values that are updated
     */
    @action.bound
    updateStore(new_state) {
        Object.keys(ObjectUtils.cloneObject(new_state)).forEach((key) => {
            if (key === 'root_store' || ['validation_rules', 'validation_errors', 'currency'].indexOf(key) > -1) return;
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
        if (/\bduration\b/.test(Object.keys(obj_new_values))) {
            // TODO: fix this in input-field.jsx
            if (typeof obj_new_values.duration === 'string') {
                obj_new_values.duration = +obj_new_values.duration;
            }
        }
        // Sets the default value to Amount when Currency has changed from Fiat to Crypto and vice versa.
        // The source of default values is the website_status response.
        if (should_forget_first) WS.forgetAll('proposal');
        if (is_changed_by_user &&
            /\bcurrency\b/.test(Object.keys(obj_new_values))
        ) {
            const prev_currency = obj_old_values &&
            !ObjectUtils.isEmptyObject(obj_old_values) &&
            obj_old_values.currency ? obj_old_values.currency : this.currency;
            if (CurrencyUtils.isCryptocurrency(obj_new_values.currency)
                !== CurrencyUtils.isCryptocurrency(prev_currency)) {
                obj_new_values.amount = is_changed_by_user && obj_new_values.amount ?
                    obj_new_values.amount : CurrencyUtils.getMinPayout(obj_new_values.currency);
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

        const new_state = this.updateStore(ObjectUtils.cloneObject(obj_new_values));

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

            // TODO: handle barrier updates on proposal api
            // const is_barrier_changed = 'barrier_1' in new_state || 'barrier_2' in new_state;

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

            this.debouncedProposal();
        }
    }

    @computed
    get show_digits_stats() {
        return isDigitTradeType(this.contract_type);
    }

    @action.bound
    pushPurchaseDataToGtm(contract_data) {
        const data = {
            event   : 'buy_contract',
            bom_ui  : 'new',
            contract: {
                amount       : contract_data.amount,
                barrier1     : contract_data.barrier,
                barrier2     : contract_data.barrier2,
                basis        : contract_data.basis,
                buy_price    : contract_data.buy_price,
                contract_type: contract_data.contract_type,
                currency     : contract_data.currency,
                date_expiry  : contract_data.date_expiry,
                date_start   : contract_data.date_start,
                duration     : contract_data.duration,
                duration_unit: contract_data.duration_unit,
                payout       : contract_data.payout,
                symbol       : contract_data.symbol,
            },
            settings: {
                theme           : this.root_store.ui.is_dark_mode_on ? 'dark' : 'light',
                positions_drawer: this.root_store.ui.is_positions_drawer_on ? 'open' : 'closed',
                purchase_confirm: this.root_store.ui.is_purchase_confirm_on ? 'enabled' : 'disabled',
                chart           : {
                    toolbar_position: this.root_store.ui.is_chart_layout_default ? 'bottom' : 'left',
                    chart_asset_info: this.root_store.ui.is_chart_asset_info_visible ? 'visible' : 'hidden',
                    chart_type      : this.root_store.modules.contract_trade.chart_type,
                    granularity     : this.root_store.modules.contract_trade.granularity,
                },
            },
        };
        this.root_store.gtm.pushDataLayer(data);
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

        if (!ObjectUtils.isEmptyObject(requests)) {
            this.proposal_requests = requests;
            this.proposal_info     = {};
            this.purchase_info     = {};

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
        const contract_type           = response.echo_req.contract_type;
        const prev_proposal_info      = ObjectUtils.getPropertyValue(this.proposal_info, contract_type) || {};
        const obj_prev_contract_basis = ObjectUtils.getPropertyValue(prev_proposal_info, 'obj_contract_basis') || {};

        this.proposal_info  = {
            ...this.proposal_info,
            [contract_type]: getProposalInfo(this, response, obj_prev_contract_basis),
        };

        this.setMainBarrier(response.echo_req);

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
        this.resetErrorServices();
        return this.processNewValuesAsync(
            { currency: this.root_store.client.currency },
            true,
            { currency: this.currency },
            false,
        )
            .then(this.refresh)
            .then(this.requestProposal);
    }

    @action.bound
    preSwitchAccountListener() {
        this.clearContracts();
        this.is_trade_enabled = false;
        return Promise.resolve();
    }

    @action.bound
    logoutListener() {
        this.should_refresh_active_symbols = true;
        this.clearContracts();
        this.refresh();
        this.debouncedProposal();
        this.resetErrorServices();
        return Promise.resolve();
    }

    @action.bound
    clientInitListener() {
        this.should_refresh_active_symbols = true;
        this.initAccountCurrency(this.root_store.client.currency);
        return Promise.resolve();
    }

    @action.bound
    networkStatusChangeListener(is_online) {
        this.setTradeStatus(is_online);
    }

    @action.bound
    themeChangeListener(is_dark_mode_on) {
        this.updateBarrierColor(is_dark_mode_on);
    }

    @action.bound
    resetErrorServices() {
        this.root_store.ui.toggleServicesErrorModal(false);
    }

    @action.bound
    onMount() {
        this.onPreSwitchAccount(this.preSwitchAccountListener);
        this.onSwitchAccount(this.accountSwitcherListener);
        this.onLogout(this.logoutListener);
        this.onClientInit(this.clientInitListener);
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        this.onThemeChange(this.themeChangeListener);
        this.setChartStatus(true);
        runInAction(async() => {
            this.is_trade_component_mounted = true;
            this.refresh();
            await this.prepareTradeStore();
            this.debouncedProposal();
        });
    }

    @action.bound
    setChartStatus(status) {
        this.is_chart_loading = status;
    }

    @action.bound
    async initAccountCurrency(new_currency) {
        await this.processNewValuesAsync(
            { currency: new_currency },
            true,
            { currency: this.currency },
            false,
        );
        this.refresh();
        WS.forgetAll('balance').then(() => {
            // the first has to be without subscribe to quickly update current account's balance
            WS.authorized.balance().then(this.handleResponseBalance);
            // the second is to subscribe to balance and update all sibling accounts' balances too
            WS.subscribeBalanceAll(this.handleResponseBalance);
        });
        this.debouncedProposal();
    }

    handleResponseBalance = (response) => {
        if (response.balance) {
            this.root_store.client.setBalance(response.balance);
        }
    };

    @action.bound
    onUnmount() {
        this.disposePreSwitchAccount();
        this.disposeSwitchAccount();
        this.disposeLogout();
        this.disposeClientInit();
        this.disposeNetworkStatusChange();
        this.disposeThemeChange();
        this.is_trade_component_mounted = false;
        // TODO: Find a more elegant solution to unmount contract-trade-store
        this.root_store.modules.contract_trade.onUnmount();
        this.refresh();
        this.resetErrorServices();
        if (this.root_store.ui.is_notifications_visible) {
            this.root_store.ui.toggleNotificationsModal();
        }
        // clear url query string
        window.history.pushState(null, null, window.location.pathname);
        if (this.prev_chart_layout) {
            this.prev_chart_layout.is_used = false;
        }
    }

    prev_chart_layout = null;
    get chart_layout() {
        let layout = null;
        if (this.prev_chart_layout && this.prev_chart_layout.is_used === false) {
            layout = this.prev_chart_layout;
        }
        return layout;
    }

    @action.bound
    exportLayout(layout) {
        delete layout.previousMaxTicks; // TODO: fix it in smartcharts
        this.prev_chart_layout = layout;
        this.prev_chart_layout.isDone = () => {
            this.prev_chart_layout.is_used = true;
            this.setChartStatus(false);
        };
    }

    // ---------- WS ----------
    wsSubscribe = (req, callback) => {
        if (req.subscribe === 1) {
            const key = JSON.stringify(req);
            const subscriber = WS.subscribeTicksHistory(req, callback);
            g_subscribers_map[key] = subscriber;
        }
    };

    wsForget = (req) => {
        const key = JSON.stringify(req);
        if (g_subscribers_map[key]) {
            g_subscribers_map[key].unsubscribe();
            delete g_subscribers_map[key];
        }
        // WS.forget('ticks_history', callback, match);
    };

    wsForgetStream = (stream_id) => {
        WS.forgetStream(stream_id);
    };

    wsSendRequest = (req) => {
        if (req.time) {
            return ServerTime.timePromise().then((server_time) => ({
                msg_type: 'time',
                time    : server_time.unix(),
            }));
        }
        if (req.active_symbols) {
            return this.should_refresh_active_symbols ?
                WS.activeSymbols('brief') : WS.wait('active_symbols');
        }
        return WS.storage.send(req);
    };

    @action.bound
    resetRefresh() {
        this.should_refresh_active_symbols = false;
    }
}

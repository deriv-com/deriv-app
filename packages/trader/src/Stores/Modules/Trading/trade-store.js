import * as Symbol from './Actions/symbol';

import {
    WS,
    cloneObject,
    convertDurationLimit,
    extractInfoFromShortcode,
    findFirstOpenMarket,
    getBarrierPipSize,
    getMinPayout,
    getPlatformSettings,
    getPropertyValue,
    isBarrierSupported,
    isCryptocurrency,
    isDesktop,
    isEmptyObject,
    isMarketClosed,
    isMobile,
    pickDefaultSymbol,
    removeBarrier,
    resetEndTimeOnVolatilityIndices,
    showDigitalOptionsUnavailableError,
    showMxMltUnavailableError,
    showUnavailableLocationError,
    formatMoney,
    getCurrencyDisplayCode,
    unsupported_contract_types_list,
} from '@deriv/shared';
import { localize } from '@deriv/translations';
import { getValidationRules, getMultiplierValidationRules } from 'Stores/Modules/Trading/Constants/validation-rules';
import { ContractType } from 'Stores/Modules/Trading/Helpers/contract-type';
import { isDigitContractType, isDigitTradeType } from 'Modules/Trading/Helpers/digits';
import ServerTime from '_common/base/server_time';
import { processPurchase } from './Actions/purchase';
import { getAvailableContractTypes } from 'Modules/Trading/Helpers/contract-type';
import { getUpdatedTicksHistoryStats } from './Helpers/accumulator';
import { processTradeParams } from './Helpers/process';
import { action, computed, makeObservable, observable, override, reaction, runInAction, toJS, when } from 'mobx';
import { createProposalRequests, getProposalErrorField, getProposalInfo } from './Helpers/proposal';
import { BARRIER_COLORS } from '../SmartChart/Constants/barriers';
import BaseStore from '../../base-store';
import { ChartBarrierStore } from '../SmartChart/chart-barrier-store';
import debounce from 'lodash.debounce';
import { setLimitOrderBarriers } from './Helpers/limit-orders';

const store_name = 'trade_store';
const g_subscribers_map = {}; // blame amin.m

export default class TradeStore extends BaseStore {
    // Control values
    is_trade_component_mounted = false;
    is_purchase_enabled = false;
    is_trade_enabled = false;
    is_equal = 0;
    has_equals_only = false;

    // Underlying
    symbol;
    is_market_closed = false;
    previous_symbol = '';
    active_symbols = [];

    form_components = [];

    // Contract Type
    contract_expiry_type = '';
    contract_start_type = '';
    contract_type = '';
    contract_types_list = {};
    trade_types = {};

    // Amount
    amount = 10;
    basis = '';
    basis_list = [];
    currency = '';
    stake_boundary = { VANILLALONGCALL: {}, VANILLALONGPUT: {} };

    // Duration
    duration = 5;
    duration_unit = '';
    duration_units_list = [];
    duration_min_max = {};
    expiry_date = '';
    expiry_time = '';
    expiry_type = 'duration';

    // Barrier
    barrier_1 = '';
    barrier_2 = '';
    barrier_count = 0;
    main_barrier = null;
    barriers = [];
    strike_price_choices = [];

    // Start Time
    start_date = Number(0); // Number(0) refers to 'now'
    start_dates_list = [];
    start_time = null;
    sessions = [];

    market_open_times = [];
    // End Date Time
    /**
     * An array that contains market closing time.
     *
     * e.g. ["04:00:00", "08:00:00"]
     *
     */
    market_close_times = [];

    // Last Digit
    last_digit = 5;
    is_mobile_digit_view_selected = false;

    // Purchase
    proposal_info = {};
    purchase_info = {};

    // Chart loader observables
    is_chart_loading;
    should_show_active_symbols_loading = false;

    // Accumulator trade params
    accumulator_range_list = [];
    growth_rate = 0.03;
    maximum_payout = 0;
    maximum_ticks = 0;
    ticks_history_stats = {};
    tick_size_barrier = 0;

    // Multiplier trade params
    multiplier;
    multiplier_range_list = [];
    stop_loss;
    take_profit;
    has_stop_loss = false;
    has_take_profit = false;
    has_cancellation = false;
    commission;
    cancellation_price;
    stop_out;
    expiration;
    hovered_contract_type;
    cancellation_duration = '60m';
    cancellation_range_list = [];

    // Vanilla trade params
    vanilla_trade_type = 'VANILLALONGCALL';

    // Mobile
    is_trade_params_expanded = true;

    //Toastbox
    contract_purchase_toast_box;

    addTickByProposal = () => null;
    debouncedProposal = debounce(this.requestProposal, 500);
    proposal_requests = {};
    is_purchasing_contract = false;

    initial_barriers;
    is_initial_barrier_applied = false;

    should_skip_prepost_lifecycle = false;

    constructor({ root_store }) {
        const local_storage_properties = [
            'amount',
            'currency',
            'barrier_1',
            'barrier_2',
            'basis',
            'contract_start_type',
            'contract_type',
            'duration',
            'duration_unit',
            'expiry_date',
            'expiry_type',
            'growth_rate',
            'has_take_profit',
            'has_stop_loss',
            'has_cancellation',
            'is_equal',
            'last_digit',
            'multiplier',
            'start_date',
            'start_time',
            'symbol',
            'stop_loss',
            'take_profit',
            'is_trade_params_expanded',
        ];
        super({
            root_store,
            local_storage_properties,
            store_name,
            validation_rules: getValidationRules(),
        });

        makeObservable(this, {
            accumulator_range_list: observable,
            active_symbols: observable,
            amount: observable,
            barrier_1: observable,
            barrier_2: observable,
            barrier_count: observable,
            barriers: observable,
            basis_list: observable,
            basis: observable,
            cancellation_duration: observable,
            cancellation_price: observable,
            cancellation_range_list: observable,
            commission: observable,
            contract_expiry_type: observable,
            contract_start_type: observable,
            contract_type: observable,
            contract_types_list: observable,
            currency: observable,
            duration_min_max: observable,
            duration_unit: observable,
            duration_units_list: observable,
            duration: observable,
            expiration: observable,
            expiry_date: observable,
            expiry_time: observable,
            expiry_type: observable,
            form_components: observable,
            growth_rate: observable,
            has_cancellation: observable,
            has_equals_only: observable,
            has_stop_loss: observable,
            has_take_profit: observable,
            hovered_contract_type: observable,
            is_accumulator: computed,
            is_chart_loading: observable,
            is_equal: observable,
            is_market_closed: observable,
            is_mobile_digit_view_selected: observable,
            is_purchase_enabled: observable,
            is_trade_component_mounted: observable,
            is_trade_enabled: observable,
            is_trade_params_expanded: observable,
            last_digit: observable,
            main_barrier: observable,
            market_close_times: observable,
            market_open_times: observable,
            maximum_payout: observable,
            maximum_ticks: observable,
            multiplier_range_list: observable,
            multiplier: observable,
            previous_symbol: observable,
            proposal_info: observable.ref,
            purchase_info: observable.ref,
            sessions: observable,
            setDefaultGrowthRate: action.bound,
            should_show_active_symbols_loading: observable,
            should_skip_prepost_lifecycle: observable,
            stake_boundary: observable,
            start_date: observable,
            start_dates_list: observable,
            start_time: observable,
            stop_loss: observable,
            stop_out: observable,
            strike_price_choices: observable,
            symbol: observable,
            take_profit: observable,
            ticks_history_stats: observable,
            tick_size_barrier: observable,
            trade_types: observable,
            accountSwitcherListener: action.bound,
            barrier_pipsize: computed,
            barriers_flattened: computed,
            changeDurationValidationRules: action.bound,
            chartStateChange: action.bound,
            clearContracts: action.bound,
            clearLimitOrderBarriers: action.bound,
            clearPurchaseInfo: action.bound,
            clientInitListener: action.bound,
            enablePurchase: action.bound,
            exportLayout: action.bound,
            forgetAllProposal: action.bound,
            getFirstOpenMarket: action.bound,
            has_alternative_source: computed,
            initAccountCurrency: action.bound,
            is_multiplier: computed,
            is_symbol_in_active_symbols: computed,
            is_synthetics_available: computed,
            is_vanilla: computed,
            loadActiveSymbols: action.bound,
            logoutListener: action.bound,
            main_barrier_flattened: computed,
            manageMxMltRemovalNotification: action.bound,
            networkStatusChangeListener: action.bound,
            onAllowEqualsChange: action.bound,
            onChange: action.bound,
            onChangeMultiple: action.bound,
            onChartBarrierChange: action.bound,
            onHoverPurchase: action.bound,
            onMount: action.bound,
            onProposalResponse: action.bound,
            onPurchase: action.bound,
            onUnmount: override,
            prepareTradeStore: action.bound,
            preSwitchAccountListener: action.bound,
            processPurchase: action.bound,
            pushPurchaseDataToGtm: action.bound,
            refresh: action.bound,
            requestProposal: action.bound,
            resetErrorServices: action.bound,
            resetPreviousSymbol: action.bound,
            resetAccumulatorData: action.bound,
            setActiveSymbols: action.bound,
            setAllowEqual: action.bound,
            setChartStatus: action.bound,
            setContractTypes: action.bound,
            setDefaultSymbol: action.bound,
            setIsTradeParamsExpanded: action.bound,
            setMarketStatus: action.bound,
            setMobileDigitView: action.bound,
            setPreviousSymbol: action.bound,
            setPurchaseSpotBarrier: action.bound,
            setSkipPrePostLifecycle: action.bound,
            setStakeBoundary: action.bound,
            setStrikeChoices: action.bound,
            setTradeStatus: action.bound,
            show_digits_stats: computed,
            themeChangeListener: action.bound,
            updateBarrierColor: action.bound,
            updateLimitOrderBarriers: action.bound,
            updateStore: action.bound,
            updateSymbol: action.bound,
            contract_purchase_toast_box: observable,
            clearContractPurchaseToastBox: action.bound,
            setContractPurchaseToastbox: action.bound,
        });

        // Adds intercept to change min_max value of duration validation
        reaction(
            () => [this.contract_expiry_type, this.duration_min_max, this.duration_unit, this.expiry_type],
            () => {
                this.changeDurationValidationRules();
            }
        );
        reaction(
            () => this.is_equal,
            () => {
                this.onAllowEqualsChange();
            }
        );
        reaction(
            () => this.symbol,
            () => {
                const date = resetEndTimeOnVolatilityIndices(this.symbol, this.expiry_type);
                if (date) {
                    this.expiry_date = date;
                }
                this.setDefaultGrowthRate();
                this.resetAccumulatorData();
            }
        );
        reaction(
            () => this.duration_unit,
            () => {
                this.contract_expiry_type = this.duration_unit === 't' ? 'tick' : 'intraday';
            }
        );
        reaction(
            () => [this.has_stop_loss, this.has_take_profit],
            () => {
                if (!this.has_stop_loss) {
                    this.validation_errors.stop_loss = [];
                }
                if (!this.has_take_profit) {
                    this.validation_errors.take_profit = [];
                }
            }
        );
        reaction(
            () => [this.contract_type],
            () => {
                this.root_store.portfolio.setContractType(this.contract_type);
                if (this.is_multiplier || this.is_accumulator) {
                    // when switching back to Multiplier contract, re-apply Stop loss / Take profit validation rules
                    Object.assign(this.validation_rules, getMultiplierValidationRules());
                } else {
                    // we need to remove these two validation rules on contract_type change
                    // to be able to remove any existing Stop loss / Take profit validation errors
                    delete this.validation_rules.stop_loss;
                    delete this.validation_rules.take_profit;
                }
                this.resetAccumulatorData();
            }
        );
        reaction(
            () => this.root_store.common.current_language,
            () => {
                this.setValidationRules(getValidationRules());
                this.changeDurationValidationRules();
                if (!this.amount) {
                    this.validateAllProperties();
                }
            }
        );
        when(
            () => this.accumulator_range_list.length,
            () => this.setDefaultGrowthRate()
        );
    }

    get is_symbol_in_active_symbols() {
        return this.active_symbols.some(
            symbol_info => symbol_info.symbol === this.symbol && symbol_info.exchange_is_open === 1
        );
    }

    resetAccumulatorData() {
        if (this.tick_size_barrier) this.tick_size_barrier = 0;
        if (!isEmptyObject(this.root_store.contract_trade.accumulator_barriers_data)) {
            this.root_store.contract_trade.clearAccumulatorBarriersData();
        }
    }

    setDefaultGrowthRate() {
        if (
            this.is_accumulator &&
            !this.accumulator_range_list.includes(this.growth_rate) &&
            this.accumulator_range_list.length
        ) {
            this.growth_rate = this.accumulator_range_list[0];
        }
    }

    setSkipPrePostLifecycle(should_skip) {
        if (!!should_skip !== !!this.should_skip_prepost_lifecycle) {
            // to skip assignment if no change is made
            this.should_skip_prepost_lifecycle = should_skip;
        }
    }

    setTradeStatus(status) {
        this.is_trade_enabled = status;
    }

    refresh() {
        this.forgetAllProposal();
        this.proposal_info = {};
        this.purchase_info = {};
        this.proposal_requests = {};
    }

    clearContracts = () => {
        this.root_store.contract_trade.contracts = [];
    };

    async loadActiveSymbols(should_set_default_symbol = true, should_show_loading = true) {
        this.should_show_active_symbols_loading = should_show_loading;

        await this.setActiveSymbols();
        await this.root_store.active_symbols.setActiveSymbols();
        if (should_set_default_symbol) await this.setDefaultSymbol();

        const r = await WS.storage.contractsFor(this.symbol);
        if (['InvalidSymbol', 'InputValidationFailed'].includes(r.error?.code)) {
            const symbol_to_update = await pickDefaultSymbol(this.active_symbols);
            await this.processNewValuesAsync({ symbol: symbol_to_update });
        }

        runInAction(() => {
            this.should_show_active_symbols_loading = false;
        });
    }

    async setDefaultSymbol() {
        if (!this.is_symbol_in_active_symbols) {
            this.is_trade_enabled = false;

            const symbol = await pickDefaultSymbol(this.active_symbols);
            await this.processNewValuesAsync({ symbol });
        }
    }

    async setActiveSymbols() {
        const is_on_mf_account = this.root_store.client.landing_company_shortcode === 'maltainvest';
        const hide_close_mx_mlt_storage_flag = !!parseInt(
            localStorage.getItem('hide_close_mx_mlt_account_notification')
        );
        const is_logged_in = this.root_store.client.is_logged_in;
        const clients_country = this.root_store.client.clients_country;
        const showError = this.root_store.common.showError;
        const setError = this.root_store.common.setError;

        // To resolve infinite load for Belgium and Isle of man logout IPs
        if (['be', 'im'].includes(clients_country) && !is_logged_in) {
            showUnavailableLocationError(showError, is_logged_in);
        }

        const { active_symbols, error } = await WS.authorized.activeSymbols();

        if (error) {
            showError({ message: localize('Trading is unavailable at this time.') });
            return;
        }

        if (!active_symbols || !active_symbols.length) {
            await WS.wait('get_settings');
            /*
             * This logic is related to EU country checks
             * Avoid moving this upward in the scope since mobx will lose reactivity
             */
            const can_have_mx_account = this.root_store.client.can_have_mx_account;
            const can_have_mlt_account = this.root_store.client.can_have_mlt_account;
            const can_have_mlt_or_mx_account = can_have_mlt_account || can_have_mx_account;

            if (can_have_mlt_or_mx_account && is_logged_in && !hide_close_mx_mlt_storage_flag) {
                setError(true, {
                    type: 'mx_mlt_removal',
                });
            } else if (is_logged_in && hide_close_mx_mlt_storage_flag) {
                showMxMltUnavailableError(showError, can_have_mlt_account, can_have_mx_account);
            } else if (!is_on_mf_account) {
                if (!hide_close_mx_mlt_storage_flag) {
                    setError(true, {
                        type: 'mx_mlt_removal',
                    });
                } else {
                    showUnavailableLocationError(showError, is_logged_in);
                }
                return;
            } else if (is_on_mf_account) {
                showDigitalOptionsUnavailableError(showError, {
                    text: localize(
                        'We’re working to have this available for you soon. If you have another account, switch to that account to continue trading. You may add a Deriv MT5 Financial.'
                    ),
                    title: localize('{{platform_name_trader}} is not available for this account', {
                        platform_name_trader: getPlatformSettings('trader').name,
                    }),
                    link: localize('Go to {{platform_name_mt5}} dashboard', {
                        platform_name_mt5: getPlatformSettings('mt5').name,
                    }),
                });
                return;
            }
        }
        await this.processNewValuesAsync({ active_symbols });
    }

    async setContractTypes() {
        if (this.symbol && this.is_symbol_in_active_symbols) {
            await Symbol.onChangeSymbolAsync(this.symbol);
            runInAction(() => {
                const contract_categories = ContractType.getContractCategories();
                //TODO yauheni, maryia - delete this 'if' statement when accumulators are allowed for real account, should leave 'else' box
                if (
                    this.is_accumulator &&
                    !this.root_store.client.is_virtual &&
                    contract_categories.contract_types_list.Accumulators
                ) {
                    delete contract_categories.contract_types_list.Accumulators;
                    this.processNewValuesAsync({
                        ...contract_categories,
                        ...ContractType.getContractType(contract_categories.contract_types_list),
                    });
                } else {
                    this.processNewValuesAsync({
                        ...contract_categories,
                        ...ContractType.getContractType(contract_categories.contract_types_list, this.contract_type),
                    });
                }
                this.processNewValuesAsync(ContractType.getContractValues(this));
            });
        }
        this.root_store.common.setSelectedContractType(this.contract_type);
        this.root_store.portfolio.setContractType(this.contract_type);
    }

    async prepareTradeStore(should_set_default_symbol = true) {
        this.initial_barriers = { barrier_1: this.barrier_1, barrier_2: this.barrier_2 };
        await when(() => !this.root_store.client.is_populating_account_list);

        // waits for `website_status` in order to set `stake_default` for the selected currency
        await WS.wait('website_status');
        await runInAction(async () => {
            await this.processNewValuesAsync(
                {
                    // fallback to default currency if current logged-in client hasn't selected a currency yet
                    currency: this.root_store.client.currency || this.root_store.client.default_currency,
                },
                true,
                null,
                false
            );
        });
        await this.loadActiveSymbols(should_set_default_symbol);
        await this.setContractTypes();
        await this.processNewValuesAsync(
            {
                is_market_closed: isMarketClosed(this.active_symbols, this.symbol),
            },
            true,
            null,
            false
        );
    }

    async onChangeMultiple(values) {
        Object.keys(values).forEach(name => {
            if (!(name in this)) {
                throw new Error(`Invalid Argument: ${name}`);
            }
        });

        await this.processNewValuesAsync({ ...values }, true); // wait for store to be updated
        this.validateAllProperties(); // then run validation before sending proposal
    }

    async onChange(e) {
        const { name, value } = e.target;
        if (name === 'symbol' && value) {
            // set trade params skeleton and chart loader to true until processNewValuesAsync resolves
            this.setChartStatus(true);
            // reset market close status
            this.setMarketStatus(false);
            this.is_trade_enabled = false;
            // this.root_store.modules.contract_trade.contracts = [];
            // TODO: Clear the contracts in contract-trade-store
        } else if (name === 'currency') {
            // Only allow the currency dropdown change if client is not logged in
            if (!this.root_store.client.is_logged_in) {
                this.root_store.client.selectCurrency(value);
            }
        } else if (name === 'expiry_date') {
            this.expiry_time = null;
        } else if (!(name in this)) {
            throw new Error(`Invalid Argument: ${name}`);
        }

        await this.processNewValuesAsync(
            { [name]: value },
            true,
            name === 'contract_type' ? { contract_type: this.contract_type } : {}, // refer to [Multiplier validation rules] below
            true
        ); // wait for store to be updated
        this.validateAllProperties(); // then run validation before sending proposal
        this.root_store.common.setSelectedContractType(this.contract_type);
    }

    setPreviousSymbol(symbol) {
        if (this.previous_symbol !== symbol) this.previous_symbol = symbol;
    }

    setAllowEqual(is_equal) {
        this.is_equal = is_equal;
    }

    setIsTradeParamsExpanded(value) {
        this.is_trade_params_expanded = value;
    }

    async resetPreviousSymbol() {
        this.setMarketStatus(isMarketClosed(this.active_symbols, this.previous_symbol));

        await Symbol.onChangeSymbolAsync(this.previous_symbol);
        await this.updateSymbol(this.symbol);

        this.setChartStatus(false);
        runInAction(() => {
            this.previous_symbol = ''; // reset the symbol to default
        });
    }

    updateBarrierColor(is_dark_mode) {
        if (this.main_barrier) {
            this.main_barrier.updateBarrierColor(is_dark_mode);
        }
    }

    onHoverPurchase(is_over, contract_type) {
        if (this.is_accumulator) return;
        if (this.is_purchase_enabled && this.main_barrier && !this.is_multiplier) {
            this.main_barrier.updateBarrierShade(is_over, contract_type);
        } else if (!is_over && this.main_barrier && !this.is_multiplier) {
            this.main_barrier.updateBarrierShade(false, contract_type);
        }

        this.hovered_contract_type = is_over ? contract_type : null;
        setLimitOrderBarriers({
            barriers: this.root_store.portfolio.barriers,
            is_over,
            contract_type,
            contract_info: this.proposal_info[contract_type],
        });
    }

    setPurchaseSpotBarrier(is_over, position) {
        const key = 'PURCHASE_SPOT_BARRIER';
        if (!is_over) {
            removeBarrier(this.root_store.portfolio.barriers, key);
            return;
        }

        let purchase_spot_barrier = this.root_store.portfolio.barriers.find(b => b.key === key);
        if (purchase_spot_barrier) {
            if (purchase_spot_barrier.high !== +position.contract_info.entry_spot) {
                purchase_spot_barrier.onChange({
                    high: position.contract_info.entry_spot,
                });
            }
        } else {
            purchase_spot_barrier = new ChartBarrierStore(position.contract_info.entry_spot);
            purchase_spot_barrier.key = key;
            purchase_spot_barrier.draggable = false;
            purchase_spot_barrier.hideOffscreenBarrier = true;
            purchase_spot_barrier.isSingleBarrier = true;
            purchase_spot_barrier.updateBarrierColor(this.root_store.ui.is_dark_mode_on);
            this.barriers.push(purchase_spot_barrier);
            this.root_store.portfolio.barriers.push(purchase_spot_barrier);
        }
    }

    updateLimitOrderBarriers(is_over, position) {
        const contract_info = position.contract_info;
        const { barriers } = this;
        setLimitOrderBarriers({
            barriers,
            contract_info,
            contract_type: contract_info.contract_type,
            is_over,
        });
    }

    clearLimitOrderBarriers() {
        this.hovered_contract_type = null;
        const { barriers } = this;
        setLimitOrderBarriers({
            barriers,
            is_over: false,
        });
    }

    get barrier_pipsize() {
        return getBarrierPipSize(this.barrier_1);
    }

    get main_barrier_flattened() {
        const is_digit_trade_type = isDigitTradeType(this.contract_type);
        return is_digit_trade_type ? null : toJS(this.main_barrier);
    }

    get barriers_flattened() {
        return this.root_store.portfolio.barriers && toJS(this.root_store.portfolio.barriers);
    }

    setMainBarrier = proposal_info => {
        if (!proposal_info) {
            return;
        }
        const { contract_type, barrier, high_barrier, low_barrier } = proposal_info;

        if (isBarrierSupported(contract_type)) {
            const color = this.root_store.ui.is_dark_mode_on ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY;
            // create barrier only when it's available in response
            this.main_barrier = new ChartBarrierStore(barrier || high_barrier, low_barrier, this.onChartBarrierChange, {
                color,
                not_draggable: this.is_vanilla,
            });
            // this.main_barrier.updateBarrierShade(true, contract_type);
        } else {
            this.main_barrier = null;
        }
    };

    onPurchase = debounce(this.processPurchase, 300);

    processPurchase(proposal_id, price, type) {
        if (!this.is_purchase_enabled) return;
        if (proposal_id) {
            this.is_purchase_enabled = false;
            this.is_purchasing_contract = true;
            const is_tick_contract = this.duration_unit === 't';
            processPurchase(proposal_id, price).then(
                action(response => {
                    if (!this.is_trade_component_mounted) {
                        this.enablePurchase();
                        this.is_purchasing_contract = false;
                        return;
                    }

                    const last_digit = +this.last_digit;
                    if (response.error) {
                        // using javascript to disable purchase-buttons manually to compensate for mobx lag
                        this.disablePurchaseButtons();
                        // invalidToken error will handle in socket-general.js
                        if (response.error.code !== 'InvalidToken') {
                            this.root_store.common.setServicesError({
                                type: response.msg_type,
                                ...response.error,
                            });

                            // Clear purchase info on mobile after toast box error disappears (mobile_toast_timeout = 3500)
                            if (isMobile() && this.root_store.common?.services_error?.type === 'buy') {
                                setTimeout(() => {
                                    this.clearPurchaseInfo();
                                    this.requestProposal();
                                }, 3500);
                            }
                        }
                    } else if (response.buy) {
                        if (this.proposal_info[type] && this.proposal_info[type].id !== proposal_id) {
                            throw new Error('Proposal ID does not match.');
                        }
                        const contract_data = {
                            ...this.proposal_requests[type],
                            ...this.proposal_info[type],
                            buy_price: response.buy.buy_price,
                        };
                        const { contract_id, longcode, start_time } = response.buy;

                        // toggle smartcharts to contract mode
                        if (contract_id) {
                            const shortcode = response.buy.shortcode;
                            const { category, underlying } = extractInfoFromShortcode(shortcode);
                            const is_digit_contract = isDigitContractType(category.toUpperCase());
                            const contract_type = category.toUpperCase();
                            this.root_store.contract_trade.addContract({
                                contract_id,
                                start_time,
                                longcode,
                                underlying,
                                barrier: is_digit_contract ? last_digit : null,
                                contract_type,
                                is_tick_contract,
                            });
                            this.root_store.portfolio.onBuyResponse({
                                contract_id,
                                longcode,
                                contract_type,
                            });
                            // NOTE: changing chart granularity and chart_type has to be done in a different render cycle
                            // so we have to set chart granularity to zero, and change the chart_type to 'mountain' first,
                            // and then set the chart view to the start_time
                            // draw the start time line and show longcode then mount contract
                            // this.root_store.modules.contract_trade.drawContractStartTime(start_time, longcode, contract_id);
                            if (isDesktop()) {
                                this.root_store.ui.openPositionsDrawer();
                            } else if (isMobile()) {
                                // TODO: Remove this when markers for multipliers are enabled
                                if (this.is_multiplier || this.is_accumulator) {
                                    this.root_store.ui.openPositionsDrawer();
                                }
                            }
                            this.proposal_info = {};
                            this.forgetAllProposal();
                            this.purchase_info = response;
                            this.proposal_requests = {};
                            this.debouncedProposal();
                            this.clearLimitOrderBarriers();
                            this.pushPurchaseDataToGtm(contract_data);
                            this.setContractPurchaseToastbox(response.buy);
                            this.is_purchasing_contract = false;
                            return;
                        }
                    }
                    this.forgetAllProposal();
                    this.purchase_info = response;
                    this.enablePurchase();
                    this.is_purchasing_contract = false;
                })
            );
        }
    }

    enablePurchase() {
        if (!this.root_store.client.is_unwelcome) {
            this.is_purchase_enabled = true;
        }
    }

    disablePurchaseButtons = () => {
        const el_purchase_value = document.getElementsByClassName('trade-container__price-info');
        const el_purchase_buttons = document.getElementsByClassName('btn-purchase');
        [].forEach.bind(el_purchase_buttons, el => {
            el.classList.add('btn-purchase--disabled');
        })();
        [].forEach.bind(el_purchase_value, el => {
            el.classList.add('trade-container__price-info--fade');
        })();
    };

    /**
     * Updates the store with new values
     * @param  {Object} new_state - new values to update the store with
     * @return {Object} returns the object having only those values that are updated
     */
    updateStore(new_state) {
        Object.keys(cloneObject(new_state) || {}).forEach(key => {
            if (key === 'root_store' || ['validation_rules', 'validation_errors', 'currency'].indexOf(key) > -1) return;
            if (JSON.stringify(this[key]) === JSON.stringify(new_state[key])) {
                delete new_state[key];
            } else {
                if (key === 'symbol') {
                    this.is_purchase_enabled = false;
                    this.is_trade_enabled = false;
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
        should_forget_first = true
    ) {
        // To switch to rise_fall_equal contract type when allow equal is checked on first page refresh or
        // when switch back to Rise/Fall from another contract type i.e.
        if (obj_new_values.contract_type && obj_new_values.contract_type === 'rise_fall' && !!this.is_equal) {
            obj_new_values.contract_type = 'rise_fall_equal';
        }
        // when accumulator is selected, we need to change chart type to mountain and granularity to 0
        // and we need to restore previous chart type and granularity when accumulator is unselected
        const {
            clearAccumulatorBarriersData,
            prev_chart_type,
            prev_granularity,
            chart_type,
            granularity,
            savePreviousChartMode,
            updateChartType,
            updateGranularity,
        } = this.root_store.contract_trade || {};
        if (obj_new_values.contract_type === 'accumulator') {
            clearAccumulatorBarriersData();
            savePreviousChartMode(chart_type, granularity);
            updateGranularity(0);
            updateChartType('mountain');
        } else if (
            (obj_new_values.contract_type || obj_new_values.symbol) &&
            prev_chart_type &&
            prev_granularity &&
            (prev_chart_type !== chart_type || prev_granularity !== granularity)
        ) {
            updateGranularity(prev_granularity);
            updateChartType(prev_chart_type);
            savePreviousChartMode('', null);
        }

        if (/\bduration\b/.test(Object.keys(obj_new_values))) {
            // TODO: fix this in input-field.jsx
            if (typeof obj_new_values.duration === 'string') {
                obj_new_values.duration = +obj_new_values.duration;
            }
        }
        // Sets the default value to Amount when Currency has changed from Fiat to Crypto and vice versa.
        // The source of default values is the website_status response.
        if (should_forget_first) {
            this.forgetAllProposal();
            this.proposal_requests = {};
        }
        if (is_changed_by_user && /\bcurrency\b/.test(Object.keys(obj_new_values))) {
            const prev_currency = obj_old_values?.currency || this.currency;
            const has_currency_changed = obj_new_values.currency !== prev_currency;

            const should_reset_stake =
                isCryptocurrency(obj_new_values.currency) ||
                // For switch between fiat and crypto and vice versa
                isCryptocurrency(obj_new_values.currency) !== isCryptocurrency(prev_currency);

            if (has_currency_changed && should_reset_stake) {
                obj_new_values.amount = obj_new_values.amount || getMinPayout(obj_new_values.currency);
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
            this.updateStore({
                // disable purchase button(s), clear contract info
                is_purchase_enabled: false,
                proposal_info: {},
            });

            // To prevent infinite loop when changing from advanced end_time to digit type contract
            if (obj_new_values.contract_type && this.root_store.ui.is_advanced_duration) {
                if (isDigitTradeType(obj_new_values.contract_type)) {
                    this.barrier_1 = '';
                    this.barrier_2 = '';
                    this.expiry_type = 'duration';
                    this.root_store.ui.is_advanced_duration = false;
                }
            }

            // TODO: handle barrier updates on proposal api
            // const is_barrier_changed = 'barrier_1' in new_state || 'barrier_2' in new_state;
            await processTradeParams(this, new_state);

            this.updateStore({
                ...(!this.is_initial_barrier_applied ? this.initial_barriers : {}),
            });
            this.is_initial_barrier_applied = true;
            if (/\b(contract_type|currency)\b/.test(Object.keys(new_state))) {
                this.validateAllProperties();
            }
            this.debouncedProposal();
        }

        //TODO yauheni, maryia - delete this 'if' statement when accumulators are allowed for real account
        if (!this.root_store.client.is_virtual) {
            delete this.contract_types_list.Accumulators;
        }
    }

    get is_synthetics_available() {
        return !!this.active_symbols?.find(item => item.market === 'synthetic_index');
    }

    get is_synthetics_trading_market_available() {
        return !!this.active_symbols?.find(
            item => item.market === 'synthetic_index' && !isMarketClosed(this.active_symbols, item.symbol)
        );
    }

    get show_digits_stats() {
        return isDigitTradeType(this.contract_type);
    }

    setMobileDigitView(bool) {
        this.is_mobile_digit_view_selected = bool;
    }

    pushPurchaseDataToGtm(contract_data) {
        const data = {
            event: 'buy_contract',
            bom_ui: 'new',
            contract: {
                amount: contract_data.amount,
                barrier1: contract_data.barrier,
                barrier2: contract_data.barrier2,
                basis: contract_data.basis,
                buy_price: contract_data.buy_price,
                contract_type: contract_data.contract_type,
                currency: contract_data.currency,
                date_expiry: contract_data.date_expiry,
                date_start: contract_data.date_start,
                duration: contract_data.duration,
                duration_unit: contract_data.duration_unit,
                payout: contract_data.payout,
                symbol: contract_data.symbol,
            },
            settings: {
                theme: this.root_store.ui.is_dark_mode_on ? 'dark' : 'light',
                positions_drawer: this.root_store.ui.is_positions_drawer_on ? 'open' : 'closed',
                chart: {
                    toolbar_position: this.root_store.ui.is_chart_layout_default ? 'bottom' : 'left',
                    chart_asset_info: this.root_store.ui.is_chart_asset_info_visible ? 'visible' : 'hidden',
                    chart_type: this.root_store.contract_trade.chart_type,
                    granularity: this.root_store.contract_trade.granularity,
                },
            },
        };
        this.root_store.gtm.pushDataLayer(data);
    }

    clearPurchaseInfo() {
        this.purchase_info = {};
        this.proposal_requests = {};
        this.proposal_info = {};
    }

    requestProposal() {
        const requests = createProposalRequests(this);
        if (Object.values(this.validation_errors).some(e => e.length)) {
            this.proposal_info = {};
            this.purchase_info = {};
            this.forgetAllProposal();
            return;
        }

        if (!isEmptyObject(requests)) {
            this.proposal_requests = requests;
            this.purchase_info = {};
            Object.keys(this.proposal_requests).forEach(type => {
                WS.subscribeProposal(this.proposal_requests[type], this.onProposalResponse);
            });
        }
        this.root_store.ui.resetPurchaseStates();
    }

    forgetAllProposal() {
        const length = Object.keys(this.proposal_requests).length;
        if (length > 0) WS.forgetAll('proposal');
    }

    setMarketStatus(status) {
        this.is_market_closed = status;
    }

    onProposalResponse(response) {
        const { contract_type } = response.echo_req;
        const prev_proposal_info = getPropertyValue(this.proposal_info, contract_type) || {};
        const obj_prev_contract_basis = getPropertyValue(prev_proposal_info, 'obj_contract_basis') || {};

        // add/update expiration or date_expiry for crypto indices from proposal
        const date_expiry = response.proposal?.date_expiry;

        if (!response.error && !!date_expiry && this.is_crypto_multiplier) {
            this.expiration = date_expiry;
        }

        this.proposal_info = {
            ...this.proposal_info,
            [contract_type]: getProposalInfo(this, response, obj_prev_contract_basis),
        };

        if (this.is_multiplier && this.proposal_info && this.proposal_info.MULTUP) {
            const { commission, cancellation, limit_order } = this.proposal_info.MULTUP;
            // commission and cancellation.ask_price is the same for MULTUP/MULTDOWN
            if (commission) {
                this.commission = commission;
            }
            if (cancellation) {
                this.cancellation_price = cancellation.ask_price;
            }
            this.stop_out = limit_order?.stop_out?.order_amount;
        }
        if (this.is_accumulator && this.proposal_info && this.proposal_info.ACCU) {
            const { maximum_ticks, ticks_stayed_in, tick_size_barrier, last_tick_epoch, maximum_payout } =
                this.proposal_info.ACCU;
            this.ticks_history_stats = getUpdatedTicksHistoryStats({
                previous_ticks_history_stats: this.ticks_history_stats,
                new_ticks_history_stats: ticks_stayed_in,
                last_tick_epoch,
            });
            this.maximum_ticks = maximum_ticks;
            this.maximum_payout = maximum_payout;
            this.tick_size_barrier = tick_size_barrier;
            const accumulator_barriers_data =
                this.root_store.contract_trade.accumulator_barriers_data[this.symbol] || {};
            if (!accumulator_barriers_data.accumulators_high_barrier) {
                this.root_store.contract_trade.updateAccumulatorBarriersAndSpots({
                    ...accumulator_barriers_data,
                    pip_size: this.pip_size,
                    symbol: this.symbol,
                    current_symbol: this.symbol,
                    tick_size_barrier,
                });
            }
        }

        if (!this.main_barrier || this.main_barrier?.shade) {
            this.setMainBarrier(response.echo_req);
        }

        if (this.hovered_contract_type === contract_type) {
            this.addTickByProposal(response);
            setLimitOrderBarriers({
                barriers: this.root_store.portfolio.barriers,
                contract_info: this.proposal_info[this.hovered_contract_type],
                contract_type,
                is_over: true,
            });
        }

        if (response.error) {
            const error_id = getProposalErrorField(response);
            if (error_id) {
                if (this.is_vanilla) {
                    /**
                     * This if-block ensures only the particular trade type's error message is selected
                     * even though 2 proposal calls are made
                     */
                    if (this.vanilla_trade_type === contract_type) {
                        this.setValidationErrorMessages(error_id, [response.error.message]);
                    }
                } else {
                    this.setValidationErrorMessages(error_id, [response.error.message]);
                }
            }
            // Commission for multipliers is normally set from proposal response.
            // But when we change the multiplier and if it is invalid, we don't get the proposal response to set the commission. We only get error message.
            // This is a work around to set the commission from error message.
            if (this.is_multiplier) {
                const { message, details } = response.error;
                const commission_match = (message || '').match(/\((\d+\.*\d*)\)/);
                if (details?.field === 'stop_loss' && commission_match?.[1]) {
                    this.commission = commission_match[1];
                }
            }

            // Sometimes the initial barrier doesn't match with current barrier choices received from API.
            // When this happens we want to populate the list of barrier choices to choose from since the value cannot be specified manually
            if (this.is_vanilla) {
                const { barrier_choices, max_stake, min_stake } = response.error.details;
                this.setStakeBoundary(contract_type, min_stake, max_stake);
                this.setStrikeChoices(barrier_choices);
                if (!this.strike_price_choices.includes(this.barrier_1)) {
                    // Since on change of duration `proposal` API call is made which returns a new set of barrier values.
                    // The new list is set and the mid value is assigned
                    const index = Math.floor(this.strike_price_choices.length / 2);
                    this.barrier_1 = this.strike_price_choices[index];
                    this.onChange({
                        target: {
                            name: 'barrier_1',
                            value: this.barrier_1,
                        },
                    });
                }
            }

            // Sometimes when we navigate fast, `forget_all` proposal is called immediately after proposal subscription calls.
            // But, in the BE, `forget_all` proposal call is processed before the proposal subscriptions are registered. In this case, `forget_all` proposal doesn't forget the new subscriptions.
            // So when we send new proposal subscription requests, we get `AlreadySubscribed` error.
            // If we get an error message with code `AlreadySubscribed`, `forget_all` proposal will be called and all the existing subscriptions will be marked as complete in `deriv-api` and will subscribe to new proposals
            if (response.error.code === 'AlreadySubscribed') {
                this.refresh();

                if (this.is_trade_component_mounted) {
                    this.debouncedProposal();
                }
                return;
            }
        } else {
            this.validateAllProperties();
            if (this.is_vanilla) {
                const { max_stake, min_stake, barrier_choices } = response.proposal;
                this.setStrikeChoices(barrier_choices);
                this.setStakeBoundary(contract_type, min_stake, max_stake);
            }
        }

        if (!this.is_purchasing_contract) {
            this.enablePurchase();
        }
    }

    onChartBarrierChange(barrier_1, barrier_2) {
        this.processNewValuesAsync({ barrier_1, barrier_2 }, true);
    }

    onAllowEqualsChange() {
        this.processNewValuesAsync({ contract_type: parseInt(this.is_equal) ? 'rise_fall_equal' : 'rise_fall' }, true);
    }

    updateSymbol(underlying) {
        if (!underlying) return;
        this.onChange({
            target: {
                name: 'symbol',
                value: underlying,
            },
        });
    }

    changeDurationValidationRules() {
        if (this.expiry_type === 'endtime') {
            this.validation_errors.duration = [];
            return;
        }

        if (!this.validation_rules.duration) return;

        const index = this.validation_rules.duration.rules.findIndex(item => item[0] === 'number');
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

    async accountSwitcherListener() {
        if (this.root_store.common.is_language_changing) {
            await this.loadActiveSymbols(false, false);
            this.root_store.common.is_language_changing = false;
        } else {
            await this.loadActiveSymbols(true, false);
        }

        this.resetErrorServices();
        await this.setContractTypes();
        runInAction(async () => {
            this.processNewValuesAsync(
                { currency: this.root_store.client.currency || this.root_store.client.default_currency },
                true,
                { currency: this.currency },
                false
            );
        });
        return Promise.resolve();
    }

    preSwitchAccountListener() {
        this.clearContracts();
        this.is_trade_enabled = false;
        return Promise.resolve();
    }

    async logoutListener() {
        this.clearContracts();
        this.refresh();
        this.resetErrorServices();
        if (this.root_store.common.is_language_changing) {
            await this.loadActiveSymbols(false);
            this.root_store.common.is_language_changing = false;
        } else {
            await this.loadActiveSymbols();
        }
        await this.setContractTypes();
        this.is_trade_enabled = true;
        this.debouncedProposal();
    }

    clientInitListener() {
        this.initAccountCurrency(this.root_store.client.currency || this.root_store.client.default_currency);
        return Promise.resolve();
    }

    networkStatusChangeListener(is_online) {
        this.setTradeStatus(is_online);
    }

    themeChangeListener(is_dark_mode_on) {
        this.updateBarrierColor(is_dark_mode_on);
    }

    resetErrorServices() {
        this.root_store.ui.toggleServicesErrorModal(false);
    }

    onMount() {
        if (this.is_trade_component_mounted && this.should_skip_prepost_lifecycle) {
            return;
        }
        this.root_store.notifications.setShouldShowPopups(false);
        this.onPreSwitchAccount(this.preSwitchAccountListener);
        this.onSwitchAccount(this.accountSwitcherListener);
        this.onLogout(this.logoutListener);
        this.onClientInit(this.clientInitListener);
        this.onNetworkStatusChange(this.networkStatusChangeListener);
        this.onThemeChange(this.themeChangeListener);
        this.setChartStatus(true);
        runInAction(async () => {
            this.is_trade_component_mounted = true;
            await this.prepareTradeStore();
            this.root_store.notifications.setShouldShowPopups(true);
        });
        // TODO: remove this function when the closure of MX and MLT accounts is completed.
        this.manageMxMltRemovalNotification();
    }

    manageMxMltRemovalNotification() {
        const { addNotificationMessage, client_notifications, notification_messages, unmarkNotificationMessage } =
            this.root_store.notifications;
        const get_notification_messages = JSON.parse(localStorage.getItem('notification_messages'));
        const { has_iom_account, has_malta_account, is_logged_in } = this.root_store.client;
        unmarkNotificationMessage({ key: 'close_mx_mlt_account' });
        if (get_notification_messages !== null && is_logged_in && (has_iom_account || has_malta_account)) {
            when(
                () => is_logged_in && notification_messages.length === 0,
                () => {
                    const hidden_close_account_notification =
                        parseInt(localStorage.getItem('hide_close_mx_mlt_account_notification')) === 1;
                    const should_retain_notification =
                        (has_iom_account || has_malta_account) && !hidden_close_account_notification;
                    if (should_retain_notification) {
                        addNotificationMessage(client_notifications.close_mx_mlt_account);
                    }
                }
            );
        }
    }

    setChartStatus(status) {
        this.is_chart_loading = status;
    }

    async initAccountCurrency(new_currency) {
        if (this.currency === new_currency) return;

        await this.processNewValuesAsync({ currency: new_currency }, true, { currency: this.currency }, false);
        this.refresh();
        this.debouncedProposal();
    }

    onUnmount() {
        if (this.should_skip_prepost_lifecycle) {
            return;
        }
        this.disposePreSwitchAccount();
        this.disposeSwitchAccount();
        this.disposeLogout();
        this.disposeClientInit();
        this.disposeNetworkStatusChange();
        this.disposeThemeChange();
        this.is_trade_component_mounted = false;
        // TODO: Find a more elegant solution to unmount contract-trade-store
        this.root_store.contract_trade.onUnmount();
        this.refresh();
        this.resetErrorServices();
        if (this.root_store.notifications.is_notifications_visible) {
            this.root_store.notifications.toggleNotificationsModal();
        }
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

    get is_crypto_multiplier() {
        return this.contract_type === 'multiplier' && /^cry/.test(this.symbol);
    }

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
        const passthrough_callback = (...args) => {
            callback(...args);
            if (this.is_accumulator) {
                let accumulator_barriers_data = {
                    current_symbol: this.symbol,
                    tick_size_barrier: this.tick_size_barrier,
                };
                if ('tick' in args[0]) {
                    const { current_spot, current_spot_time } =
                        this.root_store.contract_trade.accumulator_barriers_data[this.symbol] || {};
                    const { epoch, pip_size, quote, symbol } = args[0].tick;
                    accumulator_barriers_data = {
                        ...accumulator_barriers_data,
                        previous_spot: current_spot,
                        previous_spot_time: current_spot_time,
                        current_spot: quote,
                        current_spot_time: epoch,
                        pip_size,
                        symbol,
                    };
                } else if ('history' in args[0]) {
                    const { prices, times } = args[0].history;
                    const symbol = args[0].echo_req.ticks_history;
                    accumulator_barriers_data = {
                        ...accumulator_barriers_data,
                        previous_spot: prices[prices.length - 2],
                        previous_spot_time: times[times.length - 2],
                        current_spot: prices[prices.length - 1],
                        current_spot_time: times[times.length - 1],
                        pip_size: args[0].pip_size,
                        symbol,
                    };
                } else {
                    return;
                }
                this.root_store.contract_trade.updateAccumulatorBarriersAndSpots(accumulator_barriers_data);
            }
        };
        if (req.subscribe === 1) {
            const key = JSON.stringify(req);
            const subscriber = WS.subscribeTicksHistory(req, passthrough_callback);
            g_subscribers_map[key] = subscriber;
        }
    };

    wsForget = req => {
        const key = JSON.stringify(req);
        if (g_subscribers_map[key]) {
            g_subscribers_map[key].unsubscribe();
            delete g_subscribers_map[key];
        }
        // WS.forget('ticks_history', callback, match);
    };

    wsForgetStream = stream_id => {
        WS.forgetStream(stream_id);
    };

    wsSendRequest = req => {
        if (req.time) {
            return ServerTime.timePromise().then(server_time => {
                if (server_time) {
                    return {
                        msg_type: 'time',
                        time: server_time.unix(),
                    };
                }
                return WS.time();
            });
        }
        if (req.active_symbols) {
            return WS.activeSymbols('brief');
        }
        if (req.trading_times) {
            return WS.tradingTimes(req.trading_times);
        }
        return WS.storage.send(req);
    };

    chartStateChange(state, option) {
        const market_close_prop = 'isClosed';
        switch (state) {
            case 'MARKET_STATE_CHANGE':
                if (option && market_close_prop in option) {
                    if (this.is_trade_component_mounted && option[market_close_prop] !== this.is_market_closed)
                        this.prepareTradeStore(false);
                }
                break;
            default:
        }
    }

    refToAddTick = ref => {
        this.addTickByProposal = ref;
    };

    get has_alternative_source() {
        return this.is_multiplier && !!this.hovered_contract_type;
    }

    get is_accumulator() {
        return this.contract_type === 'accumulator';
    }

    get is_multiplier() {
        return this.contract_type === 'multiplier';
    }

    get is_vanilla() {
        return this.contract_type === 'vanilla';
    }

    setContractPurchaseToastbox(response) {
        const list = getAvailableContractTypes(this.contract_types_list, unsupported_contract_types_list);

        return (this.contract_purchase_toast_box = {
            key: true,
            buy_price: formatMoney(this.root_store.client.currency, response.buy_price, true, 0, 0),
            contract_type: this.contract_type,
            currency: getCurrencyDisplayCode(this.root_store.client.currency),
            list,
        });
    }

    clearContractPurchaseToastBox() {
        this.contract_purchase_toast_box = undefined;
    }

    async getFirstOpenMarket(markets_to_search) {
        if (this.active_symbols?.length) {
            return findFirstOpenMarket(this.active_symbols, markets_to_search);
        }
        const { active_symbols, error } = await WS.authorized.activeSymbols();
        if (error) {
            this.root_store.common.showError({ message: localize('Trading is unavailable at this time.') });
            return undefined;
        }
        return findFirstOpenMarket(active_symbols, markets_to_search);
    }

    setStrikeChoices(strike_prices) {
        this.strike_price_choices = strike_prices ?? [];
    }

    setStakeBoundary(type, min_stake, max_stake) {
        this.stake_boundary[type] = { min_stake, max_stake };
    }
}

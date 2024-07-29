import { action, computed, makeObservable, observable, override, reaction, runInAction, toJS } from 'mobx';

import {
    CONTRACT_TYPES,
    getAccuBarriersDTraderTimeout,
    getContractTypesConfig,
    isAccumulatorContract,
    isAccumulatorContractOpen,
    isCallPut,
    isDesktop,
    isEnded,
    isHighLow,
    isMultiplierContract,
    isTurbosContract,
    isVanillaContract,
    LocalStore,
    setTradeURLParams,
    switch_to_tick_chart,
    TRADE_TYPES,
} from '@deriv/shared';

import BaseStore from './base-store';
import { getAccumulatorMarkers } from './Helpers/chart-markers';
import ContractStore from './contract-store';

export default class ContractTradeStore extends BaseStore {
    // --- Observable properties ---
    contracts = [];
    contracts_map = {};
    has_error = false;
    error_message = '';

    // Chart specific observables
    granularity = +LocalStore.get('contract_trade.granularity') || 0;
    chart_type = LocalStore.get('contract_trade.chart_style') || 'line';
    prev_chart_type = '';
    prev_granularity = null;

    // Accumulator barriers data:
    accu_barriers_timeout_id = null;
    accumulator_barriers_data = {};
    accumulator_contract_barriers_data = {};

    constructor(root_store) {
        super({ root_store });

        makeObservable(this, {
            accu_barriers_timeout_id: observable,
            accumulator_barriers_data: observable.struct,
            accumulator_contract_barriers_data: observable.struct,
            clearAccumulatorBarriersData: action.bound,
            contracts: observable.shallow,
            has_crossed_accu_barriers: computed,
            has_error: observable,
            error_message: observable,
            granularity: observable,
            chart_type: observable,
            updateAccumulatorBarriersData: action.bound,
            updateChartType: action.bound,
            updateGranularity: action.bound,
            markers_array: computed,
            filtered_contracts: computed,
            addContract: action.bound,
            removeContract: action.bound,
            accountSwitchListener: action.bound,
            onUnmount: override,
            prev_chart_type: observable,
            prev_granularity: observable,
            updateProposal: action.bound,
            last_contract: computed,
            clearError: action.bound,
            getContractById: action.bound,
            prev_contract: computed,
            savePreviousChartMode: action.bound,
            setNewAccumulatorBarriersData: action.bound,
        });

        this.root_store = root_store;
        this.onSwitchAccount(this.accountSwitchListener);

        reaction(
            () => this.last_contract.contract_info,
            () => {
                if (!isAccumulatorContract(this.last_contract.contract_info?.contract_type)) return;
                const {
                    barrier_spot_distance,
                    current_spot,
                    current_spot_time,
                    current_spot_high_barrier,
                    current_spot_low_barrier,
                    is_sold,
                    underlying,
                } = this.last_contract.contract_info || {};
                if (current_spot && current_spot_high_barrier && !is_sold) {
                    this.updateAccumulatorBarriersData({
                        barrier_spot_distance,
                        current_spot_time,
                        accumulators_high_barrier: current_spot_high_barrier,
                        accumulators_low_barrier: current_spot_low_barrier,
                        should_update_contract_barriers: true,
                        underlying,
                    });
                } else if (!isAccumulatorContractOpen(this.last_contract.contract_info)) {
                    this.clearAccumulatorBarriersData(true, false);
                }
            }
        );
    }

    // -------------------
    // ----- Actions -----
    // -------------------

    clearAccumulatorBarriersData(should_clear_contract_data_only, should_clear_timeout = true) {
        if (this.accu_barriers_timeout_id && should_clear_timeout) clearTimeout(this.accu_barriers_timeout_id);
        if (!isAccumulatorContractOpen(this.last_contract.contract_info)) this.accumulator_contract_barriers_data = {};
        if (!should_clear_contract_data_only) {
            this.accumulator_barriers_data = {};
        }
    }

    setNewAccumulatorBarriersData(new_barriers_data, should_update_contract_barriers) {
        if (should_update_contract_barriers) {
            this.accumulator_contract_barriers_data = {
                ...this.accumulator_contract_barriers_data,
                ...new_barriers_data,
            };
        } else {
            this.accumulator_barriers_data = {
                ...this.accumulator_barriers_data,
                ...new_barriers_data,
            };
        }
    }

    updateAccumulatorBarriersData({
        accumulators_high_barrier,
        accumulators_low_barrier,
        barrier_spot_distance,
        current_spot,
        current_spot_time,
        prev_spot_time,
        should_update_contract_barriers,
        underlying,
    }) {
        if (current_spot) {
            const ticks_history_prev_spot_time = prev_spot_time ?? this.accumulator_barriers_data.current_spot_time;
            // update current tick coming from ticks_history while skipping an update for duplicate data
            if (current_spot_time === ticks_history_prev_spot_time) return;
            const current_spot_data = {
                current_spot,
                current_spot_time,
                ticks_history_prev_spot_time,
                tick_update_timestamp: Date.now(),
            };
            this.setNewAccumulatorBarriersData(current_spot_data, true);
            this.setNewAccumulatorBarriersData(current_spot_data);
            return;
        }
        const delayed_barriers_data = {
            accumulators_high_barrier,
            accumulators_low_barrier,
            barrier_spot_distance,
            should_update_contract_barriers,
            proposal_prev_spot_time: current_spot_time,
        };
        if (
            (this.accumulator_barriers_data.current_spot_time &&
                this.accumulator_barriers_data.current_spot_time !== current_spot_time &&
                !this.accumulator_barriers_data.accumulators_high_barrier) ||
            Object.keys(delayed_barriers_data).every(key =>
                should_update_contract_barriers
                    ? this.accumulator_contract_barriers_data[key] === delayed_barriers_data[key]
                    : this.accumulator_barriers_data[key] === delayed_barriers_data[key]
            )
        ) {
            // skip an update for duplicate data, or when a tick, which current barriers are related to, was not returned from ticks_history
            return;
        }
        // update barriers, which are returned from proposal/proposal_open_contract, after timeout on DTrader page
        const tick_update_timestamp = should_update_contract_barriers
            ? this.accumulator_contract_barriers_data.tick_update_timestamp
            : this.accumulator_barriers_data.tick_update_timestamp;
        if (document.hidden) {
            clearTimeout(this.accu_barriers_timeout_id);
            this.setNewAccumulatorBarriersData(delayed_barriers_data, should_update_contract_barriers);
            return;
        }
        this.accu_barriers_timeout_id = setTimeout(
            () => {
                runInAction(() => {
                    this.setNewAccumulatorBarriersData(delayed_barriers_data, should_update_contract_barriers);
                });
            },
            getAccuBarriersDTraderTimeout({
                barriers_update_timestamp: Date.now(),
                has_default_timeout: this.accumulator_barriers_data.current_spot_time !== current_spot_time,
                tick_update_timestamp,
                underlying,
            })
        );
    }

    updateChartType(type) {
        LocalStore.set('contract_trade.chart_style', type);
        this.chart_type = type;
        setTradeURLParams({ chartType: this.chart_type });
    }

    updateGranularity(granularity) {
        const tick_chart_types = ['line', 'candles', 'hollow', 'ohlc'];

        if (granularity === 0 && tick_chart_types.indexOf(this.chart_type) === -1) {
            this.chart_type = 'line';
        }

        LocalStore.set('contract_trade.granularity', granularity);
        this.granularity = granularity;
        if (this.granularity === 0) {
            this.root_store.notifications.removeNotificationMessage(switch_to_tick_chart);
        }
        setTradeURLParams({ granularity: this.granularity });
    }

    savePreviousChartMode(chart_type, granularity) {
        this.prev_chart_type = chart_type;
        this.prev_granularity = granularity;
    }

    applicable_contracts = () => {
        const { contract_type: trade_type, symbol: underlying } =
            JSON.parse(sessionStorage.getItem('trade_store')) || {};

        if (!trade_type || !underlying) {
            return [];
        }
        let { trade_types } = getContractTypesConfig()[trade_type];
        const is_call_put = isCallPut(trade_type);
        if (is_call_put) {
            // treat CALLE/PUTE and CALL/PUT the same
            trade_types = [CONTRACT_TYPES.CALLE, CONTRACT_TYPES.PUTE, CONTRACT_TYPES.CALL, CONTRACT_TYPES.PUT];
        } else if (isTurbosContract(trade_type)) {
            //to show both Long and Short recent contracts on DTrader chart
            trade_types = [CONTRACT_TYPES.TURBOS.LONG, CONTRACT_TYPES.TURBOS.SHORT];
        } else if (isVanillaContract(trade_type)) {
            //to show both Call and Put recent contracts on DTrader chart
            trade_types = [CONTRACT_TYPES.VANILLA.CALL, CONTRACT_TYPES.VANILLA.PUT];
        }

        return this.contracts
            .filter(c => c.contract_info.underlying === underlying)
            .filter(c => {
                const info = c.contract_info;
                const has_multiplier_contract_ended =
                    isMultiplierContract(info.contract_type) && isEnded(c.contract_info);
                // filter multiplier contract which has ended
                return !has_multiplier_contract_ended;
            })
            .filter(c => {
                const info = c.contract_info;

                const trade_type_is_supported = trade_types.indexOf(info.contract_type) !== -1;
                // both high_low & rise_fall have the same contract_types in POC response
                // entry_spot=barrier means it is rise_fall contract (blame the api)
                if (trade_type_is_supported && is_call_put && ((info.barrier && info.entry_tick) || info.shortcode)) {
                    if (`${+info.entry_tick}` === `${+info.barrier}` && !isHighLow(info)) {
                        return trade_type === TRADE_TYPES.RISE_FALL || trade_type === TRADE_TYPES.RISE_FALL_EQUAL;
                    }
                    return trade_type === TRADE_TYPES.HIGH_LOW;
                }
                return trade_type_is_supported;
            });
    };

    get has_crossed_accu_barriers() {
        const { symbol } = JSON.parse(sessionStorage.getItem('trade_store')) || {};
        const { current_spot: contract_current_spot, entry_spot, underlying } = this.last_contract.contract_info || {};
        const {
            accumulators_high_barrier,
            accumulators_low_barrier,
            current_spot,
            proposal_prev_spot_time,
            ticks_history_prev_spot_time,
        } =
            (isAccumulatorContractOpen(this.last_contract.contract_info)
                ? this.accumulator_contract_barriers_data
                : this.accumulator_barriers_data) || {};
        const is_knock_out =
            current_spot &&
            accumulators_high_barrier &&
            accumulators_low_barrier &&
            (current_spot >= accumulators_high_barrier || current_spot <= accumulators_low_barrier);
        const is_relevant_barrier =
            ticks_history_prev_spot_time && ticks_history_prev_spot_time === proposal_prev_spot_time;
        const should_highlight_contract_barriers =
            entry_spot && entry_spot !== contract_current_spot && underlying === symbol;
        return !!(
            is_knock_out &&
            is_relevant_barrier &&
            (!isAccumulatorContractOpen(this.last_contract.contract_info) || should_highlight_contract_barriers)
        );
    }

    get filtered_contracts() {
        return this.applicable_contracts();
    }

    get markers_array() {
        let markers = [];
        const { contract_type: trade_type } = JSON.parse(sessionStorage.getItem('trade_store')) || {};
        markers = this.applicable_contracts()
            .map(c => c.marker)
            .filter(m => m)
            .map(m => toJS(m));

        const { current_spot_time, entry_tick_time, exit_tick_time } = this.last_contract.contract_info || {};

        const should_show_poc_barriers =
            (entry_tick_time && entry_tick_time !== current_spot_time) ||
            (exit_tick_time && current_spot_time <= exit_tick_time);

        const { accumulators_high_barrier, accumulators_low_barrier, barrier_spot_distance, proposal_prev_spot_time } =
            (isAccumulatorContractOpen(this.last_contract.contract_info) &&
                should_show_poc_barriers &&
                this.accumulator_contract_barriers_data?.accumulators_high_barrier &&
                this.accumulator_contract_barriers_data) ||
            this.accumulator_barriers_data ||
            {};

        if (trade_type === TRADE_TYPES.ACCUMULATOR && proposal_prev_spot_time && accumulators_high_barrier) {
            const is_open = isAccumulatorContractOpen(this.last_contract.contract_info);
            markers.push(
                getAccumulatorMarkers({
                    high_barrier: accumulators_high_barrier,
                    low_barrier: accumulators_low_barrier,
                    barrier_spot_distance,
                    prev_epoch: proposal_prev_spot_time,
                    has_crossed_accu_barriers: this.has_crossed_accu_barriers,
                    is_dark_theme: this.root_store.ui.is_dark_mode_on,
                    contract_info: is_open ? this.last_contract.contract_info : {},
                    is_accumulator_trade_without_contract: !is_open || !entry_tick_time,
                })
            );
        }
        return markers;
    }

    addContract({
        barrier,
        contract_id,
        contract_type,
        start_time,
        longcode,
        underlying,
        is_tick_contract,
        limit_order = {},
    }) {
        const existing_contract = this.contracts_map[contract_id];
        if (existing_contract) {
            if (this.contracts.every(c => c.contract_id !== contract_id)) {
                this.contracts.push(existing_contract);
            }
            return;
        }
        const is_last_contract = contract_id === this.last_contract.contract_id;

        const contract = new ContractStore(this.root_store, { contract_id });
        contract.populateConfig(
            {
                date_start: start_time,
                barrier,
                contract_type,
                longcode,
                underlying,
                limit_order,
            },
            is_last_contract
        );

        this.contracts.push(contract);
        this.contracts_map[contract_id] = contract;

        if (is_tick_contract && !this.root_store.portfolio.is_multiplier && this.granularity !== 0 && isDesktop()) {
            this.root_store.notifications.addNotificationMessage(switch_to_tick_chart);
        }
    }

    removeContract({ contract_id }) {
        this.contracts = this.contracts.filter(c => c.contract_id !== contract_id);
        delete this.contracts_map[contract_id];
    }

    accountSwitchListener() {
        if (this.has_error) {
            this.clearError();
        }

        return Promise.resolve();
    }

    onUnmount() {
        this.disposeSwitchAccount();
        // TODO: don't forget the tick history when switching to contract-replay-store
    }

    // Called from portfolio
    updateProposal(response) {
        if ('error' in response) {
            this.has_error = true;
            this.error_message = response.error.message;
            return;
        }
        // Update the contract-store corresponding to this POC
        if (response.proposal_open_contract) {
            const contract_id = +response.proposal_open_contract.contract_id;
            const contract = this.contracts_map[contract_id];
            const is_last_contract = contract_id === this.last_contract.contract_id;
            contract.populateConfig(response.proposal_open_contract, is_last_contract);
            if (response.proposal_open_contract.is_sold) {
                this.root_store.notifications.removeNotificationMessage(switch_to_tick_chart);
                contract.cacheProposalOpenContractResponse(response);
            }
        }
    }

    get last_contract() {
        const applicable_contracts = this.applicable_contracts();
        const length = this.contracts[0]?.contract_info.current_spot_time ? applicable_contracts.length : -1;
        return length > 0 ? applicable_contracts[length - 1] : {};
    }

    get prev_contract() {
        const applicable_contracts = this.applicable_contracts();
        const length = this.contracts[0]?.contract_info.current_spot_time ? applicable_contracts.length : -1;
        return applicable_contracts[length - 2];
    }

    clearError() {
        this.error_message = '';
        this.has_error = false;
    }

    getContractById(contract_id) {
        return (
            this.contracts_map[contract_id] ||
            // or get contract from contract_replay store when user is on the contract details page
            this.root_store.contract_replay.contract_store
        );
    }
}

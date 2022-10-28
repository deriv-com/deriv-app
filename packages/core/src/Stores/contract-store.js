import { action, extendObservable, observable, toJS, makeObservable } from 'mobx';
import {
    isEnded,
    isEqualObject,
    isMultiplierContract,
    isDigitContract,
    getDigitInfo,
    getDisplayStatus,
    WS,
    getContractUpdateConfig,
    getContractValidationRules,
    BARRIER_COLORS,
    BARRIER_LINE_STYLES,
    isBarrierSupported,
    getEndTime,
} from '@deriv/shared';
import { getChartConfig } from './Helpers/logic';
import { setLimitOrderBarriers, getLimitOrder } from './Helpers/limit-orders';
import { ChartBarrierStore } from './chart-barrier-store';
import { createChartMarkers } from './Helpers/chart-markers';
import BaseStore from './base-store';

export default class ContractStore extends BaseStore {
    constructor(root_store, { contract_id }) {
        super({
            root_store,
            validation_rules: getContractValidationRules(),
        });

        makeObservable(this, {
            digits_info: observable,
            sell_info: observable,
            contract_config: observable.ref,
            display_status: observable,
            is_ended: observable,
            is_digit_contract: observable,
            error_message: observable,
            contract_info: observable.ref,
            is_static_chart: observable,
            end_time: observable,
            contract_update_take_profit: observable,
            contract_update_stop_loss: observable,
            has_contract_update_take_profit: observable,
            has_contract_update_stop_loss: observable,
            contract_update_history: observable.ref,
            margin: observable,
            barriers_array: observable.shallow,
            markers_array: observable.shallow,
            marker: observable.ref,
            populateConfig: action.bound,
            populateContractUpdateConfig: action.bound,
            populateContractUpdateHistory: action.bound,
            clearContractUpdateConfigValues: action.bound,
            onChange: action.bound,
            updateLimitOrder: action.bound,
        });

        this.root_store = root_store;
        this.contract_id = contract_id;
    }

    // --- Observable properties ---
    digits_info = observable.object({});
    sell_info = observable.object({});

    contract_config = {};
    display_status = 'purchased';
    is_ended = false;
    is_digit_contract = false;

    // TODO: see how to handle errors.
    error_message = '';

    contract_info = observable.object({});

    is_static_chart = false;
    end_time = null;

    // Multiplier contract update config
    contract_update_take_profit = '';
    contract_update_stop_loss = '';
    has_contract_update_take_profit = false;
    has_contract_update_stop_loss = false;
    contract_update_history = [];
    contract_update_config = {};

    // ---- chart props
    margin;
    barriers_array = [];
    markers_array = [];
    marker = null;

    // ---- Normal properties ---
    is_ongoing_contract = false;

    populateConfig(contract_info) {
        const prev_contract_info = this.contract_info;
        this.contract_info = contract_info;
        this.end_time = getEndTime(this.contract_info);

        // TODO: don't update the barriers & markers if they are not changed
        this.updateBarriersArray(contract_info, this.root_store.ui.is_dark_mode_on);
        this.markers_array = createChartMarkers(this.contract_info);
        this.marker = calculate_marker(this.contract_info);

        this.contract_config = getChartConfig(this.contract_info);
        this.display_status = getDisplayStatus(this.contract_info);
        this.is_ended = isEnded(this.contract_info);
        this.is_digit_contract = isDigitContract(this.contract_info.contract_type);
        // API doesn't return barrier for digit contracts (sometimes), remove this check once resolved
        if (!this.contract_info.barrier && prev_contract_info.barrier && this.is_digit_contract) {
            this.contract_info.barrier = prev_contract_info.barrier;
        }

        if (this.is_digit_contract) {
            extendObservable(this.digits_info, getDigitInfo(this.digits_info, this.contract_info));
        }

        // force to sell the expired contract, in order to remove from portfolio
        if (+contract_info.is_settleable === 1 && !contract_info.is_sold) {
            WS.send({ sell_expired: 1 });
        }

        const is_multiplier = isMultiplierContract(this.contract_info.contract_type);

        if (is_multiplier && contract_info.contract_id && contract_info.limit_order) {
            this.populateContractUpdateConfig(this.contract_info);
        }
    }

    cacheProposalOpenContractResponse = response => {
        const { contract_id } = response.proposal_open_contract;
        WS.storage.set({ proposal_open_contract: 1, contract_id }, response);
    };

    populateContractUpdateConfig(response) {
        const contract_update_config = getContractUpdateConfig(response);
        if (!isEqualObject(this.contract_update_config, contract_update_config)) {
            Object.assign(this, contract_update_config);
            this.contract_update_config = contract_update_config;

            const { contract_update, error } = response;
            if (contract_update && !error) {
                this.contract_info.limit_order = Object.assign(this.contract_info.limit_order || {}, contract_update);
            }
        }
    }

    populateContractUpdateHistory({ contract_update_history }) {
        this.root_store.contract_replay.contract_store.contract_update_history = contract_update_history.sort(
            (a, b) => b.order_date - a.order_date
        );
    }

    updateBarriersArray(contract_info, is_dark_mode) {
        if (!this.barriers_array.length) {
            this.barriers_array = this.createBarriersArray(contract_info, is_dark_mode);
            return;
        }

        const main_barrier = this.barriers_array[0];
        if (contract_info) {
            const { contract_type, barrier, high_barrier, low_barrier } = contract_info;

            if (isBarrierSupported(contract_type) && (barrier || high_barrier)) {
                main_barrier.updateBarriers(barrier || high_barrier, low_barrier);
                main_barrier.updateBarrierColor(is_dark_mode);
            }
            if (
                contract_info.contract_id &&
                contract_info.contract_id === this.root_store.contract_replay.contract_id
            ) {
                setLimitOrderBarriers({
                    barriers: this.barriers_array,
                    contract_info,
                    contract_type,
                    is_over: true,
                });
            }
        }
    }

    createBarriersArray = (contract_info, is_dark_mode) => {
        let barriers = [];
        if (contract_info) {
            const { contract_type, barrier, entry_spot, high_barrier, low_barrier } = contract_info;

            if (isBarrierSupported(contract_type) && (barrier || high_barrier || entry_spot)) {
                // create barrier only when it's available in response
                const main_barrier = new ChartBarrierStore(barrier || high_barrier || entry_spot, low_barrier, null, {
                    color: is_dark_mode ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY,
                    line_style: BARRIER_LINE_STYLES.SOLID,
                    not_draggable: true,
                });

                main_barrier.updateBarrierShade(true, contract_type);
                barriers = [main_barrier];
            }
        }
        return barriers;
    };

    clearContractUpdateConfigValues() {
        Object.assign(this, getContractUpdateConfig(this.contract_info));
        this.validation_errors.contract_update_stop_loss = [];
        this.validation_errors.contract_update_take_profit = [];
    }

    onChange({ name, value }) {
        this[name] = value;
        this.validateProperty(name, this[name]);
    }

    updateLimitOrder() {
        const limit_order = getLimitOrder(this);

        WS.contractUpdate(this.contract_id, limit_order).then(response => {
            if (response.error) {
                this.root_store.common.setServicesError({
                    type: response.msg_type,
                    ...response.error,
                });
                return;
            }

            // Update contract store
            this.populateContractUpdateConfig(response);
            if (this.root_store.ui.is_history_tab_active) {
                WS.contractUpdateHistory(this.contract_id).then(this.populateContractUpdateHistory);
            }

            // Update portfolio store
            this.root_store.portfolio.populateContractUpdate(response, this.contract_id);
        });
    }
}

function calculate_marker(contract_info) {
    if (!contract_info || isMultiplierContract(contract_info.contract_type)) {
        return null;
    }
    const {
        transaction_ids,
        tick_stream,
        contract_id,
        date_start,
        date_expiry,
        entry_tick,
        exit_tick,
        entry_tick_time,
        exit_tick_time,
        contract_type,
        tick_count,
        barrier_count,
        barrier,
        high_barrier,
        low_barrier,
    } = contract_info;
    const ticks_epoch_array = tick_stream ? tick_stream.map(t => t.epoch) : [];
    const is_digit_contract = isDigitContract(contract_type);

    // window.ci = toJS(contract_info);

    let price_array = [];
    if (is_digit_contract) {
        price_array = [];
    } else if (+barrier_count === 1 && barrier) {
        price_array = [+barrier];
    } else if (+barrier_count === 2 && high_barrier && low_barrier) {
        price_array = [+low_barrier, +high_barrier];
    }

    if (entry_tick) {
        price_array.push(entry_tick);
    }
    if (exit_tick) {
        price_array.push(exit_tick);
    }

    if (!date_start) {
        return null;
    }
    // if we have not yet received the first POC response
    if (!transaction_ids) {
        const type = is_digit_contract ? 'DigitContract' : 'TickContract';
        return {
            type,
            contract_info: toJS(contract_info),
            key: `${contract_id}-date_start`,
            epoch_array: [date_start],
            price_array,
        };
    }

    if (tick_count >= 1) {
        if (!isDigitContract(contract_type)) {
            // TickContract
            return {
                contract_info: toJS(contract_info),
                type: 'TickContract',
                key: `${contract_id}-date_start`,
                epoch_array: [date_start, ...ticks_epoch_array],
                price_array,
            };
        }
        // DigitContract
        return {
            contract_info: toJS(contract_info),
            type: 'DigitContract',
            key: `${contract_id}-date_start`,
            epoch_array: [date_start, ...ticks_epoch_array],
            price_array,
        };
    }
    // NonTickContract
    if (!tick_count) {
        // getEndTime returns undefined when contract is running.
        const end_time = getEndTime(contract_info) || date_expiry;
        // the order of items in epoch_array matches the NonTickContract params.
        const epoch_array = [date_start, end_time];
        if (entry_tick_time) {
            epoch_array.push(entry_tick_time);
        }
        if (exit_tick_time) {
            epoch_array.push(exit_tick_time);
        }
        return {
            contract_info: toJS(contract_info),
            type: 'NonTickContract',
            key: `${contract_id}-date_start`,
            epoch_array,
            price_array,
        };
    }
    return null;
}

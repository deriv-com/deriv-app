import { action, extendObservable, observable, toJS } from 'mobx';
import { getColor } from 'Modules/SmartChart/Components/AllMarkers/Helpers/colors';
import { createChartMarkers } from './Helpers/chart-markers';
import { getDigitInfo, isDigitContract } from './Helpers/digits';
import { getChartConfig, getDisplayStatus, getEndTime, isEnded, isContractWaiting } from './Helpers/logic';
import { BARRIER_COLORS, BARRIER_LINE_STYLES } from '../SmartChart/Constants/barriers';
import { isBarrierSupported, getBarrierShade } from '../SmartChart/Helpers/barriers';
import { ChartBarrierStore } from '../SmartChart/chart-barrier-store';

export default class ContractStore {
    constructor(root_store, { contract_id }) {
        this.root_store = root_store;
        this.contract_id = contract_id;
    }

    // --- Observable properties ---
    @observable digits_info = observable.object({});
    @observable sell_info = observable.object({});

    @observable contract_config = observable.object({});
    @observable display_status = 'purchased';
    @observable is_ended = false;
    @observable is_digit_contract = false;

    // TODO: see how to handle errors.
    @observable error_message = '';

    @observable contract_info = observable.object({});
    @observable is_static_chart = false;
    @observable end_time = null;

    // ---- chart props
    @observable margin;
    @observable barriers_array = [];
    @observable markers_array = [];
    @observable marker = null;

    // ---- Normal properties ---
    is_ongoing_contract = false;
    is_contract_waiting = false;

    @action.bound
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
        this.is_contract_waiting = isContractWaiting(contract_info);

        // API doesn't return barrier for digit contracts (sometimes), remove this check once resolved
        if (!this.contract_info.barrier && prev_contract_info.barrier && this.is_digit_contract) {
            this.contract_info.barrier = prev_contract_info.barrier;
        }

        if (this.is_digit_contract) {
            extendObservable(this.digits_info, getDigitInfo(this.digits_info, this.contract_info));
        }
    }

    updateBarriersArray(contract_info, is_dark_mode) {
        if (!this.barriers_array.length) {
            this.barriers_array = this.createBarriersArray(contract_info, is_dark_mode);
            return;
        }

        const main_barrier = this.barriers_array[0];
        if (contract_info) {
            const { contract_type, barrier, high_barrier, low_barrier, profit, status } = contract_info;

            if (isBarrierSupported(contract_type) && (barrier || high_barrier)) {
                main_barrier.shade = getBarrierShade(contract_info);
                main_barrier.shadeColor = getColor({
                    status,
                    profit,
                    is_dark_mode: this.root_store.ui.is_dark_mode_on,
                });

                main_barrier.updateBarriers(barrier || high_barrier, low_barrier);
                main_barrier.updateBarrierColor(is_dark_mode);
            }
        }
    }

    createBarriersArray = (contract_info, is_dark_mode) => {
        let result = [];
        if (contract_info) {
            const { contract_type, barrier, high_barrier, low_barrier, profit, status } = contract_info;

            if (isBarrierSupported(contract_type) && (barrier || high_barrier)) {
                // create barrier only when it's available in response
                const main_barrier = new ChartBarrierStore(barrier || high_barrier, low_barrier, null, {
                    color: is_dark_mode ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY,
                    line_style: BARRIER_LINE_STYLES.SOLID,
                    not_draggable: true,
                });
                main_barrier.shade = getBarrierShade(contract_info);
                main_barrier.shadeColor = getColor({
                    status,
                    profit,
                    is_dark_mode: this.root_store.ui.is_dark_mode_on,
                });

                main_barrier.updateBarrierShade(true, contract_type);
                result = [main_barrier];

                if (/RESET(CALL|PUT)/.test(contract_type)) {
                    const entry_barrier = new ChartBarrierStore(contract_info.entry_spot, null, null, {
                        color: is_dark_mode ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY,
                        line_style: BARRIER_LINE_STYLES.DASHED,
                        not_draggable: true,
                    });

                    result.push(entry_barrier);
                }
            }
        }
        return result;
    };
}

function calculate_marker(contract_info) {
    if (!contract_info) {
        return null;
    }
    const {
        transaction_ids,
        tick_stream,
        contract_id,
        current_spot_time,
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
        reset_time,
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

    if (tick_count >= 1 && isDigitContract(contract_type)) {
        // Digits Contract
        return {
            contract_info: toJS(contract_info),
            type: 'DigitContract',
            key: `${contract_id}-date_start`,
            epoch_array: [date_start, ...ticks_epoch_array],
            price_array,
        };
    } else if (tick_count >= 1) {
        // Tick Contract
        return {
            contract_info: toJS(contract_info),
            type: 'TickContract',
            key: `${contract_id}-date_start`,
            epoch_array: [date_start, reset_time || 0, ...ticks_epoch_array],
            price_array,
        };
    } else if (!tick_count) {
        // NonTick Contract
        // getEndTime returns undefined when contract is running.
        const end_time = getEndTime(contract_info) || date_expiry;

        const epoch_array = [date_start, end_time];
        epoch_array.push(...[entry_tick_time, exit_tick_time, current_spot_time, reset_time].map(epoch => epoch || 0));

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

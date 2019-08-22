import {
    action,
    extendObservable,
    observable,
    toJS,
} from 'mobx';
import { createChartMarkers } from './Helpers/chart-markers';
import {
    getDigitInfo,
    isDigitContract }         from './Helpers/digits';
import {
    getChartConfig,
    getDisplayStatus,
    getEndTime,
    isEnded }                 from './Helpers/logic';

import { BARRIER_COLORS, BARRIER_LINE_STYLES } from '../SmartChart/Constants/barriers';
import { isBarrierSupported } from '../SmartChart/Helpers/barriers';
import { ChartBarrierStore } from '../SmartChart/chart-barrier-store';
import contract from '../../../Modules/Contract/Containers/contract';

export default class ContractStore {

    constructor(root_store, { contract_id }) {
        this.root_store = root_store;
        this.contract_id = contract_id;
    }

    // --- Observable properties ---
    @observable digits_info = observable.object({});
    @observable sell_info   = observable.object({});

    @observable contract_config = observable.object({});
    @observable display_status = 'purchased';
    @observable is_ended = false;
    @observable is_digit_contract = false;

    // TODO: see how to handle errors.
    @observable error_message = '';
    // ---- Replay Contract Config ----
    @observable contract_id;
    @observable contract_info   = observable.object({});
    @observable is_static_chart = false;
    @observable end_time = null;

    // ---- chart props
    @observable margin;
    @observable barriers_array = [];
    @observable markers_array = [];
    @observable markers_array_v2 = [];

    // ---- Normal properties ---
    is_ongoing_contract = false;

    @action.bound
    populateConfig(contract_info) {
        this.contract_info = contract_info;
        this.end_time = getEndTime(this.contract_info);

        // TODO: don't update the barriers & markers if they are not changed
        this.updateBarriersArray(
            contract_info,
            this.root_store.ui.is_dark_mode_on
        );
        this.markers_array = createChartMarkers(this.contract_info);
        this.markers_array_v2 = calculate_markers(this.contract_info);

        this.contract_config = getChartConfig(this.contract_info);
        this.display_status = getDisplayStatus(this.contract_info);
        this.is_ended = isEnded(this.contract_info);
        this.is_digit_contract = isDigitContract(this.contract_info.contract_type);

        if (this.is_digit_contract) {
            extendObservable(
                this.digits_info,
                getDigitInfo(this.digits_info, this.contract_info)
            );
        }
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
                main_barrier.updateBarriers(
                    barrier || high_barrier,
                    low_barrier,
                );
                main_barrier.updateBarrierColor(is_dark_mode);
            }
        }
    }

    createBarriersArray = (contract_info, is_dark_mode) => {
        let result = [];
        if (contract_info) {
            const { contract_type, barrier, high_barrier, low_barrier } = contract_info;

            if (isBarrierSupported(contract_type) && (barrier || high_barrier)) {
                // create barrier only when it's available in response
                const main_barrier = new ChartBarrierStore(
                    barrier || high_barrier,
                    low_barrier,
                    null,
                    {   color        : is_dark_mode ? BARRIER_COLORS.DARK_GRAY : BARRIER_COLORS.GRAY,
                        line_style   : BARRIER_LINE_STYLES.SOLID,
                        not_draggable: true,
                    },
                );

                main_barrier.updateBarrierShade(true, contract_type);
                result = [ main_barrier ];
            }
        }
        return result;
    }
}

function calculate_markers(contract_info) {
    if (!contract_info) { return []; }
    const result = [];
    // console.warn(toJS(contract_info));
    const { tick_stream, contract_id, date_start, contract_type, exit_tick_time } = contract_info;
    const ticks_epoch_array = tick_stream ? tick_stream.map(t => t.epoch) : [];
    if (date_start) {
        result.push({
            contract_type,
            exit_tick_time,
            type       : 'SpotMarker',
            key        : `${contract_id}-date_start`,
            epoch_array: [date_start, ...ticks_epoch_array],
        });
    }
    return result;
}

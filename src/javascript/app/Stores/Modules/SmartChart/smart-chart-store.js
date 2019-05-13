import extend                 from 'extend';
import {
    action,
    computed,
    observable }              from 'mobx';
import { isEmptyObject }      from '_common/utility';
import ServerTime             from '_common/base/server_time';
import { WS }                 from 'Services';
import { ChartBarrierStore }  from './chart-barrier-store';
import { ChartMarkerStore }   from './chart-marker-store';
import {
    barriersObjectToArray,
    isBarrierSupported }      from './Helpers/barriers';
import BaseStore              from '../../base-store';

export default class SmartChartStore extends BaseStore {
    @observable chart_type;
    @observable granularity;
    @observable barriers = observable.object({});
    @observable markers  = observable.object({});

    @observable is_contract_mode = false;
    @observable is_title_enabled = true;

    @observable range = observable.object({
        start_epoch: null,
        end_epoch  : null,
    });

    @observable scroll_to_left_epoch        = null;
    @observable scroll_to_left_epoch_offset = 0;

    @observable chart_id             = 'trade';
    @observable should_import_layout = false;
    @observable should_export_layout = false;
    @observable should_clear_chart   = false;
    @observable trade_chart_layout   = null;
    trade_chart_symbol               = null;

    @action.bound
    updateChartType(type) {
        this.chart_type = type;
    }

    @action.bound
    updateGranularity(granularity) {
        this.granularity = granularity;
    }

    @action.bound
    updateEpochScrollToValue(epoch) {
        this.scroll_to_left_epoch = epoch;
    }

    @action.bound
    updateEpochScrollToOffset(offset) {
        this.scroll_to_left_epoch_offset = offset;
    }

    @action.bound
    cleanupContractChartView() {
        this.removeBarriers();
        this.removeMarkers();
        this.removeRange();
        this.resetScrollToLeft();
        this.setContractMode(false);
    }

    @action.bound
    resetScrollToLeft() {
        this.scroll_to_left_epoch = null;
        this.scroll_to_left_epoch_offset = null;
    }

    @action.bound
    setContractMode(is_contract_mode) {
        this.is_contract_mode = is_contract_mode;
        this.is_title_enabled = !is_contract_mode;
    }

    @action.bound
    onMount = () => {
        if (this.trade_chart_layout && !isEmptyObject(this.trade_chart_layout)) {
            this.applySavedTradeChartLayout();
        }
    }

    @action.bound
    onUnmount = () => {
        this.symbol = null;
        this.removeBarriers();
        this.removeMarkers();
    };

    // --------- Set Contract Scroll to Left ---------
    @action.bound
    setChartView(scroll_to_left_epoch) {
        this.updateEpochScrollToOffset(1);
        this.updateEpochScrollToValue(scroll_to_left_epoch);
    }

    // --------- All Contracts ---------
    @action.bound
    setRangeStart(start) {
        this.range.start_epoch = start;
    }

    @action.bound
    setRangeEnd(end) {
        this.range.end_epoch = end;
    }

    @action.bound
    removeRange() {
        this.range.start_epoch = null;
        this.range.end_epoch   = null;
    }

    // ---------- Barriers ----------
    @action.bound
    createBarriers = (contract_type, high_barrier, low_barrier, onChartBarrierChange, barrier_config) => {
        if (isEmptyObject(this.barriers.main)) {
            let main_barrier = {};
            if (isBarrierSupported(contract_type)) {
                main_barrier = new ChartBarrierStore(high_barrier, low_barrier, onChartBarrierChange, barrier_config);
            }

            this.barriers = {
                main: main_barrier,
            };
        }
    };

    @action.bound
    updateBarriers(barrier_1, barrier_2) {
        if (!isEmptyObject(this.barriers.main)) {
            this.barriers.main.updateBarriers(barrier_1, barrier_2);
        }
    }

    @action.bound
    updateBarrierShade(should_display, contract_type) {
        if (!isEmptyObject(this.barriers.main)) {
            this.barriers.main.updateBarrierShade(should_display, contract_type);
        }
    }

    @action.bound
    updateBarrierColor(is_dark_mode) {
        this.barriers.main.updateBarrierColor(is_dark_mode);
    }

    @action.bound
    removeBarriers() {
        this.barriers = {};
    }

    @action.bound
    saveAndClearTradeChartLayout() {
        this.should_export_layout = true;
        this.should_import_layout = false;
        this.trade_chart_symbol   = this.root_store.modules.trade.symbol;
        this.chart_id             = 'contract';
    }

    @action.bound
    applySavedTradeChartLayout() {
        this.should_export_layout = false;
        this.should_import_layout = true;
        this.should_clear_chart   = false;
        this.chart_id             = 'trade';

        this.trade_chart_layout.isDone = action(() => {
            this.trade_chart_layout   = null;
            this.should_import_layout = false;

            // Reset back to symbol before loading contract if trade_symbol and contract_symbol don't match
            if (this.trade_chart_symbol !== this.root_store.modules.trade.symbol) {
                this.root_store.modules.trade.updateSymbol(this.trade_chart_symbol);
            }
        });
    }

    @action.bound
    exportLayout(layout) {
        this.trade_chart_layout = layout;
        this.should_clear_chart = true;
    }

    @computed
    get barriers_array() {
        return barriersObjectToArray(this.barriers);
    }

    // ---------- Markers ----------
    @action.bound
    createMarker(config) {
        this.markers = extend({}, this.markers, {
            [config.type]: new ChartMarkerStore(config.marker_config, config.content_config),
        });
    }

    @action.bound
    removeMarkers() {
        this.markers = {};
    }

    @computed
    get markers_array() {
        return barriersObjectToArray(this.markers);
    }

    // ---------- Chart Settings ----------
    @computed
    get settings() { // TODO: consider moving chart settings from ui_store to chart_store
        return (({ common, ui } = this.root_store) => ({
            assetInformation: ui.is_chart_asset_info_visible,
            countdown       : ui.is_chart_countdown_visible,
            lang            : common.current_language,
            position        : ui.is_chart_layout_default ? 'bottom' : 'left',
            theme           : ui.is_dark_mode_on ? 'dark' : 'light',
        }))();
    }

    // ---------- WS ----------
    wsSubscribe = (request_object, callback) => {
        if (request_object.subscribe !== 1) return;
        WS.subscribeTicksHistory({ ...request_object }, callback); // use a copy of the request_object to prevent updating the source
    };

    wsForget = (match_values, callback) => (
        WS.forget('ticks_history', callback, match_values)
    );

    wsSendRequest = (request_object) => {
        if (request_object.time) {
            return ServerTime.timePromise.then(() => ({
                msg_type: 'time',
                time    : ServerTime.get().unix(),
            }));
        }
        return WS.sendRequest(request_object);
    };
}

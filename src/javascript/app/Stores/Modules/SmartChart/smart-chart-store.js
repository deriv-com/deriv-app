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
    barriers_empty_array = [];
    markers_empty_array = [];

    @observable is_contract_mode = false;
    @observable is_static_chart  = false;
    @observable is_title_enabled = true;

    @observable start_epoch;
    @observable end_epoch;
    @observable margin;

    @observable scroll_to_left_epoch        = null;
    @observable scroll_to_left_epoch_offset = 0;

    @observable chart_id             = 'trade';
    @observable replay_id            = 'contract-replay';
    @observable is_chart_loading     = false;
    @observable is_chart_ready       = false;
    @observable should_import_layout = false;
    @observable should_export_layout = false;
    @observable should_clear_chart   = false;
    @observable trade_chart_layout   = null;
    trade_chart_symbol               = null;

    @action.bound
    switchToContractMode(is_from_positions = false, granularity = 0, chart_type = 'mountain') {
        this.saveAndClearTradeChartLayout('contract');
        this.setContractMode(true);
        if (!is_from_positions) {
            this.updateGranularity(granularity);
            this.updateChartType(chart_type);
        }
    }

    @action.bound
    getChartStatus(status) {
        this.is_chart_ready = status;
    }

    @action.bound
    updateChartType(type) {
        this.chart_type = type;
    }

    @action.bound
    updateGranularity(granularity) {
        this.granularity = granularity;
    }

    @action.bound
    updateMargin(duration) {
        this.margin = Math.floor(!this.granularity ?
            (Math.max(300, (30 * duration) / (60 * 60) || 0))
            :
            3 * this.granularity);
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
        this.margin = null;
        this.removeBarriers();
        this.removeMarkers();
        this.resetScrollToLeft();
        this.setContractMode(false);
        this.setContractStart(null);
        this.setContractEnd(null);
        this.setStaticChart(false);
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
        // remove any barriers and markers before chart is ready
        if (this.trade_chart_layout && !isEmptyObject(this.trade_chart_layout)) {
            this.applySavedTradeChartLayout();
        }
    };

    @action.bound
    onUnmount = () => {
        this.symbol = null;
        this.trade_chart_layout = null;
        this.should_import_layout = false;
        this.setIsChartLoading(false);
        this.cleanupContractChartView();
    };

    // --------- Set Contract Scroll to Left ---------
    @action.bound
    setChartView(scroll_to_left_epoch) {
        this.updateEpochScrollToOffset(1);
        this.updateEpochScrollToValue(scroll_to_left_epoch);
    }

    // --------- All Contracts ---------
    @action.bound
    setContractStart(start) {
        this.start_epoch = start;
    }

    @action.bound
    setContractEnd(end) {
        this.end_epoch = end;
    }

    @action.bound
    setIsChartLoading(bool) {
        this.is_chart_loading = bool;
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
        if (!isEmptyObject(this.barriers.main)) {
            this.barriers.main.updateBarrierColor(is_dark_mode);
        }
    }

    @action.bound
    removeBarriers() {
        this.barriers = {};
    }

    @action.bound
    saveAndClearTradeChartLayout(chart_id) {
        this.should_export_layout = true;
        this.should_import_layout = false;
        this.trade_chart_symbol   = this.root_store.modules.trade.symbol;
        this.chart_id             = chart_id;
    }

    @action.bound
    applySavedTradeChartLayout() {
        if (!this.trade_chart_layout) return;

        this.setIsChartLoading(true);
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

            // Clear chart loading status once ChartListener returns ready
            if (this.is_chart_ready) {
                this.setIsChartLoading(false);
            }
        });
    }

    @action.bound
    exportLayout(layout) {
        this.trade_chart_layout = layout;
        this.should_clear_chart = true;
    }

    @action.bound
    setStaticChart(bool) {
        this.is_static_chart = bool;
    }

    @computed
    get barriers_array() {
        let has_differing = false;
        const barriers_array = barriersObjectToArray(this.barriers, []);

        if (this.barriers_empty_array.length !== barriers_array.length) {
            has_differing = true;
        } else {
            this.barriers_empty_array.forEach(barrier => {
                barriers_array.forEach(next_barrier => {
                    Object.keys(barrier).forEach(key => {
                        if (barrier[key] !== next_barrier[key]) {
                            has_differing = true;
                        }
                    });
                });
            });
        }

        if (has_differing) {
            this.barriers_empty_array = [];
        } else {
            this.barriers_empty_array.length = 0;
        }

        return barriersObjectToArray(this.barriers, this.barriers_empty_array);
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
        let has_differing   = false;
        const markers_array = barriersObjectToArray(this.markers, []);

        if (this.markers_empty_array.length !== markers_array.length) {
            has_differing = true;
        } else {
            this.markers_empty_array.forEach(marker => {
                markers_array.forEach(next_marker => {
                    Object.keys(marker).forEach(key => {
                        if (marker[key] !== next_marker[key]) {
                            has_differing = true;
                        }
                    });
                });
            });
        }

        if (has_differing) {
            this.markers_empty_array = [];
        } else {
            this.markers_empty_array.length = 0;
        }

        return barriersObjectToArray(this.markers, this.markers_empty_array);
    }

    // ---------- Chart Settings ----------
    @computed
    get settings() {
        return (({ common, ui } = this.root_store) => ({
            // TODO: enable asset information
            assetInformation: false, // ui.is_chart_asset_info_visible,
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

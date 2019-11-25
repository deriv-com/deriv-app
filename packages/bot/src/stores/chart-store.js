
import { action,
    computed,
    observable }  from 'mobx';
import ServerTime from '../services/api/server_time';

const g_subscribers_map = {};
let WS;

export default class ChartStore {
    constructor(root_store) {
        this.root_store = root_store;
        WS = root_store.ws;
    }
    
    @observable symbol;
    @observable is_chart_loading;
    @observable main_barrier  = null;
    @observable chart_type;
    @observable granularity;
    
    @computed
    get is_contract_ended(){
        const { transactions } = this.root_store;

        return transactions.contracts.lenght > 0 && transactions.contracts[0].is_ended;
    }

    @action.bound
    updateGranularity(granularity) {
        this.granularity = granularity;
    }

    @action.bound
    updateChartType(chart_type) {
        this.chart_type = chart_type;
    }

    @action.bound
    setChartStatus(status) {
        this.is_chart_loading = status;
    }

    // #region WS
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
    }

    wsForgetStream = (stream_id) => {
        WS.forgetStream(stream_id);
    }

    wsSendRequest = (req) => {
        if (req.time) {
            return ServerTime.timePromise().then(() => {
                return ({
                    msg_type: 'time',
                    time    : ServerTime.get().unix(),
                });
            });
        }
        if (req.active_symbols) {
            return WS.activeSymbols();
        }
        return WS.storage.send(req);
    };
    // #endregion
}


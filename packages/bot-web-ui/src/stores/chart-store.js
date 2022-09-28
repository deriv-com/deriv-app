import { action, computed, observable, reaction } from 'mobx';
// import { tabs_title } from '../constants/bot-contents';
import { ServerTime } from '@deriv/bot-skeleton';

const g_subscribers_map = {};
let WS;

export default class ChartStore {
    constructor(root_store) {
        this.root_store = root_store;
        WS = root_store.ws;
        const { run_panel } = root_store;

        reaction(
            () => run_panel.is_running,
            () => (run_panel.is_running ? this.onStartBot() : this.onStopBot())
        );
    }

    @observable symbol;
    @observable is_chart_loading;
    @observable chart_type;
    @observable granularity;

    @computed
    get is_contract_ended() {
        const { transactions } = this.root_store;

        return transactions.contracts.length > 0 && transactions.contracts[0].is_ended;
    }

    @action.bound
    onStartBot() {
        this.updateSymbol();

        // const { main_content } = this.root_store;
        // main_content.setActiveTab(tabs_title.CHART);
    }

    @action.bound
    // eslint-disable-next-line
    onStopBot() {
        // const { main_content } = this.root_store;
        // main_content.setActiveTab(tabs_title.WORKSPACE);
    }

    @action.bound
    updateSymbol() {
        const workspace = Blockly.derivWorkspace;
        const market_block = workspace.getAllBlocks().find(block => {
            return block.type === 'trade_definition_market';
        });

        if (market_block && market_block !== 'na') {
            const symbol = market_block.getFieldValue('SYMBOL_LIST');
            this.symbol = symbol;
        }
    }

    @action.bound
    onSymbolChange(symbol) {
        this.symbol = symbol;
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

    wsForget = req => {
        const key = JSON.stringify(req);
        if (g_subscribers_map[key]) {
            g_subscribers_map[key].unsubscribe();
            delete g_subscribers_map[key];
        }
    };

    wsForgetStream = stream_id => {
        WS.forgetStream(stream_id);
    };

    wsSendRequest = req => {
        if (req.time) {
            return ServerTime.timePromise().then(() => {
                return {
                    msg_type: 'time',
                    time: ServerTime.get().unix(),
                };
            });
        }
        if (req.active_symbols) {
            return WS.activeSymbols();
        }
        return WS.storage.send(req);
    };

    getMarketsOrder = active_symbols => {
        const synthetic_index = 'synthetic_index';

        const has_synthetic_index = !!active_symbols.find(s => s.market === synthetic_index);
        return active_symbols
            .slice()
            .sort((a, b) => (a.display_name < b.display_name ? -1 : 1))
            .map(s => s.market)
            .reduce(
                (arr, market) => {
                    if (arr.indexOf(market) === -1) arr.push(market);
                    return arr;
                },
                has_synthetic_index ? [synthetic_index] : []
            );
    };
    // #endregion
}

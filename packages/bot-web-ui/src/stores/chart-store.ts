import { action, computed, makeObservable, observable, reaction } from 'mobx';
import {
    ActiveSymbolsRequest,
    ServerTimeRequest,
    TicksHistoryRequest,
    TicksStreamRequest,
    TradingTimesRequest,
} from '@deriv/api-types';
import { ServerTime } from '@deriv/bot-skeleton';
import { LocalStore } from '@deriv/shared';
import RootStore from './root-store';

export const g_subscribers_map: Partial<Record<string, ReturnType<typeof WS.subscribeTicksHistory>>> = {};
let WS: RootStore['ws'];

export default class ChartStore {
    root_store: RootStore;
    constructor(root_store: RootStore) {
        makeObservable(this, {
            symbol: observable,
            is_chart_loading: observable,
            chart_type: observable,
            granularity: observable,
            is_contract_ended: computed,
            updateSymbol: action,
            onSymbolChange: action,
            updateGranularity: action,
            updateChartType: action,
            setChartStatus: action,
            restoreFromStorage: action,
        });

        this.root_store = root_store;
        WS = root_store.ws;
        const { run_panel } = root_store;

        reaction(
            () => run_panel.is_running,
            () => (run_panel.is_running ? this.onStartBot() : this.onStopBot())
        );

        this.restoreFromStorage();
    }

    symbol: string | undefined;
    is_chart_loading: boolean | undefined;
    chart_type: string | undefined;
    granularity: number | undefined;

    get is_contract_ended() {
        const { transactions } = this.root_store;

        return transactions.contracts.length > 0 && transactions.contracts[0].is_ended;
    }

    onStartBot = () => {
        this.updateSymbol();
    };

    // eslint-disable-next-line
    onStopBot = () => {
        // const { main_content } = this.root_store;
        // main_content.setActiveTab(tabs_title.WORKSPACE);
    };

    updateSymbol = () => {
        const workspace = window.Blockly.derivWorkspace;
        const market_block = workspace.getAllBlocks().find((block: Blockly.Block) => {
            return block.type === 'trade_definition_market';
        });

        if (market_block && market_block !== 'na') {
            const symbol = market_block.getFieldValue('SYMBOL_LIST');
            this.symbol = symbol;
        }
    };

    onSymbolChange = (symbol: string) => {
        this.symbol = symbol;
        this.saveToLocalStorage();
    };

    updateGranularity = (granularity: number) => {
        this.granularity = granularity;
        this.saveToLocalStorage();
    };

    updateChartType = (chart_type: string) => {
        this.chart_type = chart_type;
        this.saveToLocalStorage();
    };

    setChartStatus = (status: boolean) => {
        this.is_chart_loading = status;
    };

    saveToLocalStorage = () => {
        LocalStore.set(
            'bot.chart_props',
            JSON.stringify({
                symbol: this.symbol,
                granularity: this.granularity,
                chart_type: this.chart_type,
            })
        );
    };

    restoreFromStorage = () => {
        try {
            const props = LocalStore.get('bot.chart_props');

            if (props) {
                const { symbol, granularity, chart_type } = JSON.parse(props);
                this.symbol = symbol;
                this.granularity = granularity;
                this.chart_type = chart_type;
            } else {
                this.granularity = 0;
                this.chart_type = 'line';
            }
        } catch {
            LocalStore.remove('bot.chart_props');
        }
    };

    // #region WS
    wsSubscribe = (req: TicksStreamRequest, callback: () => void) => {
        if (req.subscribe === 1) {
            const key = JSON.stringify(req);
            const subscriber = WS.subscribeTicksHistory(req, callback);
            g_subscribers_map[key] = subscriber;
        }
    };

    wsForget = (req: TicksHistoryRequest) => {
        const key = JSON.stringify(req);
        if (g_subscribers_map[key]) {
            g_subscribers_map[key]?.unsubscribe();
            delete g_subscribers_map[key];
        }
    };

    wsForgetStream = (stream_id: string) => {
        WS.forgetStream(stream_id);
    };

    wsSendRequest = (req: TradingTimesRequest | ActiveSymbolsRequest | ServerTimeRequest) => {
        if ('time' in req && req.time) {
            return ServerTime.timePromise().then(() => {
                return {
                    msg_type: 'time',
                    time: ServerTime.get().unix(),
                };
            });
        }
        if ('active_symbols' in req && req.active_symbols) {
            return WS.activeSymbols();
        }
        if (WS.storage.send) return WS.storage.send(req);
    };

    getMarketsOrder = (active_symbols: { market: string; display_name: string }[]) => {
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
}

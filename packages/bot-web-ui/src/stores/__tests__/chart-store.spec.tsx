import { ServerTime } from '@deriv/bot-skeleton';
import { LocalStore } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { TStores } from '@deriv/stores/types';
import { mock_ws } from 'Utils/mock';
import { mockDBotStore } from 'Stores/useDBotStore';
import ChartStore, { g_subscribers_map } from '../chart-store';
import 'Utils/mock/mock-local-storage';

window.Blockly = {
    derivWorkspace: {
        getAllBlocks: jest.fn(() => ({
            find: jest.fn(),
        })),
    },
};

jest.mock('@deriv/bot-skeleton/src/scratch/dbot', () => ({}));

describe('ChartStore', () => {
    const mock_store: TStores = mockStore({
        common: {
            server_time: {
                clone: jest.fn(() => ({
                    unix: jest.fn(() => '2024-03-11T10:56:02.239Z'),
                })),
            },
        },
    });

    let chartStore: ChartStore;
    const mock_DBot_store = mockDBotStore(mock_store, mock_ws);

    beforeEach(() => {
        ServerTime.init(mock_store.common);
        chartStore = new ChartStore(mock_DBot_store);
    });

    it('should initialize ChartStore with default values', () => {
        expect(chartStore.symbol).toBeUndefined();
        expect(chartStore.is_chart_loading).toBeUndefined();
        expect(chartStore.chart_type).toBe('line');
    });

    it('should return true when contracts exist and the first contract is ended', () => {
        const mockContractStore = {
            contracts: [{ is_ended: true }, { is_ended: false }],
        };
        mock_DBot_store.transactions = mockContractStore;
        const result = chartStore.is_contract_ended;

        expect(result).toBe(true);
    });

    it('should update symbol correctly', () => {
        const mockWorkspace = {
            getAllBlocks: jest.fn(() => [{ type: 'trade_definition_market', getFieldValue: jest.fn(() => 'EURUSD') }]),
        };

        window.Blockly.derivWorkspace = mockWorkspace;
        chartStore.updateSymbol();

        expect(chartStore.symbol).toEqual('EURUSD');
    });

    it('should update granularity correctly', () => {
        chartStore.updateGranularity(60);
        expect(chartStore.granularity).toEqual(60);
    });

    it('should update chart type correctly', () => {
        chartStore.updateChartType('candle');
        expect(chartStore.chart_type).toEqual('candle');
    });

    it('should set chart status correctly', () => {
        chartStore.setChartStatus(true);
        expect(chartStore.is_chart_loading).toEqual(true);
    });

    it('should subscribe to ticks history', () => {
        const req = { subscribe: 1 };
        const callback = jest.fn();
        chartStore.wsSubscribe(req, callback);

        expect(mock_DBot_store.ws.subscribeTicksHistory).toHaveBeenCalledWith(req, callback);
    });

    it('should forget ticks history', () => {
        const subscribe_req = { subscribe: 1 };
        const callback = jest.fn();
        chartStore.wsSubscribe(subscribe_req, callback);
        const key = JSON.stringify(subscribe_req);

        expect(g_subscribers_map).toHaveProperty(key);
        chartStore.wsForget(subscribe_req);
        expect(g_subscribers_map).not.toHaveProperty(key);
    });

    it('should forget stream', () => {
        const stream_id = 'test_stream_id';
        chartStore.wsForgetStream(stream_id);

        expect(mock_DBot_store.ws.forgetStream).toHaveBeenCalledWith(stream_id);
    });

    it('should send request and return server time', async () => {
        const req = { time: 1 };
        const result = await chartStore.wsSendRequest(req);

        expect(result.msg_type).toEqual('time');
        expect(result.time).toEqual('2024-03-11T10:56:02.239Z');
    });

    it('should send request and return active symbols', async () => {
        const req = { active_symbols: 1 };
        await chartStore.wsSendRequest(req);

        expect(mock_DBot_store.ws.activeSymbols).toHaveBeenCalledWith();
    });

    it('should send request using storage.send', async () => {
        const req = { storage: 'storage' };
        await chartStore.wsSendRequest(req);

        expect(mock_DBot_store.ws.storage.send).toHaveBeenCalledWith(req);
    });

    it('should get markets order', () => {
        const active_symbols = [
            { market: 'EURUSD', display_name: 'EUR/USD' },
            { market: 'AUDUSD', display_name: 'AUD/USD' },
            { market: 'CADUSD', display_name: 'CAD/USD' },
        ];
        const marketsOrder = chartStore.getMarketsOrder(active_symbols);

        expect(marketsOrder).toEqual(['AUDUSD', 'CADUSD', 'EURUSD']);
    });

    it('should get markets order with synthetic index', () => {
        const active_symbols = [{ market: 'synthetic_index', display_name: 'Synthetic Index' }];
        const marketsOrder = chartStore.getMarketsOrder(active_symbols);

        expect(marketsOrder).toEqual(['synthetic_index']);
    });

    it('should update symbol and save to local storage', () => {
        const mockSymbol = 'USDJPY';
        chartStore.onSymbolChange(mockSymbol);

        expect(chartStore.symbol).toEqual(mockSymbol);
    });

    it('should call restoreFromStorage ', () => {
        LocalStore.set('bot.chart_props', '{none}');
        chartStore.restoreFromStorage();
    });
});

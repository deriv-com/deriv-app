import { setWebsocket } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import initStore from 'App/init-store';

const mock_ws = {
    activeSymbols: jest.fn(),
    authorized: {
        activeSymbols: jest.fn(),
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
    },
    buy: jest.fn(),
    storage: {
        contractsFor: jest.fn(),
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    contractUpdateHistory: jest.fn(),
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    forget: jest.fn(),
    forgetAll: jest.fn(),
    send: jest.fn(),
    subscribeProposal: jest.fn(),
    subscribeTicks: jest.fn(),
    time: jest.fn(),
    tradingTimes: jest.fn(),
    wait: jest.fn(),
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    setWebsocket: jest.fn(),
}));

describe('initStore', () => {
    it('should return the root store', () => {
        const root_store = mockStore({});
        const result = initStore(root_store, mock_ws);
        expect(result).toBeDefined();
        expect(Object.keys(result)).toEqual([
            'client',
            'common',
            'modules',
            'ui',
            'gtm',
            'notifications',
            'contract_replay',
            'contract_trade',
            'portfolio',
            'chart_barrier_store',
            'active_symbols',
        ]);
    });

    it('should set the websocket', () => {
        const root_store = mockStore({});
        initStore(root_store, mock_ws);
        expect(setWebsocket).toHaveBeenCalledWith(mock_ws);
    });

    it('should return the same store if it already exists', () => {
        const root_store = mockStore({});
        const result1 = initStore(root_store, mock_ws);
        const result2 = initStore(root_store, mock_ws);
        expect(result1).toBe(result2);
    });
});

import { setWebsocket } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import initStore from 'App/init-store';

const mockWs = {
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
    const rootStore = mockStore({});

    it('should return the root store', () => {
        const result = initStore(rootStore, mockWs);
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
        initStore(rootStore, mockWs);
        expect(setWebsocket).toHaveBeenCalledWith(mockWs);
    });

    it('should return the same store if it already exists', () => {
        const result1 = initStore(rootStore, mockWs);
        const result2 = initStore(rootStore, mockWs);
        expect(result1).toBe(result2);
    });
});

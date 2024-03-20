export const mock_ws = {
    authorized: {
        subscribeProposalOpenContract: jest.fn(),
        send: jest.fn(),
        activeSymbols: jest.fn(() => Promise.resolve({ active_symbols: [] })),
    },
    storage: {
        send: jest.fn(),
    },
    contractUpdate: jest.fn(),
    subscribeTicksHistory: jest.fn((req, callback) => {
        const subscriber = {
            history: {
                times: [],
                prices: [],
            },
            msg_type: 'history',
            pip_size: 3,
            req_id: 31,
            unsubscribe: jest.fn(),
        };
        callback();
        return subscriber;
    }),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
    tradingTimes: jest.fn(() => Promise.resolve({ error: true })),
};

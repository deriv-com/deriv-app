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
    subscribeTicksHistory: jest.fn(),
    forgetStream: jest.fn(),
    activeSymbols: jest.fn(),
    send: jest.fn(),
    tradingTimes: jest.fn(() => Promise.resolve({ error: true })),
};

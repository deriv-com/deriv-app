module.exports = {
    // Auth and account related functions
    getAccountsFromLocalStorage: jest.fn(() => ({})),
    getAccountListWithAuthToken: jest.fn(() => []),
    getActiveAuthTokenIDFromLocalStorage: jest.fn(() => 'mock_auth_token'),
    getActiveLoginIDFromLocalStorage: jest.fn(() => 'mock_login_id'),
    getActiveAccounts: jest.fn(() => []),

    // Local storage functions
    safeParse: jest.fn(value => {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }),
    getLocalStorage: jest.fn(key => localStorage.getItem(key)),

    // Wallet and currency functions
    getWalletCurrencyIcon: jest.fn(() => 'mock-icon'),

    // Token functions
    getToken: jest.fn(() => 'mock_token'),
    getTmbToken: jest.fn(() => Promise.resolve('mock_token')),
    isTmbEnabled: jest.fn(() => Promise.resolve(true)),

    // Transaction functions
    groupTransactionsByDay: jest.fn(() => ({})),

    // String and formatting functions
    getTruncatedString: jest.fn((str, length) => str?.substring(0, length) || ''),
    unFormatLocaleString: jest.fn(str => str),

    // Data formatting functions
    getLoginHistoryFormattedData: jest.fn(() => []),

    // Feature flag functions
    getFeatureFlag: jest.fn(() => false),

    // URL and link functions
    isExternalLink: jest.fn(url => {
        if (!url) return false;
        return /^https?:\/\//.test(url) || url.startsWith('//');
    }),

    // Chat functions
    Chat: {
        open: jest.fn(),
        close: jest.fn(),
        clear: jest.fn(),
    },

    // URL parsing functions (from parse-url export)
    parseUrl: jest.fn(() => ({})),
    getUrlParam: jest.fn(() => ''),

    // Moment functions (from moment export)
    formatDate: jest.fn(date => date),
    toMoment: jest.fn(date => date),

    // File functions (from files export)
    compressImageFiles: jest.fn(() => Promise.resolve([])),
    readFiles: jest.fn(() => Promise.resolve([])),

    // Common utility functions that might be used elsewhere
    formatMoney: jest.fn((amount, currency) => `${amount} ${currency}`),
    getCurrencyDisplayCode: jest.fn(currency => currency),
    getDecimalPlaces: jest.fn(() => 2),
    addComma: jest.fn(num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
};

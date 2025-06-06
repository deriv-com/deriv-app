module.exports = {
    getTmbToken: jest.fn(() => Promise.resolve('mock_token')),
    getActiveAuthTokenIDFromLocalStorage: jest.fn(() => 'mock_auth_token'),
    getActiveLoginIDFromLocalStorage: jest.fn(() => 'mock_login_id'),
    Chat: {
        open: jest.fn(),
        close: jest.fn(),
        clear: jest.fn(),
    },
    // Add other utils exports as needed
    formatMoney: jest.fn((amount, currency) => `${amount} ${currency}`),
    getCurrencyDisplayCode: jest.fn(currency => currency),
    getDecimalPlaces: jest.fn(() => 2),
    addComma: jest.fn(num => num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')),
    // Add any other exports from utils that your tests might need
};

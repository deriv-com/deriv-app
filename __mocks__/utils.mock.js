module.exports = {
    getTmbToken: jest.fn(() => Promise.resolve('mock_token')),
    // Add other utils exports as needed
    formatMoney: jest.fn(),
    getCurrencyDisplayCode: jest.fn(),
    getDecimalPlaces: jest.fn(),
    // Add any other exports from utils that your tests might need
};

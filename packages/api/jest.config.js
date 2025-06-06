const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '@deriv/utils': '<rootDir>/../../__mocks__/utils.mock.js',
    },
};

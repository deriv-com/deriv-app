const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '@deriv-com/translations': '<rootDir>/../../__mocks__/translation.mock.js',
        '@deriv/utils': '<rootDir>/../../__mocks__/utils.mock.js',
    },
};

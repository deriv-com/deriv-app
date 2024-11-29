const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        ...baseConfigForPackages.moduleNameMapper,
        '@deriv-com/ui': '<rootDir>/../../__mocks__/deriv-com.ui.mock.js',
        '@deriv-com/auth-client': '<rootDir>/../../__mocks__/deriv-com.auth-client.mock.js',
    },
};

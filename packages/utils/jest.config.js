const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': '<rootDir>/../../__mocks__/styleMock.js',
        '^@deriv-com/auth-client$': '<rootDir>/../../__mocks__/auth-client.mock.js',
    },
};

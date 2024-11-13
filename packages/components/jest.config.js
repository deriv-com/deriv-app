const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '@deriv-com/ui': '<rootDir>/../../__mocks__/deriv-com.ui.mock.js',
    },
    modulePathIgnorePatterns: ['/icon/', '/.out/'],
};

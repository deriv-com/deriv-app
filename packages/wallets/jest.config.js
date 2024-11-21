const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '@deriv-com/translations': '<rootDir>/../../__mocks__/translation.mock.js',
        '@deriv-com/ui': '<rootDir>/../../__mocks__/deriv-com.ui.mock.js',
        '\\.(css|s(c|a)ss)$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
    },
    transform: {
        '\\.(ts|tsx)?$': '<rootDir>/jestTransformer.js',
        '^.+\\.jsx?$': 'babel-jest',
    },
};

const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    moduleNameMapper: {
        '@deriv/utils': '<rootDir>/../../__mocks__/utils.mock.js',
    },
};

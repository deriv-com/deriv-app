const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
        '@deriv-com/translations': '<rootDir>/../../__mocks__/translation.mock.js',
        '^@deriv/account$': '<rootDir>/../account/src',
        '^Assets/(.*)$': '<rootDir>/src/assets/$1',
        '^Components/(.*)$': '<rootDir>/src/components/$1',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Services/(.*)$': '<rootDir>/src/services/$1',
        '^Stores/(.*)$': '<rootDir>/src/stores/$1',
        '^Hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^Types/(.*)$': '<rootDir>/src/types/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
    },
};

const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    clearMocks: true,
    moduleNameMapper: {
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Assets/(.*)$': '<rootDir>/src/assets/$1',
        '^Components/(.*)$': '<rootDir>/src/components/$1',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Hooks$': '<rootDir>/src/hooks/index',
        '^Pages/(.*)$': '<rootDir>/src/pages/$1',
        '^Stores/(.*)$': '<rootDir>/src/stores/$1',
        '^Stores$': '<rootDir>/src/stores/index',
        '^Translations/(.*)$': '<rootDir>/src/translations/$1',
        '^Types/(.*)$': '<rootDir>/src/types/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
        '@deriv-com/ui': '<rootDir>/../../__mocks__/deriv-com.ui.mock.js',
    },
    testPathIgnorePatterns: [
        '/scripts/',
        '/translations/',
        '/crowdin/',
        // TODO: Update the test files once the major features are done
        // This is a temporary change, I hope
        '/src/components/order-details*',
    ],
    coveragePathIgnorePatterns: [
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/build',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
    ],
};

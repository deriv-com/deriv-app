const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    clearMocks: true,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Assets/(.*)$': '<rootDir>/src/assets/$1',
        '^Components/(.*)$': '<rootDir>/src/components/$1',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Pages/(.*)$': '<rootDir>/src/pages/$1',
        '^Stores/(.*)$': '<rootDir>/src/stores/$1',
        '^Stores$': '<rootDir>/src/stores/index',
        '^Translations/(.*)$': '<rootDir>/src/translations/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    testPathIgnorePatterns: ['/scripts/', '/translations/', '/crowdin/'],
    coveragePathIgnorePatterns: [
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/build',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
    ],
    transformIgnorePatterns: ['/node_modules/(?!@sendbird/chat).+\\.js$'],
};

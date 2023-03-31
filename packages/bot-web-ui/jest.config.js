const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    clearMocks: true,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^App/(.*)$': '<rootDir>/src/app/$1',
        '^Components/(.*)$': '<rootDir>/src/components/$1',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Stores/(.*)$': '<rootDir>/src/stores/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    coveragePathIgnorePatterns: [
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
        '<rootDir>/build',
        '<rootDir>/docs',
    ],
    globals: {
        __webpack_public_path__: '',
    },
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
};

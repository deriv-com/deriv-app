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
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
    globals: {
        __webpack_public_path__: '/',
    },
};

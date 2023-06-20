const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    clearMocks: true,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Scratch/(.*)$': '<rootDir>/src/scratch/$1',
        '^Services/(.*)$': '<rootDir>/src/services/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
    globals: {
        __webpack_public_path__: '/',
    },
};

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
    // remove later
    testRegex: 'packages/bot-skeleton/src/services/api/__tests__/datadog-middleware.spec.ts',
    globals: {
        __webpack_public_path__: '/',
    },
};

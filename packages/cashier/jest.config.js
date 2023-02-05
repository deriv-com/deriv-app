const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    clearMocks: true,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Stores/(.*)$': '<rootDir>/src/stores/$1',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Config/(.*)$': '<rootDir>/src/config/$1',
        '^Components/(.*)$': '<rootDir>/src/components/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
        '^Containers/(.*)$': '<rootDir>/src/containers/$1',
        '^Pages/(.*)$': '<rootDir>/src/pages/$1',
    },
    testPathIgnorePatterns: ['/Routes/', '/validator/'],
    coveragePathIgnorePatterns: [
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/build',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
    ],
};

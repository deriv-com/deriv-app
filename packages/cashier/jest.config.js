const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    clearMocks: true,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Stores/(.*)$': '<rootDir>/src/Stores/$1',
        '^Constants/(.*)$': '<rootDir>/src/Constants/$1',
        '^_common/(.*)$': '<rootDir>/src/_common/$1',
        '^Config/(.*)$': '<rootDir>/src/Config/$1',
        '^Components/(.*)$': '<rootDir>/src/Components/$1',
    },
    testPathIgnorePatterns: ['/Routes/', '/Validator/'],
    coveragePathIgnorePatterns: [
        // TODO: Remove '/Routes/__tests__/' and '/Validator/__tests__/' when the old tests written in chai and enzyme replaced with testing library
        '/Routes/__tests__/',
        '/Validator/__tests__/',
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/build',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
    ],
};

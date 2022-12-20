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
        // TODO: Remove '/Routes/__tests__/' and '/validator/__tests__/' when the old tests written in chai and enzyme replaced with testing library
        '/Routes/__tests__/',
        '/validator/__tests__/',
        '<rootDir>/.eslintrc.js',
        '<rootDir>/jest.config.js',
        '<rootDir>/build',
        '<rootDir>/coverage/lcov-report',
        '<rootDir>/dist',
    ],
};

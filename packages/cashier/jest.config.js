const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Stores/(.*)$': '<rootDir>/src/Stores/$1',
        '^Config/(.*)$': '<rootDir>/src/Config/$1',
        '^Components/(.*)$': '<rootDir>/src/Components/$1',
    },
    testPathIgnorePatterns: ['/Routes/', '/Validator/'],
};

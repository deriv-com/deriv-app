const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        "\\.s(c|a)ss$": "<rootDir>/../../__mocks__/styleMock.js",
        "^.+\\.svg$": "<rootDir>/../../__mocks__/styleMock.js",
        '^_common\/(.*)$': "<rootDir>/src/_common/$1",
        '^Constants\/(.*)$': "<rootDir>/src/Constants/$1",
        '^Constants$': "<rootDir>/src/Constants/index.js",
        '^Utils\/(.*)$': "<rootDir>/src/Utils/$1",
        '^Stores\/(.*)$': "<rootDir>/src/Stores/$1",
    },
};

module.exports = {
    moduleNameMapper: {
        "\\.s(c|a)ss$": "<rootDir>/../../__mocks__/styleMock.js",
        "^.+\\.svg$": "<rootDir>/../../__mocks__/styleMock.js",
    },
    testRegex: "(/__tests__/.*|(\\.)(test|spec))\\.js?$",
    setupFiles: [
        "<rootDir>/../../jest.setup.js",
    ],
};

module.exports = {
    moduleNameMapper: {
        "\\.s(c|a)ss$": "<rootDir>/../../__mocks__/styleMock.js",
        "^.+\\.svg$": "<rootDir>/../../__mocks__/styleMock.js",
        '^_common\/(.*)$': "<rootDir>/src/_common/$1",
        '^App\/(.*)$': "<rootDir>/src/App/$1",
        '^Assets\/(.*)$': "<rootDir>/src/Assets/$1",
        '^Constants\/(.*)$': "<rootDir>/src/Constants/$1",
        '^Constants$': "<rootDir>/src/Constants/index.js",
        '^Documents\/(.*)$': "<rootDir>/src/Documents/$1",
        '^Modules\/(.*)$': "<rootDir>/src/Modules/$1",
        '^Utils\/(.*)$': "<rootDir>/src/Utils/$1",
        '^Services\/(.*)$': "<rootDir>/src/Services/$1",
        '^Stores\/(.*)$': "<rootDir>/src/Stores/$1",
    },
    testRegex: "(/__tests__/.*|(\\.)(test|spec))\\.js?$",
    setupFiles: [
        "<rootDir>/../../jest.setup.js",
    ],
    // This is needed to transform es modules imported from node_modules of the target component.
    transformIgnorePatterns: [
        "/node_modules/(?!react-virtualized).+\\.js$",
    ],
};

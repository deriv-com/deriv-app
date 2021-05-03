module.exports = {
    clearMocks: true,
    projects: [
        '<rootDir>/packages/account/jest.config.js',
        '<rootDir>/packages/shared/jest.config.js',
        '<rootDir>/packages/trader/jest.config.js',
        '<rootDir>/packages/core/jest.config.js',
    ],
    setupFiles: [
        "<rootDir>/jest.setup.js",
    ],
    testRegex: [
        '__tests__',
        '.*.spec.js',
    ],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+/es/^.+$': 'babel-jest',
    },
    transformIgnorePatterns: [
        "/node_modules/(?!react-virtualized).+\\.js$",
    ],
};

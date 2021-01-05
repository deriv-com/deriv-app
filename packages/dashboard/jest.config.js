module.exports = {
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^Components/(.*)$': '<rootDir>/src/components/$1',
        '^Constants/(.*)$': '<rootDir>/src/constants/$1',
        '^Stores/(.*)$': '<rootDir>/src/stores/$1',
        '^Types/(.*)$': '<rootDir>/src/types/$1',
        '^Utils/(.*)$': '<rootDir>/src/utils/$1',
    },
    testRegex: '(/__tests__/.*|(\\.)(test|spec))\\.js?$',
    setupFiles: ['<rootDir>/../../jest.setup.js'],

    // This is needed to transform es modules imported from node_modules of the target component.
    transformIgnorePatterns: ['/node_modules/(?!react-virtualized).+\\.js$'],
};

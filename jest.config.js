module.exports = {
    collectCoverage: false,
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
        '!**/dist/**',
        '!/integration-tests/',
        '!/component-tests/',
    ],
    coverageReporters: ['lcov'],
    coverageDirectory: './coverage/',
    clearMocks: true,
    projects: ['<rootDir>/packages/*/jest.config.js', '<rootDir>/packages/*/jest.config.ts'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+/es/^.+$': 'babel-jest',
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.)(test|spec))\\.(js|jsx|tsx|ts)?$',
    transformIgnorePatterns: ['/node_modules/(?!(@enykeev/react-virtualized|@simplewebauthn/browser)).+\\.js$'],
    testPathIgnorePatterns: ['/integration-tests/', '/account-v2/'],
};

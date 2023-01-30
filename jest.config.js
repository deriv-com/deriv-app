module.exports = {
    collectCoverage: true,
    collectCoverageFrom: ['**/*.{js,jsx,ts,tsx}', '!**/node_modules/**'],
    coverageReporters: ['lcov'],
    coverageDirectory: './coverage/',
    clearMocks: true,
    projects: ['<rootDir>/packages/*/jest.config.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+/es/^.+$': 'babel-jest',
        '^.+\\.(ts|tsx)?$': 'ts-jest',
    },
    testRegex: ['__tests__', '.*.spec.js'],
    transformIgnorePatterns: ['/node_modules/(?!@enykeev/react-virtualized).+\\.js$'],
};

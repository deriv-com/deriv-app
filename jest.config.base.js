/** This config file is for packages in monorepo
    Universal configurations should go here
 */

module.exports = {
    collectCoverage: true,
    collectCoverageFrom: [
        '**/*.{js,jsx,ts,tsx}',
        '!**/node_modules/**',
        '!**/*.spec.{js,jsx,ts,tsx}',
        '!/**/*.type.ts',
    ],
    coverageReporters: ['lcov'],
    coverageDirectory: './coverage/',
    testRegex: '(/__tests__/.*|(\\.)(test|spec))\\.(js|jsx|tsx|ts)?$',
    // This is needed to transform es modules imported from node_modules of the target component.
    transformIgnorePatterns: ['/node_modules/(?!@enykeev/react-virtualized).+\\.js$'],
    setupFiles: ['<rootDir>/../../jest.setup.js'],
    setupFilesAfterEnv: ['<rootDir>/../../setupTests.js'],
};

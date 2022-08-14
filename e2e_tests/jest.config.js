const path = require('path');
require('dotenv').config();

module.exports = {
    moduleNameMapper: {
        '@root(.*)$': '<rootDir>/src/$1',
    },
    bail: true,
    clearMocks: true,
    preset: 'jest-playwright-preset',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testRegex: ['__tests__', '.*.spec.js'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest',
        '^.+/es/^.+$': 'babel-jest',
    },
    testEnvironmentOptions: {
        'jest-playwright': {
            browsers: [process.env.BROWSER || 'chromium'],
            contextOptions: {
                ignoreHTTPSErrors: true,
                ...(Number(process.env.ENABLE_VIDEO_RECORD)
                    ? {
                          recordVideo: {
                              dir: path.join(process.env.E2E_ARTIFACT_PATH, 'videos'),
                          },
                      }
                    : {}),
            },
        },
    },
    transformIgnorePatterns: ['/node_modules/(?!@enykeev/react-virtualized).+\\.js$', '_utils/websocket.js'],
    reporters: ['default', './src/_utils/cli_reporter.js'],
};

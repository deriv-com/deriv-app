const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/styleMock.js',
        '^_common/(.*)$': '<rootDir>/src/_common/$1' /* eslint-disable-line */,
        '^App/(.*)$': '<rootDir>/src/App/$1' /* eslint-disable-line */,
        '^Assets/(.*)$': '<rootDir>/src/Assets/$1' /* eslint-disable-line */,
        '^Constants/(.*)$': '<rootDir>/src/Constants/$1' /* eslint-disable-line */,
        '^Constants$': '<rootDir>/src/Constants/index.js' /* eslint-disable-line */,
        '^Documents/(.*)$': '<rootDir>/src/Documents/$1' /* eslint-disable-line */,
        '^Modules/(.*)$': '<rootDir>/src/Modules/$1' /* eslint-disable-line */,
        '^Utils/(.*)$': '<rootDir>/src/Utils/$1' /* eslint-disable-line */,
        '^Services/(.*)$': '<rootDir>/src/Services/$1' /* eslint-disable-line */,
        '^Stores/(.*)$': '<rootDir>/src/Stores/$1' /* eslint-disable-line */,
    },
};

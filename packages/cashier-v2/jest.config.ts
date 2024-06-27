import baseConfigForPackages from '../../jest.config.base';

export default {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '@deriv/api-v2': '<rootDir>/../api/src',
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
    },
};

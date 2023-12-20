import baseConfigForPackages from '../../jest.config.base';

export default {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
    },
};

import baseConfigForPackages from '../../jest.config.base';

export default {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
    },
    transformIgnorePatterns: ['/node_modules/(?!(@deriv/quill-design|@deriv-com/ui)).+\\.js$'],
};

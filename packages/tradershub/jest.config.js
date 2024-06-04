const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '\\.css$': '<rootDir>/../../__mocks__/styleMock.js',
        '\\.s(c|a)ss$': '<rootDir>/../../__mocks__/styleMock.js',
        '^.+\\.svg$': '<rootDir>/../../__mocks__/fileMock.js',
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@cfd/components(.*)$': '<rootDir>/src/features/cfd/components/$1',
        '^@cfd/constants$': '<rootDir>/src/features/cfd/constants',
        '^@cfd/flows(.*)$': '<rootDir>/src/features/cfd/flows/$1',
        '^@cfd/screens(.*)$': '<rootDir>/src/features/cfd/screens/$1',
    },
    transformIgnorePatterns: ['/node_modules/(?!(@deriv-com/ui)).+\\.js$'],
};

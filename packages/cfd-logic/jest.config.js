const baseConfigForPackages = require('../../jest.config.base');

module.exports = {
    ...baseConfigForPackages,
    moduleNameMapper: {
        '^Components/(.*)$': '<rootDir>/src/Components/$1',
    },
};

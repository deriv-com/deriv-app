const path = require('path');

module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    settings: {
        'import/resolver': {
            webpack: { config: path.resolve(__dirname, 'webpack.config.js') },
        },
    },
    rules: {
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['error'],
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
};

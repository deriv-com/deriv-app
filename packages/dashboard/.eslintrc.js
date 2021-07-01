const webpackConfig = require('./webpack.config.js');

module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({})},
        },
    },
    rules: {
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['error'],
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
};

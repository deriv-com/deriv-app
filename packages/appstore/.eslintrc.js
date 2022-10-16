const webpackConfig = require('./webpack.config');

module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/no-var-requires': 0,
    },
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

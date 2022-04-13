const webpackConfig = require('./webpack.config');

module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    settings: {
        react: {
            version: '16',
        },
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

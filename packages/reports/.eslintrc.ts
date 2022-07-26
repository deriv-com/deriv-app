const webpackConfig = require('./build/webpack.config-test.js'); /* eslint-disable-line */

module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

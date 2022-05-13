const webpackConfig = require('./build/webpack.config-test.js');

module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    parser: '@babel/eslint-parser',
    plugins: ['@typescript-eslint'],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

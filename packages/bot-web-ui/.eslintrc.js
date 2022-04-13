const webpackConfig = require('./webpack.config.js');

module.exports = {
    globals: {
        Blockly: false,
        trackJs: false,
        jest: false,
        dataLayer: false,
        goog: false,
        google: false,
        gapi: false,
        __webpack_public_path__: false,
    },
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

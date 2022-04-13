module.exports = {
    extends: [
        '../../.eslintrc.js',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
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
    settings: {
        react: {
            version: '16',
        },
    },
    rules: {
        'no-underscore-dangle': 0,
    },
};

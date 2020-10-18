const path = require('path');

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
    extends: '../../.eslintrc.js',
    settings: {
        'import/resolver': {
            webpack: { config: path.resolve(__dirname, 'webpack.config.js') },
        },
    },
};

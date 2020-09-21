const path = require('path');

module.exports = {
    extends: '../../.eslintrc.js',
    settings: {
        react: {
            version: '16',
        },
        'import/resolver': {
            webpack: { config: path.resolve(__dirname, 'webpack.config.js') },
        },
    },
};

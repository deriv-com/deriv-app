const webpackConfig = require('./webpack.config.js');

module.exports = {
    extends: '../../.eslintrc.js',
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig() },
        },
    },
};

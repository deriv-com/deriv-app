const webpackConfig = require('./webpack.config.js');

module.exports = {
    extends: '../../.eslintrc.js',
    settings: {
        react: {
            version: '16',
        },
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

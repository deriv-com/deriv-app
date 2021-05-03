const webpackConfig = require('./webpack.config');

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

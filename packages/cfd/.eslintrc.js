const webpackConfig = require('./build/webpack.config-test.js');

module.exports = {
    extends: ['../../.eslintrc.js'],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
    rules: {
        'no-underscore-dangle': 0,
    },
};

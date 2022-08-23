const webpackConfig = require('./build/webpack.config.js');

module.exports = {
    extends: ['../../.eslintrc.js', 'plugin:import/typescript'],
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

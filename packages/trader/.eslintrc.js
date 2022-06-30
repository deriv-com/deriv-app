const webpackConfig = require('./build/webpack.config-test.js');

module.exports = {
    extends: '../../.eslintrc.js',
    rules: {
        '@typescript-eslint/no-var-requires': 0,
    },
    settings: {
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

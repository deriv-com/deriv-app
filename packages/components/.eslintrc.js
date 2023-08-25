const webpackConfig = require('./webpack.config');

module.exports = {
    extends: '../../.eslintrc.js',
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'react/prop-types': 'off',
            },
        },
    ],
    settings: {
        react: {
            version: '16',
        },
        'import/resolver': {
            webpack: { config: webpackConfig({}) },
        },
    },
};

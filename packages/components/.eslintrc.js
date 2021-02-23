module.exports = {
    extends: '../../.eslintrc.js',
    settings: {
        react: {
            version: '16',
        },
        'import/resolver': {
            webpack: { config: 'webpack.config.js' },
        },
    },
};

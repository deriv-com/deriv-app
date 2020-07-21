const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'translations/index.js'),
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'translations.main.js',
        libraryExport: 'default',
        library: '@deriv/translations',
        libraryTarget: 'umd',
    },
    resolve: {
        alias: {
            'public/i18n': path.resolve(__dirname, 'lib', 'languages'),
        },
    },
    optimization: {
        minimize: true,
    },
    devServer: {
        publicPath: '/dist/',
    },
    externals: {
        react: 'react',
        'prop-types': 'prop-types',
    },
    plugins: [new CopyWebpackPlugin([{ from: 'src/translations', to: 'public/i18n/' }])],
};

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

const is_serve   = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = {
    entry : path.resolve(__dirname, 'src', 'i18next/index.js'),
    output: {
        path         : path.resolve(__dirname, 'lib'),
        filename     : 'translations.main.js',
        libraryExport: 'default',
        library      : '@deriv/translations',
        libraryTarget: 'umd',
    },
    resolve: {
        alias: {
            'public/i18n': path.resolve(__dirname, 'lib', 'languages'),
        },
    },
    optimization: {
        minimize: true,
        // TODO enable splitChunks
        // splitChunks: {
        //     chunks: 'all'
        // }
    },
    devServer: {
        publicPath: '/dist/',
    },
    devtool: is_release ? 'source-map' : 'cheap-module-eval-source-map',
    module : {
        rules: [
            (!is_serve ? {
                enforce: 'pre',
                test   : /\.(js|jsx)$/,
                exclude: /node_modules|lib|shared\/utils/,
                include: /src/,
                loader : 'eslint-loader',
                options: {
                    fix: true,
                },
            } : {}),
            {
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'src/translations', to: 'public/i18n/' },
        ]),
    ],
    externals: {
        'react'         : 'react',
        'babel-polyfill': 'babel-polyfill',
        'prop-types'    : 'prop-types',
    },
};

const path = require('path');

const is_serve   = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = {
    entry: {
        'payment'  : path.resolve(__dirname, 'src', 'components/app.js'),
    },
    output: {
        path         : path.resolve(__dirname, 'lib'),
        filename     : '[name].js',
        libraryExport: 'default',
        library      : ['deriv-p2p', '[name]'],
        libraryTarget: 'umd',
    },
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
    optimization: {
        minimize: true,
    },
    devServer: {
        publicPath: '/dist/',
    },
    devtool: is_release ? 'source-map' : 'cheap-module-eval-source-map',
    externals: [
        {
            'react'           : 'react',
            'babel-polyfill'  : 'babel-polyfill',
            'prop-types'      : 'prop-types',
            // 'deriv-shared'    : 'deriv-shared',
            // 'deriv-components': 'deriv-components',
        },
        // /^deriv-components\/.+$/,
        // /^deriv-shared\/.+$/,
    ]
};
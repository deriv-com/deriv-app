const path = require('path');

const is_serve   = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = {
    entry: {
        'index'  : path.resolve(__dirname, 'src', 'components/app.js'),
    },
    output: {
        path         : path.resolve(__dirname),
        filename     : 'index.js',
        libraryExport: 'default',
        library      : ['deriv-p2p', '[name]'],
        libraryTarget: 'umd',
    },
    module : {
        rules: [
            (!is_serve ? {
                enforce: 'pre',
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
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
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            // Provide path to the file with resources
                            resources: require('deriv-shared/utils/index.js'),
                        },
                    },
                ],
            }
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
            'deriv-shared'    : 'deriv-shared',
            'deriv-components': 'deriv-components',
        },
        /^deriv-components\/.+$/,
        /^deriv-shared\/.+$/,
    ]
};
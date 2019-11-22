const path = require('path');

const is_serve   = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = {
    entry: {
        'index'  : path.resolve(__dirname, 'src', 'index.js'),
    },
    output: {
        path         : path.resolve(__dirname),
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
                use    : [
                    {
                        loader: 'deriv-shared/utils/deriv-components-loader.js'
                    },
                    {
                        loader : 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-react'
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                                '@babel/plugin-proposal-export-default-from',
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-proposal-export-namespace-from',
                                '@babel/plugin-syntax-dynamic-import',
                            ],
                        }
                    },
                ]
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
const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV === 'development';

module.exports = {
    resolve: {
        alias: {
            _common: path.resolve(__dirname, 'src/javascript/_common'),
            App: path.resolve(__dirname, 'src/javascript/app/App'),
            Assets: path.resolve(__dirname, 'src/javascript/app/Assets'),
            Constants: path.resolve(__dirname, 'src/javascript/app/Constants'),
            Images: path.resolve(__dirname, 'src/images'),
            Modules: path.resolve(__dirname, 'src/javascript/app/Modules'),
            Services: path.resolve(__dirname, 'src/javascript/app/Services'),
            Stores: path.resolve(__dirname, 'src/javascript/app/Stores'),
            Utils: path.resolve(__dirname, 'src/javascript/app/Utils'),
        },
        extensions: [ '.js', '.jsx' ]
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.svg$/,
                use : [
                    'babel-loader',
                    {
                        loader : 'react-svg-loader',
                        options: {
                            svgo: {
                                plugins: [
                                    { removeTitle: false },
                                ],
                                floatPrecision: 2,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(scss|sass|css)$/,
                exclude: /node_modules/,
                loaders: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1,
                            localIdentName: '[local]___[hash:base64:5]',
                        }
                    },
                    'sass-loader',
                ]
            },
        ]
    },
    devServer: {
        hot: true,
        open: 'Google Chrome',
        host: 'localhost.binary.sx',
        https: true,
        port: 443,
        stats: {
            colors: true,
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: './index.html'
        }),
        new MiniCssExtractPlugin({
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),
        new CopyPlugin([
            { from: './node_modules/smartcharts-beta/dist/*.smartcharts.*', to: 'smartcharts/', flatten: true },
            { from: './node_modules/smartcharts-beta/dist/smartcharts.css*', to: 'smartcharts/', flatten: true },
        ]),
    ],
    output: {
        filename: '[name].[hash].js'
    }
};

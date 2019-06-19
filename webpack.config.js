const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV === 'development';

module.exports = {
    mode: devMode,
    resolve: {
        alias: {
            _common: path.resolve(__dirname, 'src/javascript/_common'),
            App: path.resolve(__dirname, 'src/javascript/app/App'),
            Assets: path.resolve(__dirname, 'src/javascript/app/Assets'),
            Constants: path.resolve(__dirname, 'src/javascript/app/Constants'),
            Download: path.resolve(__dirname, 'src/download'),
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
                test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]'
                        }
                    },
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
                test: /\.(sc|sa|c)ss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                ]
            }
        ]
    },
    devServer: {
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
            template: 'index.html',
            filename: 'index.html'
        }),
        new MiniCssExtractPlugin({ filename: 'css/app.css', chunkFilename: '[id].css' }),
        new CopyPlugin([
            { from: '../node_modules/smartcharts-beta/dist/*.smartcharts.*', to: 'js/smartcharts/', flatten: true },
            { from: '../node_modules/smartcharts-beta/dist/smartcharts.css*', to: 'css/', flatten: true },
        ]),
    ],
    output: {
        filename: '[name].[hash].js'
    },
    entry: './index.js',
    context: path.resolve(__dirname, 'src'),
};

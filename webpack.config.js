const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV === 'development';

module.exports = {
    mode: devMode,
    resolve: {
        alias: {
            _common: path.resolve(__dirname, 'src/_common'),
            App: path.resolve(__dirname, 'src/App'),
            Assets: path.resolve(__dirname, 'src/Assets'),
            Constants: path.resolve(__dirname, 'src/Constants'),
            Fonts: path.resolve(__dirname, 'src/public/fonts'),
            Images: path.resolve(__dirname, 'src/public/images'),
            Modules: path.resolve(__dirname, 'src/Modules'),
            Sass: path.resolve(__dirname, 'src/sass'),
            Services: path.resolve(__dirname, 'src/Services'),
            Stores: path.resolve(__dirname, 'src/Stores'),
            Translations: path.resolve(__dirname, 'src/public/translations'),
            Utils: path.resolve(__dirname, 'src/Utils'),
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
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
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
                            jsx: true,
                        },
                    },
                ],
            },
            {
                test: /\.(sc|sa|c)ss$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
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
    optimization: {
        namedChunks: true,
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test     : /\.js/,
                exclude  : /(vendors~|smartcharts)/,
                parallel : true,
                sourceMap: true,
            }),
            new OptimizeCssAssetsPlugin(),
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
        new MiniCssExtractPlugin({ filename: 'app.css', chunkFilename: '[id].css' }),
        new CopyPlugin([
            { from: '../node_modules/smartcharts-beta/dist/*.smartcharts.*', to: 'js/smartcharts/', flatten: true },
            { from: '../node_modules/smartcharts-beta/dist/smartcharts.css*', to: 'css/', flatten: true },
        ]),
    ],
    output: {
        filename: 'js/[name].[hash].js',
        publicPath: '/'
    },
    entry: './index.js',
    context: path.resolve(__dirname, 'src'),
};

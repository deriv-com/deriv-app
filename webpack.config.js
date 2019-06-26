const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

const devMode = process.env.NODE_ENV === 'development';

module.exports = {
    mode: devMode ? 'development' : 'production',
    devtool: devMode ? 'cheap-module-eval-source-map' : 'source-map',
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
                exclude: /node_modules|__tests__/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            [ "@babel/plugin-proposal-decorators", { "legacy": true } ],
                            [ "@babel/plugin-proposal-class-properties", { "loose": true } ],
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-syntax-dynamic-import',
                        ],
                    }
                }
            },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
                exclude: /node_modules/,
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
                exclude: /node_modules/,
                include: /public\//,
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
                exclude: /node_modules|public\//,
                use : [
                    'babel-loader',
                    {
                        loader : 'react-svg-loader',
                        options: {
                            jsx: true,
                            svgo: {
                                plugins: [
                                    { removeTitle: false },
                                    { removeUselessStrokeAndFill: false },
                                    { removeUknownsAndDefaults: false }
                                ],
                                floatPrecision: 2
                            }
                        },
                    },
                ],
            },
            {
                test: /\.(sc|sa|c)ss$/,
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
                        loader: 'resolve-url-loader',
                        options: {
                            sourceMap: true,
                            keepQuery: true
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
        minimize: !devMode,
        minimizer: devMode ? [] : [
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
        hotOnly: true,
        port: 443,
        historyApiFallback: true,
        stats: {
            colors: true,
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: 'index.html',
            filename: 'index.html',
            minify: devMode ? false : {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                useShortDoctype: true
            }
        }),
        new MiniCssExtractPlugin({ filename: 'css/app.css', chunkFilename: 'css/[id].css' }),
        new CopyPlugin([
            { from: '../node_modules/smartcharts-beta/dist/*.smartcharts.*', to: 'js/smartcharts/', flatten: true },
            { from: '../node_modules/smartcharts-beta/dist/smartcharts.css*', to: 'css/', flatten: true },
            { from: '../scripts/CNAME', to: 'CNAME', toType: 'file' },
            { from: 'root_files/404.html', to: '404.html', toType: 'file' },
        ]),
    ],
    output: {
        filename: 'js/[name].[hash].js',
        publicPath: '/'
    },
    entry: './index.js',
    context: path.resolve(__dirname, 'src'),
};

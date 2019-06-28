const HtmlWebPackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

const releaseMode = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const transformManifest = (content, path, base) => {
    return content.toString().replace(/{root_url}|{start_url_base}/g, base);
};

module.exports = function(env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';
    const jsJsxLoaders = [
        {
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
    ];

    return {
        mode: releaseMode ? 'production' : 'development',
        devtool: releaseMode ? 'source-map' : 'cheap-module-eval-source-map',
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
                    exclude: /node_modules|__tests__/, // TODO: will be refactored into separate files
                    use: releaseMode ? [
                        ...jsJsxLoaders,
                        path.resolve('./extract-translation-strings')
                    ] : jsJsxLoaders
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
            minimize: releaseMode,
            minimizer: !releaseMode ? [] : [
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
            hot: true,
            port: 443,
            historyApiFallback: true,
            stats: {
                colors: true,
            }
        },
        plugins: [
            new CleanWebpackPlugin(),
            new CopyPlugin([
                { from: '../node_modules/smartcharts-beta/dist/*.smartcharts.*', to: 'js/smartcharts/', flatten: true },
                { from: '../node_modules/smartcharts-beta/dist/smartcharts.css*', to: 'css/', flatten: true },
                { from: '../scripts/CNAME', to: 'CNAME', toType: 'file' },
                { from: 'root_files/404.html', to: '404.html', toType: 'file' },
                { from: 'root_files/robots.txt', to: 'robots.txt', toType: 'file' },
                { from: 'root_files/sitemap.xml', to: 'sitemap.xml', toType: 'file' },
                {
                    from: 'templates/app/manifest.json',
                    to: 'manifest.json',
                    toType: 'file',
                    transform(content, path) {
                        return transformManifest(content, path, base);
                    }
                },
                { from: 'public/images/favicons/favicon.ico', to: 'favicon.ico', toType: 'file' },
                { from: 'public/images/favicons/**' },
                { from: 'public/images/common/logos/platform_logos/**' },
                { from: '_common/lib/pushwooshSDK/**', flatten: true },
            ]),
            new HtmlWebPackPlugin({
                template: 'index.html',
                filename: 'index.html',
                minify: !releaseMode ? false : {
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                }
            }),
            new HtmlWebpackTagsPlugin({
                links: [
                    'css/smartcharts.css',
                    {
                        path: 'manifest.json',
                        attributes: {
                            rel: 'manifest'
                        }
                    },
                    {
                        path: 'public/images/favicons',
                        glob: '*',
                        globPath: path.resolve(__dirname, 'src/public/images/favicons'),
                        attributes: {
                            rel: 'icon'
                        }
                    },
                    {
                        path: 'pushwoosh-web-notifications.js',
                        attributes: {
                            rel: 'preload',
                            as: 'script'
                        }
                    },
                ],
                scripts: [
                    {
                        path: 'pushwoosh-web-notifications.js',
                        attributes: {
                            defer: '',
                            type: 'text/javascript'
                        }
                    }
                ],
                append: true
            }),
            new MiniCssExtractPlugin({ filename: 'css/app.css', chunkFilename: 'css/[id].css' }),
        ],
        output: {
            filename: 'js/[name].[hash].js',
            publicPath: base
        },
        entry: './index.js',
        context: path.resolve(__dirname, 'src'),
    };
};

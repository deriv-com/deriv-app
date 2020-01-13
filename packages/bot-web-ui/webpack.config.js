const { CleanWebpackPlugin }    = require('clean-webpack-plugin');
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const path                      = require('path');
const StyleLintPlugin           = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');
// const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
// const BundleAnalyzerPlugin      = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot-web-ui.main.js',
    chunkFilename: 'bot.[name].[contenthash].js',
    libraryExport: 'default',
    library: 'deriv-bot-web-ui',
    libraryTarget: 'umd',
};

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        entry    : [
            path.join(__dirname, 'src', 'app.js')
        ],
        output: {
            ...output,
            publicPath: base
        },
        devServer: {
            publicPath      : '/dist/',
            disableHostCheck: true,
        },
        mode     : is_release ? 'production' : 'development',
        devtool  : is_release ? 'source-map' : 'cheap-module-eval-source-map',
        target   : 'web',
        module   : {
            rules: [
                {
                    test: /\.(s*)css$/,
                    use : [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader : 'css-loader',
                            options: { sourceMap: true },
                        },
                        {
                            loader : 'sass-loader',
                            options: { sourceMap: true },
                        },
                        {
                            loader : "sass-resources-loader",
                            options: {
                                resources: require(path.resolve(__dirname, 'node_modules/deriv-shared/utils/index.js')),
                            }
                        }
                    ]
                },
                {
                    test: /\.svg$/,
                    use : [
                        {
                            loader : 'svg-sprite-loader',
                            options: {
                                extract       : true,
                                spriteFilename: 'bot-sprite.svg',
                            },
                        },
                        {
                            loader : 'svgo-loader',
                            options: {
                                plugins: [
                                    { removeUselessStrokeAndFill: false },
                                    { removeUnknownsAndDefaults: false },
                                ],
                            },
                        },
                    ],
                },
                // {
                //     enforce: "pre",
                //     test   : /\.(js|jsx)$/,
                //     exclude: [ /node_modules/, /lib/, /utils/, /dist/, /webpack.config.js/ ],
                //     loader : "eslint-loader",
                //     options: {
                //         fix: true
                //     },
                // },
                {
                    test   : /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader : [ 'deriv-shared/utils/deriv-components-loader.js',
                        'babel-loader' ],
                },
            ],
        },
        plugins  : [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({ filename: 'bot-web-ui.main.css' }),
            new StyleLintPlugin({ fix: true }),
            new CopyWebpackPlugin([
                { from: 'node_modules/deriv-bot-engine/dist/scratch.min.js'},
                { from: 'node_modules/deriv-bot-engine/dist/xml' , to : 'xml'},
                { from: 'node_modules/deriv-bot-engine/dist//media' , to : 'media'},
            ]),
            new SpriteLoaderPlugin(),
        ],
        externals: [
            {
                '@babel/polyfill'   : '@babel/polyfill',
                'classnames'        : 'classnames',
                'deriv-components'  : 'deriv-components',
                'deriv-shared'      : 'deriv-shared',
                'deriv-translations': 'deriv-translations',
                'formik'            : 'formik',
                'react'             : 'react',
                'react-dom'         : 'react-dom',
                'smartcharts-beta'  : 'smartcharts-beta',
            },
            /^deriv-shared\/.+$/,
            /^deriv-components\/.+$/,
            /^deriv-translations\/.+$/,
        ],
    };
}

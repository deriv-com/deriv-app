const { CleanWebpackPlugin }    = require('clean-webpack-plugin');
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const MiniCssExtractPlugin      = require('mini-css-extract-plugin');
const path                      = require('path');
const StyleLintPlugin           = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
// const BundleAnalyzerPlugin      = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot.main.js',
    chunkFilename: 'bot.[name].[contenthash].js',
    libraryExport: 'default',
    library: 'deriv-bot',
    libraryTarget: 'umd',
};

module.exports = {
    entry: [
        'core-js/fn/promise',
        path.join(__dirname, 'src', 'app.js')
    ],
    output,
    devServer: {
        publicPath: '/dist/',
        disableHostCheck: true,
    },
    mode: is_release ? 'production' : 'development',
    devtool: is_release ? 'source-map' : 'cheap-module-eval-source-map',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader: "sass-resources-loader",
                        options: {
                            resources: require(path.resolve(__dirname, 'node_modules/deriv-shared/utils/index.js')),
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'bot-sprite.svg',
                        },
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                { removeUselessStrokeAndFill: false },
                                { removeUnknownsAndDefaults: false },
                            ],
                        },
                    },
                ],
            },
            {
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/, /lib/, /utils/],
                loader: "eslint-loader",
                options: {
                    fix: true
                },
            },
            {
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader : ['deriv-shared/utils/deriv-components-loader.js',
                    'babel-loader'],
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({ filename: 'bot.main.css' }),
        new StyleLintPlugin({ fix: true }),
        new CopyWebpackPlugin([
            { from: './src/scratch/xml', to: 'xml' },
            { from: './node_modules/scratch-blocks/media', to: 'media' },
            { from: './src/assets/images', to: 'media' },
        ]),
        new SpriteLoaderPlugin(),
        new MergeIntoSingleFilePlugin({
            files: {
                'scratch.min.js': [
                    'node_modules/scratch-blocks/blockly_compressed_vertical.js',
                    'node_modules/scratch-blocks/msg/messages.js',
                    'node_modules/blockly/generators/javascript.js',
                ],
            },
            transform: {
                'scratch.min.js': (code) => {
                    const uglifyjs = require('uglify-js');
                    return uglifyjs.minify(code).code;
                },
            },
        }),
        // ...(!is_release ? [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ] : []),
    ],
    externals: [
        {
            'react'             : 'react',
            'react-dom'         : 'react-dom',
            '@babel/polyfill'   : '@babel/polyfill',
            'classnames'        : 'classnames',
            'deriv-components'  : 'deriv-components',
            'deriv-shared'      : 'deriv-shared',
            'deriv-translations': 'deriv-translations',
            'formik'            : 'formik',
        },
        /^deriv-shared\/.+$/,
        /^deriv-components\/.+$/,
        /^deriv-translations\/.+$/,
    ],
};

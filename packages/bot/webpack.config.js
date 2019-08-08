const CopyWebpackPlugin         = require('copy-webpack-plugin');
const MiniCssExtractPlugin      = require("mini-css-extract-plugin");
const path                      = require('path');
const StyleLintPlugin           = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');

module.exports = {
    entry : [
        path.join(__dirname, 'src', 'app.js') 
    ],
    output: {
        path    : path.resolve(__dirname, 'dist'),
        filename: 'bot.js',
    },
    devServer: {
        publicPath: '/dist/',
        disableHostCheck: true,
    },
    devtool: 'source-map',
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
                loader : 'babel-loader',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'bot.css' }),
        new StyleLintPlugin( { fix: true }),
        new CopyWebpackPlugin([
            { from: './src/scratch/xml' },
            { from: './node_modules/scratch-blocks/media', to: 'media' },
        ]),
        new MergeIntoSingleFilePlugin({
            files: {
                'scratch.js': [
                    './node_modules/scratch-blocks/blockly_compressed_vertical.js',
                    './node_modules/scratch-blocks/msg/messages.js',
                    './node_modules/blockly/generators/javascript.js',
                ]
            }
        }),
        new SpriteLoaderPlugin(),
    ],
};
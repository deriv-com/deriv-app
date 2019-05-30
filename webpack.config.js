const CopyWebpackPlugin    = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path                 = require('path');
const StyleLintPlugin      = require('stylelint-webpack-plugin');

module.exports = {
    entry : [
        '@babel/polyfill', 
        path.join(__dirname, './scratch/hooks'),
        path.join(__dirname, './src/app.js'),
    ],
    output: {
        path    : path.resolve(__dirname, 'dist'),
        filename: 'bot.js',
    },
    devServer: {
        publicPath: '/dist/',
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
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
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
            { from: 'scratch/xml' },
            { from: './node_modules/scratch-blocks/media', to: 'media' },
            { from: './node_modules/scratch-blocks/blockly_compressed_vertical.js', to: 'scratch-compressed.js' },
            { from: './node_modules/scratch-blocks/msg/messages.js', to: 'scratch-messages.js' },
        ])
    ],
    externals: {
        Blockly: 'Blockly',
    }
};

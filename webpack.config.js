const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = {
    entry : path.join(__dirname, './src/app.js'),
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
                exclude: [/node_modules/,/scratch/],
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
        new StyleLintPlugin( { fix:true }),
    ]
};

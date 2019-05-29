const path = require('path');
const webpack = require('webpack');

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
    }
};

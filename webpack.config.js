const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry : path.join(__dirname, './src/app.js'),
    output: {
        path    : path.resolve(__dirname, 'dist'),
        filename: 'bot.js',
    },
    devtool: 'source-map',
    target: 'node',
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/,/\\srcatch/],
                loader: "eslint-loader",
                options: { fix: true },
            },
            {
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                use    : 'babel-loader',
            },
        ],
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw   : true,
        }),
    ],
};

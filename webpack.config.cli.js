const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.join(__dirname, 'src', 'botPage', 'bot', 'cli.js'),
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'index.js',
    },
    target: 'node',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: {
                    loader: 'file-loader',
                },
            },
        ],
    },
    plugins: [
        new Dotenv(),
        new webpack.BannerPlugin({
            banner: '#!/usr/bin/env node',
            raw: true,
        }),
        new CopyWebpackPlugin([
            { from: './node_modules/@deriv/deriv-charts/dist/*.smartcharts.*', to: path.resolve(__dirname), flatten: true },
        ]),
    ],
};

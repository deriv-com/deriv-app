const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BlocklyConcatPlugin = require('./customPlugins/blockly-concat-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src', 'botPage', 'view', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'index.js',
        publicPath: 'auto',
    },
    devtool: 'source-map',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(js|jsx|cjs|mjs)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: 'asset/resource',
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[name][ext]',
                        outputPath: 'image',
                    },
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset/inline',
            },
        ],
    },
    plugins: [
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
        }),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: 'node_modules/@deriv/deriv-charts/dist/*.smartcharts.*',
                    to: path.resolve(__dirname, 'www/js', '[name][ext]'),
                },
                {
                    from: 'node_modules/binary-style/src/images/favicons',
                    to: path.resolve(__dirname, 'www/image/favicons'),
                },
                {
                    from: 'public',
                    to: path.resolve(__dirname, 'www/public'),
                    globOptions: {
                        ignore: ['**/*.html'],
                    },
                },
                {
                    from: 'public/index.html',
                    to: path.resolve(__dirname, 'www'),
                },
                {
                    from: 'public/beta.html',
                    to: path.resolve(__dirname, 'www'),
                },
                {
                    from: 'public/localstorage-sync.html',
                    to: path.resolve(__dirname, 'www'),
                },
                {
                    from: 'translations',
                    to: path.resolve(__dirname, 'www/translations'),
                },
                {
                    from: 'temp/blockly.js',
                    to: path.resolve(__dirname, 'www/'),
                },
            ],
        }),
    ],
    devServer: {
        host: 'localhost',
        port: 8081,
        open: true,
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@lang': path.resolve(__dirname, 'src/common/lang'),
            '@config': path.resolve(__dirname, 'src/config'),
        },
    },
};

const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/index.js'),
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
                    from: 'node_modules/@deriv/deriv-charts/dist/',
                    to: path.resolve(__dirname, 'www/js'),
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
                    from: 'blockly-translations',
                    to: path.resolve(__dirname, 'www/blockly-translations'),
                },
                {
                    from: 'temp/blockly.js',
                    to: path.resolve(__dirname, 'www/'),
                },
            ],
        }),
    ],
    devServer: {
        port: 80,
        host: 'localbot.binary.sx',
        open: true,
        historyApiFallback: true,
        client: {
            logging: 'log',
        },
        static: {
            directory: path.join(__dirname, 'www'),
        },
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@lang': path.resolve(__dirname, 'src/common/lang'),
            '@config': path.resolve(__dirname, 'src/config'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@storage': path.resolve(__dirname, 'src/storage'),
            '@constants': path.resolve(__dirname, 'src/constants'),
            '@i18n': path.resolve(__dirname, 'src/i18n'),
            '@api-base': path.resolve(__dirname, 'src/api-base'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@redux-store': path.resolve(__dirname, 'src/redux-store'),
            '@blockly': path.resolve(__dirname, 'src/blockly'),
            '@utilities': path.resolve(__dirname, 'src/utilities'),
            '@currency-config': path.resolve(__dirname, 'src/currency-config'),
        },
    },
};

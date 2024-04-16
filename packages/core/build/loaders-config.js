const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const IS_RELEASE =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

const js_loaders = [
    '@deriv/shared/src/loaders/deriv-account-loader.js',
    '@deriv/shared/src/loaders/deriv-cashier-loader.js',
    '@deriv/shared/src/loaders/deriv-cfd-loader.js',
    {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            rootMode: 'upward',
        },
    },
];

const html_loaders = [
    {
        loader: 'html-loader',
    },
];

const file_loaders = [
    {
        loader: 'file-loader',
        options: {
            name: '[path][name].[ext]',
        },
    },
];

const svg_file_loaders = [
    {
        loader: 'file-loader',
        options: {
            name: '[path][name].[contenthash].[ext]',
        },
    },
];

let svg_id_counter = 0;

const svg_loaders = [
    {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            rootMode: 'upward',
        },
    },
    {
        loader: 'react-svg-loader',
        options: {
            jsx: true,
            svgo: {
                plugins: [
                    { removeTitle: false },
                    { removeUselessStrokeAndFill: false },
                    { removeUknownsAndDefaults: false },
                    {
                        cleanupIDs: {
                            prefix: {
                                toString() {
                                    return `id-${svg_id_counter++}`;
                                },
                            },
                        },
                    },
                ],
                floatPrecision: 2,
            },
        },
    },
];

const css_loaders = [
    {
        loader: MiniCssExtractPlugin.loader,
    },
    {
        loader: 'css-loader',
        options: {
            sourceMap: !IS_RELEASE,
        },
    },
    {
        loader: 'postcss-loader',
        options: {
            sourceMap: !IS_RELEASE,
            postcssOptions: {
                config: path.resolve(__dirname),
            },
        },
    },
    {
        loader: 'resolve-url-loader',
        options: {
            sourceMap: true,
            keepQuery: true,
        },
    },
    {
        loader: 'sass-loader',
        options: {
            sourceMap: !IS_RELEASE,
            sassOptions: {
                outputStyle: 'expanded',
            },
        },
    },
    {
        loader: 'sass-resources-loader',
        options: {
            resources: require('@deriv/shared/src/styles/index.js'),
        },
    },
];

module.exports = {
    IS_RELEASE,
    js_loaders,
    html_loaders,
    file_loaders,
    svg_loaders,
    svg_file_loaders,
    css_loaders,
};

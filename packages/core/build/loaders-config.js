const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path                 = require('path');

const js_loaders = [
    'deriv-shared/utils/deriv-components-loader.js',
    {
        loader : 'babel-loader',
        options: {
            presets: [
                '@babel/preset-env',
                '@babel/preset-react'
            ],
            plugins: [
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }],
                '@babel/plugin-proposal-export-default-from',
                '@babel/plugin-proposal-object-rest-spread',
                '@babel/plugin-proposal-export-namespace-from',
                '@babel/plugin-syntax-dynamic-import',
            ],
        }
    }
];

const html_loaders = [
    {
        loader: 'html-loader'
    }
];

const file_loaders = [
    {
        loader : 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
    },
];

const svg_file_loaders = [
    {
        loader : 'file-loader',
        options: {
            name: '[path][name].[ext]'
        }
    },
];

const svg_loaders = [
    'babel-loader',
    {
        loader : 'react-svg-loader',
        options: {
            jsx : true,
            svgo: {
                plugins       : [
                    { removeTitle: false },
                    { removeUselessStrokeAndFill: false },
                    { removeUknownsAndDefaults: false }
                ],
                floatPrecision: 2
            }
        },
    },
];

const css_loaders = [
    {
        loader : MiniCssExtractPlugin.loader,
        options: {
            sourceMap: true,
        }
    },
    {
        loader : 'css-loader',
        options: {
            sourceMap: true,
        }
    },
    {
        loader : 'postcss-loader',
        options: {
            sourceMap: true,
            config: {
                path: path.resolve(__dirname)
            }
        }
    },
    {
        loader : 'resolve-url-loader',
        options: {
            sourceMap: true,
            keepQuery: true
        }
    },
    {
        loader : 'sass-loader',
        options: {
            sourceMap: true,
        }
    },
    {
        loader: 'sass-resources-loader',
        options: {
            resources: require('deriv-shared/utils/index.js'),
        }
    }
];

module.exports = {
    js_loaders,
    html_loaders,
    file_loaders,
    svg_loaders,
    svg_file_loaders,
    css_loaders
};

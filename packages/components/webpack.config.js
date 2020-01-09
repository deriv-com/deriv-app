const StyleLintPlugin      = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin   = require('svg-sprite-loader/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path                 = require('path');
const shared_utils         = require('@deriv/shared/utils/index.js');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const is_serve   = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = {
    entry: {
        accordion                       : 'Components/accordion',
        autocomplete                    : 'Components/autocomplete',
        button                          : 'Components/button',
        'button-toggle'                 : 'Components/button-toggle',
        checkbox                        : 'Components/checkbox',
        counter                         : 'Components/counter',
        dialog                          : 'Components/dialog',
        drawer                          : 'Components/drawer',
        dropdown                        : 'Components/dropdown',
        'field-error'                   : 'Components/field-error',
        'file-dropzone'                 : 'Components/file-dropzone',
        icon                            : 'Components/icon',
        'icon/js/icons'                 : 'Components/icon/icons.js',
        input                           : 'Components/input',
        label                           : 'Components/label',
        loading                         : 'Components/loading',
        modal                           : 'Components/modal',
        money                           : 'Components/money',
        'password-input'                : 'Components/password-input',
        'password-meter'                : 'Components/password-meter',
        popover                         : 'Components/popover',
        'radio-group'                   : 'Components/radio-group',
        table                           : 'Components/table/index.js',
        tabs                            : 'Components/tabs',
        'themed-scrollbars'             : 'Components/themed-scrollbars',
        'toggle-switch'                 : 'Components/toggle-switch',
        'vertical-tab'                  : 'Components/vertical-tabs/vertical-tab',
        'vertical-tab-content-container': 'Components/vertical-tabs/vertical-tab-content-container',
        'vertical-tab-header'           : 'Components/vertical-tabs/vertical-tab-header',
        'vertical-tab-header-title'     : 'Components/vertical-tabs/vertical-tab-header-title',
        'vertical-tab-headers'          : 'Components/vertical-tabs/vertical-tab-headers',
        'vertical-tab-layout'           : 'Components/vertical-tabs/vertical-tab-layout',
        'vertical-tab-wrapper'          : 'Components/vertical-tabs/vertical-tab-wrapper',
    },
    output: {
        path         : path.resolve(__dirname, 'lib'),
        filename     : '[name].js',
        libraryExport: 'default',
        library      : '@deriv/component',
        libraryTarget: 'umd',
    },
    resolve: {
        alias: {
            Components: path.resolve(__dirname, 'src', 'components'),
        },
    },
    optimization: {
        minimize: true,
        // TODO enable splitChunks
        // splitChunks: {
        //     chunks: 'all'
        // }
    },
    devServer: {
        publicPath: '/dist/',
    },
    devtool: is_release ? 'source-map' : 'cheap-module-eval-source-map',
    module : {
        rules: [
            {
                test: /\.(s*)css$/,
                use : [
                    'css-hot-loader',
                    MiniCssExtractPlugin.loader,
                    {
                        loader : 'css-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader : 'sass-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader : 'sass-resources-loader',
                        options: {
                            resources: shared_utils,
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use : [
                   {
                        loader : 'svg-sprite-loader',
                        options: {
                            extract       : true,
                            spriteFilename: svgPath => {
                                if (svgPath.includes('components/icon/common')) {
                                    return 'common.svg';
                                }
                                if (svgPath.includes('components/icon/currency')) {
                                    return 'currency.svg';
                                }
                                if (svgPath.includes('components/icon/flag')) {
                                    return 'flag.svg';
                                }
                                if (svgPath.includes('components/icon/mt5')) {
                                    return 'mt5.svg';
                                }
                                if (svgPath.includes('components/icon/tradetype')) {
                                    return 'tradetype.svg';
                                }
                                if (svgPath.includes('components/icon/underlying')) {
                                    return 'underlying.svg';
                                }
                                return 'common.svg';
                            },
                            publicPath: '/icon/sprite/',
                        },
                    },
                    {
                        loader : 'svgo-loader',
                        options: {
                            plugins: [
                                { removeUselessStrokeAndFill: false },
                                { removeUnknownsAndDefaults: false },
                            ],
                        },
                    },
                ],
            },
            (!is_serve ? {
                enforce: 'pre',
                test   : /\.(js|jsx)$/,
                exclude: /node_modules|lib|shared\/utils/,
                include: /src/,
                loader : 'eslint-loader',
                options: {
                    fix: true,
                },
            } : {}),
            {
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new StyleLintPlugin({ fix: true }),
        new SpriteLoaderPlugin({ plainSprite: true }),
        // ...(!is_release ? [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ] : []),
    ],
    externals: [
        {
            'formik'                    : 'formik',
            'classnames'                : 'classnames',
            '@contentpass/zxcvbn'       : '@contentpass/zxcvbn',
            'react-pose'                : 'react-pose',
            'babel-polyfill'            : 'babel-polyfill',
            'prop-types'                : 'prop-types',
            'react-transition-group'    : 'react-transition-group',
            'tt-react-custom-scrollbars': 'tt-react-custom-scrollbars',
            'react'                     : 'react',
            'react-dom'                 : 'react-dom',
            '@deriv/shared'              : '@deriv/shared',
            'react-router-dom'          : 'react-router-dom',
            'react-tiny-popover'        : 'react-tiny-popover',
        },
        /^@deriv\/shared\/.+$/,
    ],
};

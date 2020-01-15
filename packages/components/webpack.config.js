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
        // index: path.join(__dirname, 'src', 'index.js'),
        accordion          : path.resolve(__dirname, 'src', 'components/accordion/index.js'),
        autocomplete       : path.resolve(__dirname, 'src', 'components/autocomplete/index.js'),
        button             : path.resolve(__dirname, 'src', 'components/button/index.js'),
        'button-toggle'    : path.resolve(__dirname, 'src', 'components/button-toggle/index.js'),
        checkbox           : path.resolve(__dirname, 'src', 'components/checkbox/index.js'),
        counter            : path.resolve(__dirname, 'src', 'components/counter/index.js'),
        dialog             : path.resolve(__dirname, 'src', 'components/dialog/index.js'),
        drawer             : path.resolve(__dirname, 'src', 'components/drawer/index.js'),
        dropdown           : path.resolve(__dirname, 'src', 'components/dropdown/index.js'),
        'field-error'      : path.resolve(__dirname, 'src', 'components/field-error/index.js'),
        'file-dropzone'    : path.resolve(__dirname, 'src', 'components/file-dropzone/index.js'),
        icon               : path.resolve(__dirname, 'src', 'components/icon/index.js'),
        'icon/js/icons'    : path.resolve(__dirname, 'src', 'components/icon/icons.js'),
        input              : path.resolve(__dirname, 'src', 'components/input/index.js'),
        label              : path.resolve(__dirname, 'src', 'components/label/index.js'),
        loading            : path.resolve(__dirname, 'src', 'components/loading/index.js'),
        modal              : path.resolve(__dirname, 'src', 'components/modal/index.js'),
        money              : path.resolve(__dirname, 'src', 'components/money/index.js'),
        'password-input'   : path.resolve(__dirname, 'src', 'components/password-input/index.js'),
        'password-meter'   : path.resolve(__dirname, 'src', 'components/password-meter/index.js'),
        popover            : path.resolve(__dirname, 'src', 'components/popover/index.js'),
        'radio-group'      : path.resolve(__dirname, 'src', 'components/radio-group/index.js'),
        table              : path.resolve(__dirname, 'src', 'components/table/index.js'),
        tabs               : path.resolve(__dirname, 'src', 'components/tabs/index.js'),
        'themed-scrollbars': path.resolve(__dirname, 'src', 'components/themed-scrollbars/index.js'),
        'toggle-switch'    : path.resolve(__dirname, 'src', 'components/toggle-switch/index.js'),
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
            'react-tiny-popover'        : 'react-tiny-popover',
        },
        /^@deriv\/shared\/.+$/,
    ],
};

const StyleLintPlugin      = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin   = require('svg-sprite-loader/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path                 = require('path');

const is_serve   = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = {
    // entry: path.join(__dirname, 'src', 'index.js'),
    entry: {
        // index: path.join(__dirname, 'src', 'index.js'),
        accordion    : path.resolve(__dirname, 'src', 'components/accordion/index.js'),
        autocomplete : path.resolve(__dirname, 'src', 'components/autocomplete/index.js'),
        button       : path.resolve(__dirname, 'src', 'components/button/index.js'),
        checkbox     : path.resolve(__dirname, 'src', 'components/checkbox/index.js'),
        dialog       : path.resolve(__dirname, 'src', 'components/dialog/index.js'),
        drawer       : path.resolve(__dirname, 'src', 'components/drawer/index.js'),
        dropdown     : path.resolve(__dirname, 'src', 'components/dropdown/index.js'),
        'field-error': path.resolve(__dirname, 'src', 'components/field-error/index.js'),
        input        : path.resolve(__dirname, 'src', 'components/input/index.js'),
        label        : path.resolve(__dirname, 'src', 'components/label/index.js'),
        modal        : path.resolve(__dirname, 'src', 'components/modal/index.js'),
        popover      : path.resolve(__dirname, 'src', 'components/popover/index.js'),
        'radio-group': path.resolve(__dirname, 'src', 'components/radio-group/index.js'),
    },
    output: {
        path         : path.resolve(__dirname, 'lib'),
        filename     : '[name].js',
        libraryExport: 'default',
        library      : ['deriv-component', '[name]'],
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
                            resources: require('deriv-shared/utils/index.js'),
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                use : [
                    {
                        loader : 'svg-sprite-loader',
                        options: {
                            extract       : true,
                            spriteFilename: 'bot-sprite.svg',
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
                exclude: [/node_modules/, /lib/],
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
        new SpriteLoaderPlugin(),
    ],
    externals: {
        formik: 'formik',
        mobx  : 'mobx',
        react : {
            root     : 'React',
            commonjs : 'react',
            commonjs2: 'react',
        },
        'react-dom': {
            commonjs : 'react-dom',
            commonjs2: 'react-dom',
            root     : 'ReactDOM',
        },
        'mobx-react': {
            commonjs : 'mobx-react',
            commonjs2: 'mobx-react',
            root     : 'mobxReact',
        },
        'babel-polyfill': 'babel-polyfill',
    },
};

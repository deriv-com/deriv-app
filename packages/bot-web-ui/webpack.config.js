const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot-web-ui.main.js',
    chunkFilename: 'bot.[name].[contenthash].js',
    libraryExport: 'default',
    library: '@deriv/bot-web-ui',
    libraryTarget: 'umd',
};

module.exports = function(env, argv) {
    const base = env && env.base && !env.base ? `/${env.base}/` : '/';

    return {
        entry: [path.join(__dirname, 'src', 'app.js')],
        output: {
            ...output,
            publicPath: base,
        },
        devServer: {
            publicPath: '/dist/',
            disableHostCheck: true,
        },
        mode: is_release ? 'production' : 'development',
        devtool: is_release ? undefined : 'cheap-module-eval-source-map',
        target: 'web',
        module: {
            rules: [
                {
                    test: /\.(s*)css$/,
                    use: [
                        'css-hot-loader',
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true },
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true },
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: require('@deriv/shared/src/styles/index.js'),
                            },
                        },
                    ],
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'svg-sprite-loader',
                            options: {
                                extract: true,
                                spriteFilename: 'bot-sprite.svg',
                            },
                        },
                        {
                            loader: 'svgo-loader',
                            options: {
                                plugins: [{ removeUselessStrokeAndFill: false }, { removeUnknownsAndDefaults: false }],
                            },
                        },
                    ],
                },
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: [
                      '@deriv/shared/src/loaders/react-import-loader.js',
                      'babel-loader',
                    ],
                },
                { // @deriv/bot-skeleton also requires `.xml` import statements to be parsed by raw-loader
                    test: /\.xml$/,
                    exclude: /node_modules/,
                    use: 'raw-loader',
                },
            ],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({ filename: 'bot-web-ui.main.css' }),
            new StyleLintPlugin({ fix: true }),
            new CopyWebpackPlugin([{ from: 'node_modules/@deriv/bot-skeleton/dist/media', to: 'media' }]),
            new SpriteLoaderPlugin(),
        ],
        externals: [
            {
                '@babel/polyfill': '@babel/polyfill',
                classnames: 'classnames',
                '@deriv/components': '@deriv/components',
                '@deriv/shared': '@deriv/shared',
                '@deriv/translations': '@deriv/translations',
                formik: 'formik',
                react: 'react',
                mobx: 'mobx',
                'mobx-react': 'mobx-react',
                'react-dom': 'react-dom',
                '@deriv/deriv-charts': '@deriv/deriv-charts',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
    };
};

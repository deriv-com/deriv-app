const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin    = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const is_serve = process.env.BUILD_MODE === 'serve';
const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
const is_publishing = process.env.NPM_PUBLISHING_MODE === '1';

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'src/components', 'app.jsx'),
    },
    mode: is_release ? 'production' : 'development',
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'index.js',
        libraryExport: 'default',
        library: '@deriv/p2p',
        libraryTarget: 'umd',
    },
    resolve: {
        alias: {
            Assets: path.resolve(__dirname, 'src/assets'),
            Components: path.resolve(__dirname, 'src/components'),
            Translations: path.resolve(__dirname, 'src/translations'),
            Utils: path.resolve(__dirname, 'src/utils'),
            Stores: path.resolve(__dirname, 'stores'), // TODO: Move stores into ./src!
        },
        symlinks: false,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: '@deriv/shared/src/loaders/react-import-loader.js',
                    },
                    {
                        loader: '@deriv/shared/src/loaders/react-import-loader.js',
                    },
                    {
                        loader: 'babel-loader',
                    },
                ],
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    'style-loader',
                    ...(is_publishing
                        ? [
                              {
                                  loader: MiniCssExtractPlugin.loader,
                                  options: {
                                      sourceMap: !is_release,
                                  },
                              },
                              path.resolve(__dirname, 'scripts', 'dp2p-css-unit-loader.js'),
                          ]
                        : []),
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            // Provide path to the file with resources
                            resources: require('@deriv/shared/src/styles/index.js'),
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true,
                            svgo: {
                                plugins: [
                                    { removeTitle: false },
                                    { removeUselessStrokeAndFill: false },
                                    { removeUknownsAndDefaults: false },
                                ],
                                floatPrecision: 2,
                            },
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        ...(is_publishing ? [new MiniCssExtractPlugin({ filename: 'main.css' })] : []),
        // ...(is_release ? [] : [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ]),
    ],
    optimization: {
        minimize: is_release,
        minimizer: is_release
            ? [
                  new TerserPlugin({
                      test: /\.js/,
                      parallel: true,
                      sourceMap: true,
                  }),
                  new OptimizeCssAssetsPlugin(),
              ]
            : [],
    },
    devtool: is_release ? 'source-map' : 'cheap-module-eval-source-map',
    externals: [
        {
            react: 'react',
            'react-dom': 'react-dom',
            'babel-polyfill': 'babel-polyfill',
            'prop-types': 'prop-types',
            ...(is_publishing
                ? {}
                : {
                      '@deriv/shared': '@deriv/shared',
                      '@deriv/components': '@deriv/components',
                      formik: 'formik',
                  }),
        },
        ...(is_publishing ? [] : [/^@deriv\/components\/.+$/, /^@deriv\/shared\/.+$/]),
    ],
};

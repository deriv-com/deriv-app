const publisher_utils = require('@deriv/publisher/utils');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin    = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
const is_publishing = process.env.NPM_PUBLISHING_MODE === '1';

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        entry: {
            index: path.resolve(__dirname, 'src/components', 'app.jsx'),
        },
        mode: is_release ? 'production' : 'development',
        output: {
            chunkFilename: 'p2p/js/p2p.[name].[contenthash].js',
            path: path.resolve(__dirname, 'dist'),
            publicPath: base,
            filename: 'p2p/js/[name].js',
            libraryExport: 'default',
            library: '@deriv/p2p',
            libraryTarget: 'umd',
        },
        resolve: {
            alias: {
                Assets: path.resolve(__dirname, 'src/assets'),
                Components: path.resolve(__dirname, 'src/components'),
                Constants: path.resolve(__dirname, 'src/constants'),
                Translations: path.resolve(__dirname, 'src/translations'),
                Utils: path.resolve(__dirname, 'src/utils'),
                Stores: path.resolve(__dirname, 'src/stores'),
                ...publisher_utils.getLocalDerivPackageAliases(__dirname, is_publishing),
            },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            symlinks: false,
        },
        module: {
            rules: [
                {
                    // https://github.com/webpack/webpack/issues/11467
                    test: /\.m?js/,
                    include: /node_modules/,
                    resolve: {
                        fullySpecified: false,
                    },
                },
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: '@deriv/shared/src/loaders/react-import-loader.js',
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                                rootMode: 'upward',
                            },
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
                                  },
                                  '@deriv/publisher/utils/css-unit-loader.js',
                              ]
                            : []),
                        'css-loader',
                        {
                            loader: 'postcss-loader',
                            options: {
                                postcssOptions: {
                                    config: path.resolve(__dirname),
                                },
                            },
                        },
                        'sass-loader',
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                // Provide path to the file with resources
                                // eslint-disable-next-line global-require, import/no-dynamic-require
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
            ...(is_publishing
                ? [
                      new MiniCssExtractPlugin({
                          filename: 'p2p/css/[name].css',
                          chunkFilename: 'p2p/css/[name].[contenthash].css',
                      }),
                  ]
                : []),
        ],
        optimization: {
            minimize: is_release,
            minimizer: is_release
                ? [
                      new TerserPlugin({
                          test: /\.js$/,
                          parallel: 2,
                      }),
                      new CssMinimizerPlugin(),
                  ]
                : [],
        },
        devtool: is_release ? 'source-map' : 'eval-cheap-module-source-map',
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'prop-types': 'prop-types',
                ...(is_publishing ? {} : { 'lodash.debounce': 'lodash.debounce', formik: 'formik' }),
                ...publisher_utils.getLocalDerivPackageExternals(__dirname, is_publishing),
            },
        ],
    };
};

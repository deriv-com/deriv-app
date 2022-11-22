const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

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
                ],
                floatPrecision: 2,
            },
        },
    },
];

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        entry: {
            index: path.resolve(__dirname, 'src', 'index.tsx'),
        },
        mode: is_release ? 'production' : 'development',
        output: {
            path: path.resolve(__dirname, 'dist'),
            publicPath: base,
            filename: 'appstore/js/[name].js',
            libraryExport: 'default',
            library: '@deriv/appstore',
            libraryTarget: 'umd',
            chunkFilename: 'appstore/js/appstore.[name].[contenthash].js',
        },
        resolve: {
            alias: {
                Assets: path.resolve(__dirname, 'src/assets'),
                Components: path.resolve(__dirname, 'src/components'),
                Constants: path.resolve(__dirname, 'src/constants'),
                Modules: path.resolve(__dirname, 'src/modules'),
                Services: path.resolve(__dirname, 'src/services'),
                Stores: path.resolve(__dirname, 'src/stores'),
                Types: path.resolve(__dirname, 'src/types'),
                Utils: path.resolve(__dirname, 'src/utils'),
            },
            extensions: ['.ts', '.tsx', '.js'],
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
                            loader: '@deriv/shared/src/loaders/deriv-trader-loader.js',
                        },
                        {
                            loader: '@deriv/shared/src/loaders/deriv-account-loader.js',
                        },
                        {
                            loader: '@deriv/shared/src/loaders/deriv-cfd-loader.js',
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
                    test: input => is_release && /\.js$/.test(input),
                    loader: 'source-map-loader',
                },
                {
                    test: /\.(sc|sa|c)ss$/,
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                url: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
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
                    exclude: /node_modules|public\//,
                    use: svg_loaders,
                },
            ],
        },
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
        devtool: is_release ? undefined : 'eval-cheap-module-source-map',
        externals: [
            {
                react: true,
                'react-dom': true,
                classnames: true,
                mobx: true,
                'react-router': true,
                'react-router-dom': true,
                '@deriv/shared': true,
                '@deriv/components': true,
                '@deriv/translations': true,
                '@deriv/account': true,
                '@deriv/cfd': true,
            },
        ],
        plugins: [new CleanWebpackPlugin(), new ForkTsCheckerWebpackPlugin()],
    };
};

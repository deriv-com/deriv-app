const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');
const { openChromeBasedOnPlatform } = require('./helpers');

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';
    const sub_path = env && env.open && env.open !== true ? env.open : '';

    return {
        context: path.resolve(__dirname, '../src'),
        devServer: {
            static: {
                publicPath: base,
                watch: true,
            },
            open: {
                app: {
                    name: openChromeBasedOnPlatform(process.platform),
                },
                target: sub_path,
            },
            host: 'localhost',
            server: 'https',

            port: 8443,
            historyApiFallback: true,
            hot: false,
            client: {
                overlay: false,
            },
        },
        devtool: IS_RELEASE ? 'source-map' : 'eval-cheap-module-source-map',

        entry: './index.tsx',
        mode: IS_RELEASE ? 'production' : 'development',
        module: {
            rules: rules(),
        },
        resolve: {
            alias: ALIASES,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            symlinks: true,
        },
        optimization: {
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
            splitChunks: {
                chunks: 'all',
                minSize: 100000,
                minSizeReduction: 102400,
                minChunks: 1,
                maxSize: 2500000,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                automaticNameDelimiter: '~',
                enforceSizeThreshold: 500000,
                cacheGroups: {
                    default: {
                        minChunks: 2,
                        minSize: 102400,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                    defaultVendors: {
                        idHint: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                },
            },
        },
        output: {
            filename: 'js/core.[name].[contenthash].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
        },
        plugins: plugins({
            base,
            is_test_env: false,
            env,
        }),
        externals: [
            {
                '@deriv/utils': true,
            },
        ],
        snapshot: {
            managedPaths: [],
        },
        stats: {
            colors: true,
        },
    };
};

const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        context: path.resolve(__dirname, '../src'),
        devtool: IS_RELEASE ? undefined : 'eval-cheap-module-source-map',
        entry: {
            trader: path.resolve(__dirname, '../src', 'index.js'),
            MT5Store: 'Stores/Modules/MT5/mt5-store.js',
        },
        mode: IS_RELEASE ? 'production' : 'development',
        module: {
            rules: rules(),
        },
        resolve: {
            alias: ALIASES,
            extensions: ['.js', '.jsx'],
        },
        optimization: {
            chunkIds: 'named',
            moduleIds: 'named',
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
            // splitChunks: {
            //     chunks: 'all',
            //     minSize: 30000,
            //     maxSize: 0,
            //     minChunks: 1,
            //     maxAsyncRequests: 5,
            //     maxInitialRequests: 3,
            //     automaticNameDelimiter: '~',
            //     automaticNameMaxLength: 30,
            //     name: true,
            //     cacheGroups: {
            //         vendors: {
            //             test: /[\\/]node_modules[\\/]/,
            //             priority: -10
            //         },
            //         default: {
            //             minChunks: 2,
            //             priority: -20,
            //             reuseExistingChunk: true
            //         }
            //     }
            // }
        },
        output: {
            filename: 'js/[name].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'js/trader.[name].[contenthash].js',
            libraryExport: 'default',
            library: '@deriv/trader',
            libraryTarget: 'umd',
        },
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'react-router': 'react-router',
                mobx: 'mobx',
                'mobx-react': 'mobx-react',
                '@deriv/shared': '@deriv/shared',
                '@deriv/components': '@deriv/components',
                '@deriv/translations': '@deriv/translations',
                '@deriv/deriv-charts': '@deriv/deriv-charts',
                '@deriv/account': '@deriv/account',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
            /^@deriv\/account\/.+$/,
        ],
        target: 'web',
        plugins: plugins(base, false),
    };
};

const path      = require('path');
const {
    ALIASES,
    IS_RELEASE,
    MINIMIZERS,
    plugins,
    rules }     = require('./constants');

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        context     : path.resolve(__dirname, '../src'),
        devtool     : IS_RELEASE ? 'source-map' : 'cheap-module-eval-source-map',
        entry       : path.resolve(__dirname, '../src', 'index.js'),
        mode        : IS_RELEASE ? 'production' : 'development',
        module      : {
            rules: rules()
        },
        resolve     : {
            alias     : ALIASES,
            extensions: ['.js', '.jsx']
        },
        optimization: {
            namedChunks: true,
            namedModules: true,
            minimize   : IS_RELEASE,
            minimizer  : MINIMIZERS,
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
        output      : {
            filename  : 'js/trader.main.js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'js/trader.[name].[contenthash].js',
            libraryExport: 'default',
            library: 'deriv-trader',
            libraryTarget: 'umd',
        },
        externals: [
            {
                'react': 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'react-router': 'react-router',
                'mobx': 'mobx',
                'mobx-react': 'mobx-react',
                'deriv-shared': 'deriv-shared',
                'deriv-components': 'deriv-components',
            },
            /^deriv-shared\/.+$/,
            /^deriv-components\/.+$/
        ],
        target: 'web',
        plugins     : plugins(base, false),
    };
};

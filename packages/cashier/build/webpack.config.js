const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        context: path.resolve(__dirname, '../src'),
        devtool: IS_RELEASE ? 'source-map' : 'cheap-module-eval-source-map',
        entry: {
            cashier: path.resolve(__dirname, '../src', 'index.js'),
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
            namedChunks: true,
            namedModules: true,
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
        },
        output: {
            filename: 'js/[name].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'js/cashier.[name].[contenthash].js',
            libraryExport: 'default',
            library: '@deriv/cashier',
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
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/components\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
        target: 'web',
        plugins: plugins(base, false),
    };
};

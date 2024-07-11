const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        context: path.resolve(__dirname, '../'),
        devtool: IS_RELEASE ? 'source-map' : 'eval-cheap-module-source-map',
        entry: {
            reports: path.resolve(__dirname, '../src', 'index'),
        },
        mode: IS_RELEASE ? 'production' : 'development',
        module: {
            rules: rules(),
        },
        resolve: {
            alias: ALIASES,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        optimization: {
            chunkIds: 'named',
            moduleIds: 'named',
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
        },
        output: {
            filename: 'reports/js/[name].js',
            publicPath: base,
            path: path.resolve(__dirname, '../dist'),
            chunkFilename: 'reports/js/reports.[name].[contenthash].js',
            libraryExport: 'default',
            library: '@deriv/reports',
            libraryTarget: 'umd',
        },
        externals: [
            {
                react: 'react',
                'react-dom': 'react-dom',
                'react-router-dom': 'react-router-dom',
                'react-router': 'react-router',
                mobx: 'mobx',
                '@deriv-app/shared': '@deriv-app/shared',
                '@deriv-app/components': '@deriv-app/components',
                '@deriv-app/translations': '@deriv-app/translations',
                '@deriv-com/analytics': '@deriv-com/analytics',
            },
            /^@deriv-app\/shared\/.+$/,
            /^@deriv-app\/components\/.+$/,
            /^@deriv-app\/translations\/.+$/,
            /^@deriv\/account\/.+$/,
            /^@deriv\/analytics\/.+$/,
        ],
        target: 'web',
        plugins: plugins(base, false),
    };
};

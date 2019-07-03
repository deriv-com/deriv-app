const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');
const path = require('path');

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        context     : path.resolve(__dirname, '../src'),
        devServer   : {
            open              : 'Google Chrome',
            host              : 'localhost.binary.sx',
            https             : true,
            hot               : true,
            port              : 443,
            historyApiFallback: true,
            stats             : {
                colors: true,
            }
        },
        devtool     : IS_RELEASE ? 'source-map' : 'cheap-module-eval-source-map',
        entry       : './index.js',
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
            minimize   : IS_RELEASE,
            minimizer  : MINIMIZERS
        },
        output      : {
            filename  : 'js/[name].[hash].js',
            publicPath: base
        },
        plugins     : plugins(base, false),
    };
};

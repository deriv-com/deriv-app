const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = function (env, argv) {
    const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        context     : path.resolve(__dirname, '../src'),
        devtool     : IS_RELEASE ? 'cheap-module-eval-source-map' : 'source-map',
        entry       : './index.js',
        externals   : [nodeExternals()],
        mode        : IS_RELEASE ? 'development' : 'production',
        module      : {
            rules: rules(
                true,
                (env && env.mocha_only)
            ),
        },
        optimization: {
            namedChunks: true,
            minimize   : true,
            minimizer  : MINIMIZERS
        },
        output      : {
            filename  : 'js/[name].[hash].js',
            publicPath: '/'
        },
        plugins     : plugins(
            base,
            true,
            (env && env.mocha_only),
        ),
        resolve     : {
            alias     : ALIASES,
            extensions: ['.js', '.jsx']
        },
        target      : 'node',
    };
};

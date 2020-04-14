const path = require('path');
const { ALIASES, IS_RELEASE, MINIMIZERS, plugins, rules } = require('./constants');
const { openChromeBasedOnPlatform } = require('./helpers');

module.exports = function(env, argv) {
    const base = env && env.base && env.base !== true ? '/' + env.base + '/' : '/';
    const sub_path = env && env.open && env.open !== true ? env.open : '';
    const safe = env && env.safe && env.safe !== true ? env.safe : '';

    return {
        context: path.resolve(__dirname, '../src'),
        devServer: {
            open: openChromeBasedOnPlatform(process.platform),
            openPage: sub_path,
            host: 'localhost.binary.sx',
            https: !safe, // In case you want a failproof server, run insecure to not get cert issues; useful in CI env
            port: safe ? 8080 : 443,
            historyApiFallback: true,
            onListening: function(server) {
                const port = server.listeningApp.address().port;
                console.log('Listening and ready on port:', port);
            },
            stats: {
                colors: true,
            },
        },
        devtool: IS_RELEASE ? 'source-map' : 'cheap-module-eval-source-map',
        entry: './index.js',
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
            minimize: IS_RELEASE,
            minimizer: MINIMIZERS,
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                maxSize: 0,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                automaticNameDelimiter: '~',
                automaticNameMaxLength: 30,
                name: true,
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
        output: {
            filename: 'js/core.[name].[contenthash].js',
            publicPath: base,
        },
        plugins: plugins(base, false),
    };
};

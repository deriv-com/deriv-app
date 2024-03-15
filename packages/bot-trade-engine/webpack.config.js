const path = require('path');

const IS_RELEASE =
    process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging' || process.env.NODE_ENV === 'test';

const output = {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot/js/bot-trade-engine-main.[contenthash].js',
    chunkFilename: 'bot/js/bot.[name].[contenthash].js',
    libraryExport: 'default',
    library: '@deriv/bot-trade-engine',
    libraryTarget: 'umd',
};

module.exports = function (env) {
    const base = env && env.base && env.base !== true ? `/${env.base}/` : '/';

    return {
        entry: {
            interface: './tradeEngine/interface/index.js',
            trade: './tradeEngine/trade/index.js',
            utils: './tradeEngine/utils/index.js',
            constants: './constants/index.js',
            api: './api/index.js',
        },
        output: {
            ...output,
            publicPath: base,
        },
        devServer: {
            publicPath: '/dist/',
            disableHostCheck: true,
        },
        mode: IS_RELEASE ? 'production' : 'development',
        devtool: IS_RELEASE ? 'source-map' : 'eval-cheap-module-source-map',
        target: 'web',
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        rootMode: 'upward',
                    },
                },
            ],
        },
        resolve: {
            // alias: {
            //     Components: path.resolve(__dirname, 'src', 'components'),
            //     Constants: path.resolve(__dirname, './src/constants'),
            //     Stores: path.resolve(__dirname, './src/stores'),
            //     Utils: path.resolve(__dirname, './src/utils'),
            //     Types: path.resolve(__dirname, 'src/types'),
            // },
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        externals: [
            {
                '@babel/polyfill': '@babel/polyfill',
                '@deriv/shared': '@deriv/shared',
                '@deriv/translations': '@deriv/translations',
            },
            /^@deriv\/shared\/.+$/,
            /^@deriv\/translations\/.+$/,
        ],
    };
};

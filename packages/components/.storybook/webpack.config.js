const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

// Export a function. Accept the base config as the only param.
module.exports = async ({ config, mode }) => {
    // `mode` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.module.rules.push({
        test: /\.scss$/,
        use: [
            'style-loader',
            'css-loader',
            'sass-loader',
            {
                loader: 'sass-resources-loader',
                options: {
                    // Provide path to the file with resources
                    resources: require('@deriv/shared/src/styles/index.js'),
                },
            },
        ],
    });

    config.module.rules.push({
        resolve: {
            alias: {
                Components: path.resolve(__dirname, '../src/components'),
                Stories: path.resolve(__dirname, '../stories'),
            },
            extensions: ['.js', '.jsx'],
        },
    });
    config.module.rules.push({
        test: /\.js[x]?$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: [
                    ['@babel/plugin-proposal-decorators', { legacy: true }],
                    ['@babel/plugin-proposal-class-properties', { loose: true }],
                    '@babel/plugin-proposal-export-default-from',
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/plugin-proposal-export-namespace-from',
                    '@babel/plugin-syntax-dynamic-import',
                    '@babel/plugin-proposal-optional-chaining',
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                ],
            },
        },
    });

    config.plugins.push(
        new CopyPlugin({
            patterns: [
                { from: path.resolve(__dirname, '../lib/icon/sprite'), to: 'public/images/sprite', toType: 'dir' },
            ],
        })
    );
    // Return the altered config
    return config;
};

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin-v6');

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
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
    });

    config.module.rules.push({
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
            },
        },
    });

    config.plugins.push(
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../../components/lib/icon/sprites'),
                    to: 'public/sprites',
                    toType: 'dir',
                },
            ],
        })
    );

    // Return the altered config
    return config;
};

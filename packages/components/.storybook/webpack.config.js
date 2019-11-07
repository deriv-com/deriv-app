const path = require('path');

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
                    resources: require('deriv-shared/utils/index.js'),
                },
            },
        ],
    });

    // config.module.rules.push({
    //     test: /\.scss$/,
    //     use: ['style-loader', 'css-loader', 'sass-loader'],
    //     include: path.resolve(__dirname, '../src/components/**/'),
    // });

    // config.module.rules.push({
    //     test: /\.stories\.js?$/,
    //     loaders: [
    //         {
    //             loader: require.resolve('@storybook/source-loader'),
    //             options: { parser: 'javascript' },
    //         },
    //     ],
    //     enforce: 'pre',
    // });

    config.module.rules.push({
        resolve: {
            alias: {
                Components: path.resolve(__dirname, '../src/components'),
                Stories: path.resolve(__dirname, '../stories')
            },
            extensions: ['.js', '.jsx'],
        },
    });

    // Return the altered config
    return config;
};

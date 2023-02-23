const svg_loaders = [
    {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            rootMode: 'upward',
        },
    },
    {
        loader: 'react-svg-loader',
        options: {
            jsx: true,
            svgo: {
                plugins: [
                    { removeTitle: false },
                    { removeUselessStrokeAndFill: false },
                    { removeUknownsAndDefaults: false },
                ],
                floatPrecision: 2,
            },
        },
    },
];

module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx|mdx)'],
    addons: ['@storybook/addon-essentials', '@storybook/addon-docs', '@storybook/addon-links'],
    framework: '@storybook/react',
    core: {
        builder: 'webpack5',
    },
    webpackFinal: async config => {
        config.module.rules.forEach(rule => {
            const regex_string = rule.test.toString();
            if (regex_string.includes('svg')) {
                rule.test = new RegExp(regex_string.replace('svg', ''));
            }
        });

        config.module.rules.push({
            test: /\.svg$/,
            exclude: /node_modules|public\//,
            use: svg_loaders,
        });

        return config;
    },
};

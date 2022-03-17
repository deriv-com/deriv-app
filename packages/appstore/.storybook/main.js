module.exports = {
    stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(ts|tsx|mdx)'],
    addons: [
        '@storybook/addon-actions',
        '@storybook/addon-links',
        '@storybook/addon-notes',
        '@storybook/addon-knobs',
        '@storybook/addon-viewport',
    ],
    framework: '@storybook/react',
    core: {
        builder: 'webpack5',
    },
};

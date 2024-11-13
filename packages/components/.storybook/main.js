const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  stories: [
    '../stories/**/*.stories.mdx',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)',
  ],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],

  framework: '@storybook/react',

  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: {},
    },
  },

  webpackFinal: async (config) => {
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        'style-loader',
        'css-loader',
        'sass-loader',
        {
          loader: 'sass-resources-loader',
          options: {
            resources: require('@deriv/shared/src/styles/index.js'),
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      Components: path.resolve(__dirname, '../src/components'),
      Stories: path.resolve(__dirname, '../stories'),
      Shared: path.resolve(__dirname, './shared'),
    };

    config.module.rules.push({
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [
            '@babel/preset-env',
            '@babel/preset-react',
          ],
          plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-transform-class-properties', { loose: true }],
              '@babel/plugin-proposal-export-default-from',
              '@babel/plugin-transform-object-rest-spread',
              '@babel/plugin-transform-export-namespace-from',
              '@babel/plugin-syntax-dynamic-import',
              '@babel/plugin-transform-optional-chaining',
              '@babel/plugin-transform-nullish-coalescing-operator',
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
          ],
        },
      },
    });

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, '../lib/icon/sprites'),
            to: 'public/sprites',
            noErrorOnMissing: true,
          },
        ],
      })
    );

    config.resolve.extensions.push('.js', '.jsx', '.ts', '.tsx');
    return config;
  },
};

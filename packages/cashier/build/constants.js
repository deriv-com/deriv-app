const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const IgnorePlugin = require('webpack').IgnorePlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const { cssConfig } = require('./config');
const {
    css_loaders,
    file_loaders,
    html_loaders,
    js_loaders,
    svg_file_loaders,
    svg_loaders,
} = require('./loaders-config');

const IS_RELEASE = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

const ALIASES = {
    Components: path.resolve(__dirname, '../src/components'),
    Config: path.resolve(__dirname, '../src/config'),
    Containers: path.resolve(__dirname, '../src/containers'),
    Constants: path.resolve(__dirname, '../src/constants'),
    Images: path.resolve(__dirname, '../src/public/images'),
    Pages: path.resolve(__dirname, '../src/pages'),
    Sass: path.resolve(__dirname, '../src/Sass'),
    Stores: path.resolve(__dirname, '../src/stores'),
    Types: path.resolve(__dirname, '../src/types'),
    Utils: path.resolve(__dirname, '../src/utils'),
};

const rules = (is_test_env = false) => [
    ...(is_test_env
        ? [
              {
                  test: /\.(js|jsx|ts|tsx)$/,
                  exclude: /node_modules|__tests__|(build\/.*\.js$)|(utils\/lib)/,
                  include: /src/,
                  loader: 'eslint-loader',
                  enforce: 'pre',
                  options: {
                      formatter: require('eslint-formatter-pretty'),
                      configFile: path.resolve(__dirname, '../.eslintrc.js'),
                      ignorePath: path.resolve(__dirname, '../.eslintignore'),
                  },
              },
          ]
        : []),
    {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: is_test_env ? /node_modules/ : /node_modules|__tests__/,
        include: is_test_env ? /__tests__|src/ : /src/,
        use: js_loaders,
    },
    {
        test: /\.html$/,
        exclude: /node_modules/,
        use: html_loaders,
    },
    {
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: file_loaders,
    },
    {
        test: /\.svg$/,
        exclude: /node_modules/,
        include: /public\//,
        use: svg_file_loaders,
    },
    {
        test: /\.svg$/,
        exclude: /node_modules|public\//,
        use: svg_loaders,
    },
    is_test_env
        ? {
              test: /\.(sc|sa|c)ss$/,
              loaders: 'null-loader',
          }
        : {
              test: /\.(sc|sa|c)ss$/,
              use: css_loaders,
          },
];

const MINIMIZERS = !IS_RELEASE
    ? []
    : [
          new TerserPlugin({
              test: /\.js$/,
              parallel: 2,
          }),
          new CssMinimizerPlugin(),
      ];

const plugins = () => [
    new CleanWebpackPlugin(),
    new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new MiniCssExtractPlugin(cssConfig()),
];

module.exports = {
    IS_RELEASE,
    ALIASES,
    plugins,
    rules,
    MINIMIZERS,
};

const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const IgnorePlugin = require('webpack').IgnorePlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const {
    cssConfig,
    // htmlOutputConfig,
    stylelintConfig,
} = require('./config');
const {
    css_loaders,
    file_loaders,
    html_loaders,
    js_loaders,
    svg_file_loaders,
    svg_loaders,
    IS_RELEASE,
} = require('./loaders-config');

const ALIASES = {
    'react/jsx-runtime': 'react/jsx-runtime.js',
    _common: path.resolve(__dirname, '../src/_common'),
    Constants: path.resolve(__dirname, '../src/Constants'),
    Components: path.resolve(__dirname, '../src/Components'),
    Containers: path.resolve(__dirname, '../src/Containers'),
    Helpers: path.resolve(__dirname, '../src/Helpers'),
    Modules: path.resolve(__dirname, '../src/Modules'),
    Sass: path.resolve(__dirname, '../src/sass'),
    Stores: path.resolve(__dirname, '../src/Stores'),
    Types: path.resolve(__dirname, '../src/types'),
};

const rules = (is_test_env = false) => [
    ...(is_test_env
        ? [
              {
                  test: /\.(js|jsx)$/,
                  exclude: /node_modules|__tests__|(build\/.*\.js$)|(_common\/lib)/,
                  include: /src/,
                  loader: 'eslint-loader',
                  enforce: 'pre',
                  options: {
                      formatter: require('eslint-formatter-pretty'),
                      configFile: path.resolve(__dirname, '../.eslintrc.js'),
                      ignorePath: path.resolve(__dirname, '../.eslintignore'),
                  },
              },
              {
                  test: /\.(ts|tsx)$/,
                  exclude: /node_modules|__tests__|(build\/.*\.js$)|(_common\/lib)/,
                  include: /src/,
                  loader: 'eslint-loader',
                  enforce: 'pre',
                  options: {
                      formatter: require('eslint-formatter-pretty'),
                      configFile: path.resolve(__dirname, '../.eslintrc.ts'),
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
              exclude: /(smartcharts)/,
              parallel: 2,
          }),
          new CssMinimizerPlugin(),
      ];

const plugins = (base, is_test_env) => [
    new CleanWebpackPlugin(),
    new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
    new MiniCssExtractPlugin(cssConfig()),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true }),
    new ForkTsCheckerWebpackPlugin(),
    ...(IS_RELEASE
        ? []
        : [
              new WebpackManifestPlugin({
                  fileName: 'cfd/asset-manifest.json',
                  filter: file => file.name !== 'CNAME',
              }),
          ]),
    ...(is_test_env
        ? [new StylelintPlugin(stylelintConfig())]
        : [
              // ...(!IS_RELEASE ? [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ] : []),
          ]),
];

module.exports = {
    IS_RELEASE,
    ALIASES,
    plugins,
    rules,
    MINIMIZERS,
};

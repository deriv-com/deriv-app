const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const { IgnorePlugin, DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');

const {
    copyConfig,
    cssConfig,
    htmlInjectConfig,
    htmlOutputConfig,
    htmlPreloadConfig,
    stylelintConfig,
    generateSWConfig,
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
const Dotenv = require('dotenv-webpack');

const HOISTED_PACKAGES = {
    react: path.resolve(__dirname, '../../../node_modules/react'),
    'react-dom': path.resolve(__dirname, '../../../node_modules/react-dom'),
    'react-router': path.resolve(__dirname, '../../../node_modules/react-router'),
    'react-router-dom': path.resolve(__dirname, '../../../node_modules/react-router-dom'),
    mobx: path.resolve(__dirname, '../../../node_modules/mobx'),
    'mobx-react-lite': path.resolve(__dirname, '../../../node_modules/mobx-react-lite'),
    '@deriv/shared': path.resolve(__dirname, '../../../node_modules/@deriv/shared'),
    '@deriv/components': path.resolve(__dirname, '../../../node_modules/@deriv/components'),
    '@deriv/translations': path.resolve(__dirname, '../../../node_modules/@deriv/translations'),
    '@jimdanielswasswa/test-chart': path.resolve(__dirname, '../../../node_modules/@jimdanielswasswa/test-chart'),
    '@deriv/trader': path.resolve(__dirname, '../../../node_modules/@deriv/trader'),
    '@deriv/p2p': path.resolve(__dirname, '../../../node_modules/@deriv/p2p'),
    '@deriv/cashier': path.resolve(__dirname, '../../../node_modules/@deriv/cashier'),
    '@deriv/bot-web-ui': path.resolve(__dirname, '../../../node_modules/@deriv/bot-web-ui'),
    '@deriv/reports': path.resolve(__dirname, '../../../node_modules/@deriv/reports'),
    '@deriv/cfd': path.resolve(__dirname, '../../../node_modules/@deriv/cfd'),
};

const ALIASES = {
    _common: path.resolve(__dirname, '../src/_common'),
    App: path.resolve(__dirname, '../src/App'),
    Assets: path.resolve(__dirname, '../src/Assets'),
    Constants: path.resolve(__dirname, '../src/Constants'),
    Fonts: path.resolve(__dirname, '../src/public/fonts'),
    Images: path.resolve(__dirname, '../src/public/images'),
    Modules: path.resolve(__dirname, '../src/Modules'),
    Sass: path.resolve(__dirname, '../src/sass'),
    Services: path.resolve(__dirname, '../src/Services'),
    Stores: path.resolve(__dirname, '../src/Stores'),
    Translations: path.resolve(__dirname, '../src/public/translations'),
    Utils: path.resolve(__dirname, '../src/Utils'),
    ...HOISTED_PACKAGES,
};

const rules = (is_test_env = false) => [
    {
        // https://github.com/webpack/webpack/issues/11467
        test: /\.m?js/,
        include: /node_modules/,
        resolve: {
            fullySpecified: false,
        },
    },
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
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|otf|pdf)$/,
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

const plugins = ({ base, is_test_env }) => {
    return [
        new Dotenv({}),
        new DefinePlugin({
            'process.env.DATADOG_APPLICATION_ID': JSON.stringify(process.env.DATADOG_APPLICATION_ID),
            'process.env.DATADOG_CLIENT_TOKEN': JSON.stringify(process.env.DATADOG_CLIENT_TOKEN),
            'process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE': JSON.stringify(
                process.env.DATADOG_SESSION_REPLAY_SAMPLE_RATE
            ),
            'process.env.DATADOG_SESSION_SAMPLE_RATE': JSON.stringify(process.env.DATADOG_SESSION_SAMPLE_RATE),
            'process.env.REF_NAME': JSON.stringify(process.env.REF_NAME),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            'process.env.RUDDERSTACK_KEY': JSON.stringify(process.env.RUDDERSTACK_KEY),
            'process.env.GROWTHBOOK_CLIENT_KEY': JSON.stringify(process.env.GROWTHBOOK_CLIENT_KEY),
            'process.env.GROWTHBOOK_DECRYPTION_KEY': JSON.stringify(process.env.GROWTHBOOK_DECRYPTION_KEY),
            'process.env.IS_GROWTHBOOK_ENABLED': JSON.stringify(process.env.IS_GROWTHBOOK_ENABLED),
            'process.env.REMOTE_CONFIG_URL': JSON.stringify(process.env.REMOTE_CONFIG_URL),
            'process.env.ACC_TRANSLATION_PATH': JSON.stringify('deriv-app-account/staging'),
            'process.env.CROWDIN_URL': JSON.stringify('https://translations.deriv.com'),
        }),
        new CleanWebpackPlugin(),
        new CopyPlugin(copyConfig(base)),
        new HtmlWebPackPlugin(htmlOutputConfig(IS_RELEASE)),
        new HtmlWebpackTagsPlugin(htmlInjectConfig()),
        new PreloadWebpackPlugin(htmlPreloadConfig()),
        new IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/ }),
        new MiniCssExtractPlugin(cssConfig()),
        new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true }),
        ...(IS_RELEASE
            ? []
            : [new WebpackManifestPlugin({ fileName: 'asset-manifest.json', filter: file => file.name !== 'CNAME' })]),
        ...(is_test_env
            ? [new StylelintPlugin(stylelintConfig())]
            : [
                  new GenerateSW(generateSWConfig(IS_RELEASE)),
                  // ...(!IS_RELEASE ? [new BundleAnalyzerPlugin({ analyzerMode: 'static' })] : []),
              ]),
    ];
};

module.exports = {
    IS_RELEASE,
    ALIASES,
    plugins,
    rules,
    MINIMIZERS,
};

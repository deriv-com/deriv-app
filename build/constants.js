const CircularDependencyPlugin = require('circular-dependency-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const path = require('path');
const StylelintPlugin = require('stylelint-webpack-plugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const AssetsManifestPlugin = require('webpack-manifest-plugin');
const {
    copyConfig,
    cssConfig,
    htmlInjectConfig,
    htmlOutputConfig,
    swPrecacheConfig,
    stylelintConfig,
} = require('./config');
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
    _common     : path.resolve(__dirname, '../src/_common'),
    App         : path.resolve(__dirname, '../src/App'),
    Assets      : path.resolve(__dirname, '../src/Assets'),
    Constants   : path.resolve(__dirname, '../src/Constants'),
    Fonts       : path.resolve(__dirname, '../src/public/fonts'),
    Images      : path.resolve(__dirname, '../src/public/images'),
    Modules     : path.resolve(__dirname, '../src/Modules'),
    Sass        : path.resolve(__dirname, '../src/sass'),
    Services    : path.resolve(__dirname, '../src/Services'),
    Stores      : path.resolve(__dirname, '../src/Stores'),
    Translations: path.resolve(__dirname, '../src/public/translations'),
    Utils       : path.resolve(__dirname, '../src/Utils'),
};

const rules = (is_test_env = false) => ([
    {
        test   : /\.(js|jsx)$/,
        exclude: is_test_env ? /node_modules/ : /node_modules|__tests__/,
        include: is_test_env ? /__tests__|src/ : /src/,
        use    : js_loaders
    },
    {
        test   : /\.html$/,
        exclude: /node_modules/,
        use    : html_loaders
    },
    {
        test   : /\.(png|jpg|gif|woff|woff2|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use    : file_loaders
    },
    {
        test   : /\.svg$/,
        exclude: /node_modules/,
        include: /public\//,
        use    : svg_file_loaders
    },
    {
        test   : /\.svg$/,
        exclude: /node_modules|public\//,
        use    : svg_loaders
    },
    {
        test: /\.(sc|sa|c)ss$/,
        use : css_loaders
    }
]);

const MINIMIZERS = !IS_RELEASE ? [] : [
    new TerserPlugin({
        test     : /\.js/,
        exclude  : /(vendors~|smartcharts)/,
        parallel : true,
        sourceMap: true,
    }),
    new OptimizeCssAssetsPlugin(),
];

const plugins = (base, is_test_env) => ([
    new CleanWebpackPlugin(),
    new CopyPlugin(copyConfig(base)),
    new HtmlWebPackPlugin(htmlOutputConfig()),
    new HtmlWebpackTagsPlugin(htmlInjectConfig()),
    new MiniCssExtractPlugin(cssConfig()),
    new CircularDependencyPlugin({ exclude: /node_modules/, failOnError: true }),
    ...(IS_RELEASE ? [] : [ new AssetsManifestPlugin({ fileName: 'asset-manifest.json', filter: (file) => file.name !== 'CNAME' }) ]),
    ...(is_test_env ? [
        new StylelintPlugin(stylelintConfig()),
    ] : [
        new SWPrecacheWebpackPlugin(swPrecacheConfig(base)),
        // ...(!IS_RELEASE ? [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ] : []),
    ])
]);

module.exports = {
    IS_RELEASE,
    ALIASES,
    plugins,
    rules     : rules,
    MINIMIZERS,
};

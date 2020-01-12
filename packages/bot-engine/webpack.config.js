const { CleanWebpackPlugin }    = require('clean-webpack-plugin');
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const path                      = require('path');
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');
const MergeIntoSingleFilePlugin = require('webpack-merge-and-include-globally');
// const BundleAnalyzerPlugin      = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const is_release = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';

module.exports = function (env, argv) {
    // const base = env && env.base && env.base != true ? '/' + env.base + '/' : '/';

    return {
        entry    : {
            constants      :  path.join(__dirname, 'src', 'constants'),
            'help-strings' :  path.join(__dirname, 'src', 'scratch/help-content/help-strings'),
            scratch        :  path.join(__dirname, 'src', 'scratch'),
            services       :  path.join(__dirname, 'src', 'services/api'),
            utils          :  path.join(__dirname, 'src', 'utils'),
            'bot-engine'   :  path.join(__dirname, 'src', 'app.js'),
        },
        output: {
            path         :  path.resolve(__dirname, 'dist'),
            filename     :  '[name].js',
            libraryExport:  'default',
            library      :  'deriv-bot-engine',
            libraryTarget:  'umd',
        },
        devServer: {
            publicPath      : '/dist/',
            disableHostCheck: true,
        },
        optimization: { concatenateModules: false, providedExports: false, usedExports: false },
        mode     : is_release ? 'production' : 'development',
        devtool  : is_release ? 'source-map' : 'cheap-module-eval-source-map',
        target   : 'web',
        module   : {
            rules: [
                {
                    enforce: "pre",
                    test   : /\.(js|jsx)$/,
                    exclude: [ /node_modules/, /lib/, /utils/ ],
                    loader : "eslint-loader",
                    options: {
                        fix: true
                    },
                },
                {
                    test   : /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader : [ 'babel-loader' ],
                },
            ],
        },
        plugins  : [
            new CleanWebpackPlugin(),
            new CopyWebpackPlugin([
                { from: './src/scratch/xml', to: 'xml' },
                { from: './node_modules/scratch-blocks/media', to: 'media' },
                { from: './src/assets/images', to: 'media' },
            ]),
            new SpriteLoaderPlugin(),
            new MergeIntoSingleFilePlugin({
                files    : {
                    'scratch.min.js': [
                        'node_modules/scratch-blocks/blockly_compressed_vertical.js',
                        'node_modules/scratch-blocks/msg/messages.js',
                        'node_modules/blockly/generators/javascript.js',
                    ],
                },
                transform: {
                    'scratch.min.js': (code) => {
                        const uglifyjs = require('uglify-js');
                        return uglifyjs.minify(code).code;
                    },
                },
            }),
            // ...(!is_release ? [ new BundleAnalyzerPlugin({ analyzerMode: 'static' }) ] : []),
        ],
        externals: [
            {
                '@babel/polyfill'   : '@babel/polyfill',
                'classnames'        : 'classnames',
                'deriv-shared'      : 'deriv-shared',
                'deriv-translations': 'deriv-translations',
                'formik'            : 'formik',
                'react'             : 'react',
                'react-dom'         : 'react-dom',
                'smartcharts-beta'  : 'smartcharts-beta',
            },
            /^deriv-shared\/.+$/,
            /^deriv-translations\/.+$/,
        ],
    };
}

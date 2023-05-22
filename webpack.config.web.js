const path = require('path');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const plugins = [
    new Dotenv(),
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
    }),
    new CopyWebpackPlugin([
        {
            from: 'node_modules/@deriv/deriv-charts/dist/*.smartcharts.*',
            to: path.resolve(__dirname),
            flatten: true,
        },
        {
            from: 'node_modules/binary-style/src/images/favicons',
            to: '../image/favicons',
        },
    ]),
];

const productionPlugins = () => {
    const args = {};
    if (process.env.ARGS.indexOf('--test')) {
        args.BRANCH = JSON.stringify(process.env.BRANCH);
        args.ARGS = JSON.stringify(process.env.ARGS);
    }
    if (process.env.NODE_ENV === 'production') {
        return [
            new webpack.DefinePlugin({
                'process.env': {
                    NODE_ENV: JSON.stringify('production'),
                    ...args,
                },
            }),
            new webpack.optimize.UglifyJsPlugin({
                include: /\.js$/,
                minimize: true,
                sourceMap: true,
                compress: {
                    warnings: false,
                },
            }),
        ];
    }
    return [];
};

module.exports = {
    entry: {
        bot: path.join(__dirname, 'src', 'botPage', 'view'),
    },
    output: {
        filename: production ? '[name].min.js' : '[name].js',
        sourceMapFilename: production ? '[name].min.js.map' : '[name].js.map',
    },
    devtool: 'source-map',
    watch: !production,
    target: 'web',
    externals: {
        CIQ: 'CIQ',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(css|scss|sass)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|eot|ttf|otf)$/,
                use: {
                    loader: 'file-loader',
                },
            },
        ],
    },
    plugins: plugins.concat(productionPlugins()),
};

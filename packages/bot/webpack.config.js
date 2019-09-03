const CopyWebpackPlugin         = require('copy-webpack-plugin');
const MiniCssExtractPlugin      = require("mini-css-extract-plugin");
const path                      = require('path');
const StyleLintPlugin           = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');
const ProvidePlugin             = require('webpack').ProvidePlugin;

const output =  {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bot.js',
    chunkFilename: '[name]-[chunkhash:6].bot.js',
    libraryExport: 'default',
    library: 'deriv-bot',
    libraryTarget: 'umd',
    hashDigestLength: 6,
};

module.exports = {
    entry : [
        'core-js/fn/promise',
        path.join(__dirname, 'src', 'app.js') 
    ],
    output,
    devServer: {
        publicPath: '/dist/',
        disableHostCheck: true,
    },
    devtool: 'source-map',
    target: 'web',
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    'css-hot-loader',
                     MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader: 'sass-loader',
                        options: { sourceMap: true },
                    },
                    {
                        loader: "sass-resources-loader",
                        options: {
                          resources: require(path.resolve(__dirname , 'node_modules/deriv-shared/utils/index.js')),
                        }
                    }     
               ]
            },  
            {  
                test: /\.svg$/,
                use: [
                    {
                        loader: 'svg-sprite-loader',
                        options: {
                            extract: true,
                            spriteFilename: 'bot-sprite.svg',
                        },
                    },
                    {
                        loader: 'svgo-loader',
                        options: {
                            plugins: [
                                { removeUselessStrokeAndFill: false },
                                { removeUnknownsAndDefaults: false },
                            ],
                        },
                    },
                ],
            },
            {
                enforce: "pre",
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/, /lib/, /utils/],
                loader: "eslint-loader",
                options: {
                    fix: true
                },
            },
            {
                test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'bot.css' }),
        new StyleLintPlugin( { fix: true }),
        new CopyWebpackPlugin([
            { from: './src/scratch/xml', to: 'xml' },
            { from: './node_modules/scratch-blocks/media', to: 'media' },
        ]),
        new SpriteLoaderPlugin(),
        new ProvidePlugin({
            goog                : 'expose-loader?goog!scratch-blocks/shim/blockly_compressed_vertical.goog',
            Blockly             : 'expose-loader?Blockly!scratch-blocks/shim/blockly_compressed_vertical.Blockly',
            'Blockly.JavaScript': 'expose-loader?Blockly.JavaScript!blockly/generators/javascript',
        }),
    ],
};
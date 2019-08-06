const StyleLintPlugin           = require('stylelint-webpack-plugin');
const SpriteLoaderPlugin        = require('svg-sprite-loader/plugin');
const path                      = require('path');

module.exports = (env, argv) => ({
    // entry: path.join(__dirname, 'src', 'index.js'),
    entry: {
        // index: path.join(__dirname, 'src', 'index.js'),
        button: path.resolve(__dirname, 'src' ,'components/button/index.js'),
        label: path.resolve(__dirname, 'src' , 'components/label/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: "[name].js",
        libraryExport: 'default',
        library: ["deriv-component", "[name]"],
        libraryTarget: 'umd',
    },
    optimization : {
        minimize: true,
        // TODO enable splitChunks
        // splitChunks: {
        //     chunks: 'all'
        // }
    },
    devServer: {
        publicPath: '/dist/',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    'css-hot-loader',
                    'style-loader',
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
           (argv.mode === 'production' ? {
                    enforce: "pre",
                    test: /\.(js|jsx)$/,
                    exclude: [/node_modules/],
                    loader: "eslint-loader",
                    options: {
                        fix: true
                    },
                  } :{}),                
            {
                  test   : /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader : 'babel-loader',
            },
        ],
    },
    plugins: [
        new StyleLintPlugin( { fix: true }),
        new SpriteLoaderPlugin(),
    ],
});

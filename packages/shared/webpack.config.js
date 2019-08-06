// const ExtractTextPlugin   = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin   = require("mini-css-extract-plugin");
const StyleLintPlugin        = require('stylelint-webpack-plugin');
const path                   = require('path');

const isServe = process.env.BUILD_MODE === 'serve';

module.exports = {
  target: 'web',
  entry: {
    date: path.resolve(__dirname, 'src' ,'utils/date/index.js'),
    events: path.resolve(__dirname, 'src' , 'utils/events/index.js'),
  },
  output: {
      path: path.resolve(__dirname, 'utils'),
      filename: "[name].js",
      libraryExport: 'default',
      library: ["deriv-shared", "[name]"],
      libraryTarget: 'umd',
  },
  optimization : {
      minimize: true,
  },
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
        ]
      },  
      ( !isServe ? {
        enforce: "pre",
        test: /\.(js)$/,
        exclude: [/node_modules/ , /utils/],
        loader: "eslint-loader",
        options: {
            fix: true
        },
      } :{}),                
      {
          test   : /\.(js)$/,
          exclude: /node_modules/,
          loader : 'babel-loader',
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: 'shared.scss' }),
    // new ExtractTextPlugin('[name].scss'),
    new StyleLintPlugin( { fix: true })
  ],
  externals: {
    'babel-polyfill': 'babel-polyfill',
    'moment'        :'moment',
  }
}

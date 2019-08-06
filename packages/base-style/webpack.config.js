const ExtractTextPlugin   = require('extract-text-webpack-plugin');
const StyleLintPlugin     = require('stylelint-webpack-plugin');
const path                = require('path');

module.exports = {
  target: 'web',
  entry: {
    'style': path.join(__dirname, 'src' , 'style.scss'),
  },
  output: {
    path: path.join(__dirname, './lib/'),
    filename: '[name].scss'
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-hot-loader', 'css-loader']
        })
    },  
    ]
  },
  plugins: [
    new ExtractTextPlugin('[name].scss'),
    new StyleLintPlugin( { fix: true })
  ]
}

const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    'holly-quintet': './public/entry/holly-quintet.js'
  },
  output: {
    path: './public/dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract('style', 'css!stylus')
    }, {
      test: /\.js$/,
      loader: 'uglify!babel'
    }]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({}),
    new ExtractTextPlugin('[name].css')
  ]
}

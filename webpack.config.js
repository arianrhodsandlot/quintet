const webpack = require('webpack')

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
      loaders: ['style', 'css', 'stylus']
    }, {
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  },
  devtool: 'eval',
  plugins: [
  ]
}

var webpack = require('webpack')
var env = process.env.NODE_ENV

var webpackPlugins = []

if (env === 'production') {
  webpackPlugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = {
  entry: './public/entry/app.js',
  output: {
    path: './public/dist/',
    filename: 'bundle.js'
  },
  module: {
    loaders: [{
      test: /\.css/,
      loader: 'style!css'
    }, {
      test: /\.styl$/,
      loader: 'style!css!stylus'
    }, {
      test: /\.js$/,
      loader: 'uglify!babel'
    }]
  },
  plugins: webpackPlugins
}

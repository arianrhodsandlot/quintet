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
      test: /\.less$/,
      loader: 'style!css!less'
    }, {
      test: /\.styl$/,
      loader: 'style!css!stylus'
    }, {
      test: /\.js$/,
      loader: 'uglify!babel'
    }, {
      test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=application/font-woff'
    }, {
      test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=application/font-woff'
    }, {
      test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=application/octet-stream'
    }, {
      test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=application/vnd\.ms-fontobject'
    }, {
      test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
      loader: 'url?mimetype=image/svg+xml'
    }]
  },
  plugins: webpackPlugins
};

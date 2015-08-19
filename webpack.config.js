var webpack = require('webpack')
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
  plugins: [new webpack.optimize.UglifyJsPlugin()]
};

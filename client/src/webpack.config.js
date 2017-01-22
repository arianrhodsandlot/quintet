module.exports = {
  entry: {
    'app': './public/app'
  },
  output: {
    path: './public/dist/',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.styl$/,
      loaders: ['style', 'css', 'stylus']
    }, {
      test: /\.js$/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    }]
  }
}

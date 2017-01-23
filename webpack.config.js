const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    css: './client/src/stylesheets/index.styl',
    js: './client/src/scripts/index.js'
  },
  output: {
    path: './client/dist/',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.html$/,
      use: ['html-loader']
    }, {
      test: /\.pug$/,
      use: ['pug-loader']
    }, {
      test: /\.styl$/,
      use: ['style-loader', 'css-loader', 'stylus-loader']
    }, {
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              targets: {
                browsers: ['> 1%']
              },
              modules: false,
              loose: true
            }]
          ]
        }
      }]
    }]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/src/pages/home/index.pug',
      filename: 'index.html'
    })
  ]
}

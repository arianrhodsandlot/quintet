const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    css: './client/src/stylesheets/index.styl',
    js: './client/src/scripts/index.js'
  },
  output: {
    path: path.resolve('./client/dist/'),
    filename: '[chunkhash].js',
    publicPath: '/'
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
      filename: '[chunkhash].html'
    })
  ]
}

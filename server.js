const Glue = require('glue')
const api = require('./api')
const client = require('./client')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const manifest = {
  connections: [{
    port: process.env.PORT || 5000
  }],
  registrations: [{
    plugin: 'inert'
  }, {
    plugin: {
      register: 'hapi-webpack',
      options: {
        entry: {
          css: './client/src/stylesheets/index.styl',
          js: './client/src/scripts/index.js'
        },
        output: {
          path: './client/dist/',
          filename: '[name].js'
        },
        module: {
          loaders: [{
            test: /\.html$/,
            loader: 'html'
          }, {
            test: /\.pug$/,
            loader: 'pug'
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
        },
        plugins: [
          new HtmlWebpackPlugin({
            template: './client/src/pages/home/index.pug',
            filename: 'index.html'
          })
        ]
      }
    }
  }]
}

const route = function (server) {
  server.route(api)
  server.route(client)
}

const serve = function (server) {
  server.start(function (err) {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
  })
}

Glue.compose(manifest, {}, function (err, server) {
  if (err) throw err
  route(server)
  serve(server)
})

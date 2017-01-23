const Glue = require('glue')
const api = require('./api')
const client = require('./client')
const webpackConfig = require('./webpack.config')

const manifest = {
  server: {},
  connections: [{
    port: process.env.PORT || 5000
  }],
  registrations: [{
    plugin: {
      register: 'inert'
    }
  }, {
    plugin: {
      register: 'good',
      options: {
        reporters: {
          console: [
            {module: 'good-console'},
            'stdout'
          ]
        }
      }
    }
  }, {
    plugin: {
      register: './lib/hapi-webpack2.js',
      options: webpackConfig
    }
  }]
}

const route = function (server) {
  api.concat(client).forEach(function (router) {
    server.route(router)
  })
}

const serve = function (server) {
  server.start(function (err) {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
  })
}

Glue.compose(manifest, {
  relativeTo: __dirname
}, function (err, server) {
  if (err) throw err
  route(server)
  serve(server)
})

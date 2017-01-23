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
      register: 'h2o2'
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

module.exports.manifest = manifest
module.exports.route = route
module.exports.serve = serve

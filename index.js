const Hoek = require('hoek')
const {once} = require('lodash')
const api = require('./api')
const client = require('./client')
const webpackConfig = require('./webpack.config')

const port = parseInt(process.env.HOLLY_QUINTET_PORT || process.env.npm_package_config_port || process.argv[2])
Hoek.assert(port, 'Port is not specified!')

const manifest = {
  server: {},
  connections: [{
    host: 'localhost',
    port
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
            {
              module: 'good-squeeze',
              name: 'Squeeze',
              args: [{log: '*', response: '*'}]
            }, {
              module: 'good-console'
            },
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

const route = once(function (server) {
  api.concat(client).forEach(function (router) {
    server.route(router)
  })
})

const serve = once(function (server) {
  server.start(function (err) {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
  })
})

module.exports.manifest = manifest
module.exports.route = route
module.exports.serve = serve

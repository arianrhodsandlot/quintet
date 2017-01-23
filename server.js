const Glue = require('glue')
const api = require('./api')
const client = require('./client')
const webpackConfig = require('./webpack.config')

const manifest = {
  connections: [{
    port: process.env.PORT || 5000
  }],
  registrations: [{
    plugin: 'inert'
  }, {
    plugin: {
      register: 'hapi-webpack',
      options: webpackConfig
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

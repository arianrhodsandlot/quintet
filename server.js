const Hapi = require('hapi')
const Vision = require('vision')
const pug = require('pug')
const routes = require('.')

const server = new Hapi.Server({port: 3000, host: 'localhost'})

const provision = async function () {
  await server.register(Vision)
  server.views({engines: {pug}, relativeTo: __dirname, path: 'src/templates/'})
  server.route(routes)
  await server.start()
  console.log('Server running at:', server.info.uri)
}

provision()

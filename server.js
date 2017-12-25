const path = require('path')
const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const pug = require('pug')
const routes = require('.')

const server = new Hapi.Server({
  port: 3000,
  host: 'localhost',
  routes: {
    files: {
      relativeTo: path.join(__dirname, 'src/public/')
    }
  }
})

const provision = async function (server) {
  await server.register(Inert)
  await server.register(Vision)
  server.views({engines: {pug}, relativeTo: __dirname, path: 'src/templates/'})
  server.route(routes)
  await server.start()
  console.log(`Server started at ${server.info.uri}`)
}

provision(server)

const Hapi = require('hapi')
const inert = require('inert')

const server = new Hapi.Server()

const port = process.env.PORT || 5000
server.connection({port: port})

server.register(inert)

module.exports = server

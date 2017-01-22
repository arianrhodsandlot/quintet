const server = require('../server')

server.route({
  method: 'GET',
  path: '/{covers?}',
  handler: {
    file: 'client/public/dist/index.html'
  }
})

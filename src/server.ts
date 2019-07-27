import http from 'http'
import getPort from 'get-port'
import bundler from './bundler'
import app from './index'

bundler.on('bundled', () => {
  const server = http.createServer(app)

  const port = getPort({
    port: parseInt(process.argv[2] || process.env.HOLLY_QUINTET_PORT || process.env.npm_package_config_port!, 10)
  })

  server.listen(port)
    .on('listening', () => {
      const addr = server.address()!
      const bind =  typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
      console.log(`Listening on ${bind}`)
    })
})

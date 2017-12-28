import path from 'path'
import url from 'url'
import Hapi from 'hapi'
import Inert from 'inert'
import Vision from 'vision'
import pug from 'pug'
import routes from '.'

const dirname = path.parse(url.parse(import.meta.url).pathname).dir

const server = new Hapi.Server({
  port: process.env.npm_package_config_port,
  routes: {
    files: {
      relativeTo: path.join(dirname, 'src/public/')
    }
  }
})

const provision = async function (server) {
  await server.register([Vision, Inert])
  server.views({engines: {pug}, relativeTo: dirname, path: 'src/templates/'})
  server.route(routes)
  await server.start()
  console.log(`Server started at ${server.info.uri}`)
}

provision(server)

export default server

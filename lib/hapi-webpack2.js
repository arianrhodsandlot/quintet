/**
christophercliff's hapi-webpack (https://github.com/christophercliff/hapi-webpack) can only work with webpack@1.x, and cannot work with watch mode, let's modify it.
refer: https://github.com/christophercliff/hapi-webpack/blob/master/lib/index.js
*/
const path = require('path')
const url = require('url')
const webpack = require('webpack')

const register = function (server, options, next) {
  const publicPath = url.parse(options.output.publicPath || '/').pathname

  webpack(options, function (err, stats) {
    if (err) return next(err)

    stats = stats.toJson()
    stats.assets.forEach(function (asset) {
      const routeId = `_webpack_${asset.name}`
      if (server.lookup(routeId)) return
      server.route({
        method: 'GET',
        path: path.join(publicPath, asset.name),
        config: {
          id: routeId
        },
        handler: {
          file: path.resolve(options.output.path, asset.name)
        }
      })
    })
    server.app.webpack = {stats}
    return next()
  })
}
register.attributes = {
  name: 'hapi-webpack2'
}

module.exports = register

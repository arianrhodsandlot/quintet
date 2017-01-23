/**
christophercliff's hapi-webpack (https://github.com/christophercliff/hapi-webpack) can only work with webpack@1.x, let's modify it.
refer: https://github.com/christophercliff/hapi-webpack/blob/master/lib/index.js
*/
const path = require('path')
const webpack = require('webpack')

const register = function (server, options, next) {
  webpack(options, function (err, stats) {
    if (err) return next(err)
    stats = stats.toJson()
    stats.assets.forEach(function (asset) {
      server.route({
        method: 'GET',
        path: '/' + asset.name,
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

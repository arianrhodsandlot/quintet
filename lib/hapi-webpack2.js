/**
christophercliff's hapi-webpack (https://github.com/christophercliff/hapi-webpack) can only work with webpack@1.x, let's modify it.
refer: https://github.com/christophercliff/hapi-webpack/blob/master/lib/index.js
*/
const path = require('path')
const webpack = require('webpack')

const register = function (server, options, next) {
  webpack(options, function (err, _stats) {
    if (err) return next(err)
    const stats = _stats.toJson()
    const paths = stats.assets.map(function (asset) {
      const _path = '/' + asset.name
      server.route({
        method: 'GET',
        path: _path,
        handler: {
          file: path.resolve(options.output.path, asset.name)
        }
      })
      return _path
    })
    server.app.webpack = {paths, stats}
    return next()
  })
}
register.attributes = {
  name: 'hapi-webpack2'
}

module.exports = register

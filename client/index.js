const path = require('path')
const webpackConfig = require('../webpack.config')

const allClientViewshandler = function (request, reply) {
  const {assets} = request.server.app.webpack.stats
  const htmlAsset = assets.find((asset) => path.parse(asset.name).ext === '.html')
  const htmlFilePath = path.join(webpackConfig.output.path, htmlAsset.name)
  reply.file(htmlFilePath)
}

module.exports = [{
  method: 'GET',
  path: '/',
  handler: allClientViewshandler
}, {
  method: 'GET',
  path: '/covers',
  handler: allClientViewshandler
}]

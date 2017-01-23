const path = require('path')
const Joi = require('joi')
const webpackConfig = require('../webpack.config')

const allClientViewsHandler = function (request, reply) {
  const {assets} = request.server.app.webpack.stats
  const htmlAsset = assets.find((asset) => path.parse(asset.name).ext === '.html')
  const htmlFilePath = path.join(webpackConfig.output.path, htmlAsset.name)
  reply.file(htmlFilePath)
}

module.exports = [{
  method: 'GET',
  path: '/',
  handler: allClientViewsHandler
}, {
  method: 'GET',
  path: '/covers',
  handler: allClientViewsHandler
}, {
  method: 'GET',
  path: '/file',
  config: {
    validate: {
      query: {
        url: Joi.string().uri().required()
      }
    }
  },
  handler: function (request, reply) {
    reply.proxy({
      uri: request.query.url,
      timeout: 5000
    })
  }
}]

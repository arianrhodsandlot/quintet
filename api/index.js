const Joi = require('joi')
const scope2site = require('./utils/scope2site')
const searchCovers = require('./utils/search')

module.exports = [{
  method: 'GET',
  path: '/api/covers',
  config: {
    validate: {
      query: {
        scope: Joi.string().required(),
        query: Joi.string().min(1).max(100).required()
      }
    }
  },
  handler: function (request, reply) {
    const {scope, query} = request.query
    const site = scope2site(scope)
    searchCovers(site, query).then(reply)
  }
}]

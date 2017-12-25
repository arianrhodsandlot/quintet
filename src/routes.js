const Joi = require('joi')
const home = require('./handlers/home')
const search = require('./handlers/search')
const file = require('./handlers/file')

module.exports = [{
  method: 'GET',
  path: '/',
  handler: home
}, {
  method: 'GET',
  path: '/search',
  config: {
    validate: {
      query: {
        scope: Joi.string().required(),
        query: Joi.string().min(1).max(100).required()
      }
    }
  },
  handler: search
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
  handler: file
}]

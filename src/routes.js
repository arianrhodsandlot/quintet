const path = require('path')
const Joi = require('joi')
const home = require('./handlers/home')
const search = require('./handlers/search')
const download = require('./handlers/download')

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
        s: Joi.string().required(),
        q: Joi.string().min(1).max(100).required()
      }
    }
  },
  handler: search
}, {
  method: 'GET',
  path: '/download',
  config: {
    validate: {
      query: {
        u: Joi.string().uri().required(),
        n: Joi.string()
      }
    }
  },
  handler: download
}, {
  method: 'GET',
  path: '/{filename}',
  handler: {
    directory: {
      path: '.'
    }
  }
}]

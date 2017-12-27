import path from 'path'
import Joi from 'joi'
import home from './handlers/home'
import search from './handlers/search'
import download from './handlers/download'

export default [{
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

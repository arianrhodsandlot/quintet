'use strict'

const _ = require('lodash')
const Q = require('q')

const searchResults2json = require('./utils/search-results2json')

const request = function(options) {
  return Q.denodeify(require('request'))(options)
    .then(function(results) {
      return results[0]
    })
}

const controller = {
  home: function*() {
    _.assign(this.state, {
      title: 'Holly Quintet' + (
        this.get('host') === 'localhost:5000' ?
        ' (local)' :
        ''
      )
    })
    this.body = yield this.render('home/index', this.state)
  },
  search: function*() {
    const query = this.query.query

    let scope = this.query.scope

    switch (scope) {
      case 'itunes-hk':
      case 'itunes-jp':
      case 'itunes-tw':
      case 'itunes-us':
        scope = `itunes.apple.com/${scope.slice('itunes-'.length)}/album`
        break
      case 'amazon-com':
        scope = 'amazon.com'
        break
      case 'amazon-jp':
        scope = 'amazon.co.jp'
        break
      case 'orpheus':
        scope = 'music.163.com/album'
        break
      case 'qq':
        scope = 'y.qq.com/y/static'
        break
      default:
        scope = ''
        break
    }

    try {
      // for dev use
      // return this.body = require('./utils/search-results2json/scheme')

      const searchResponse = yield request({
        baseUrl: 'https://www.google.com',
        url: '/search',
        qs: {
          tbm: 'isch',
          gws_rd: 'cr', //get rid of our request being redirected by country
          q: `${query} site:${scope}`
        },
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0'
        }
      })
      this.body = searchResults2json(searchResponse.body, scope)
    } catch (err) {
      console.error(err)
      this.status = 500
      this.body = {
        err
      }
    }
  },
  download: function*() {
    var res = yield request({
      url: this.query.url,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0'
      },
      encoding: null
    }).catch(e => {
      this.body = e + ''
    })

    if (!res) {
      return
    }

    this.set(res.headers)
    this.body = res.body
    this.attachment(this.query.filename || res.request.uri.pathname)
  }
}

module.exports = controller

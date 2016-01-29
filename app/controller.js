'use strict'

const _ = require('lodash')
const Q = require('q')

const searchResults2json = require('./utils/search-results2json')

const request = options => Q.denodeify(require('request'))(options).then(_.first)

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
      case 'vgmdb':
        scope = 'vgmdb.net/album'
        break
      case 'orpheus':
        scope = 'music.163.com/album'
        break
      case 'qq':
        scope = 'y.qq.com/y/static'
        break
      case 'musicbrainz':
        scope = 'musicbrainz.org'
        break
      default:
        scope = ''
        break
    }

    const requestOption = {
      baseUrl: 'https://www.google.com',
      url: '/search',
      qs: {
        tbm: 'isch',
        gws_rd: 'cr', //get rid of our request being redirected by country
        q: `${query} site:${scope}`
      },
      headers: {
        'user-agent': this.request.get('user-agent')
      }
    }

    try {
      // for dev use
      // return this.body = require('./utils/search-results2json/scheme')
      const searchResponse = yield request(requestOption)
      this.set('X-Proxy-URL', searchResponse.request.uri.href)
    } catch (err) {
      console.error('Error when connect to Google:')
      console.error(err.stack)

      this.status = 500
      this.body = {err.message}
    }

    try {
      this.body = searchResults2json(searchResponse.body, scope)
    } catch (err) {
      console.error('Error when parsing results from Google:')
      console.error(err.stack)

      this.status = 500
      this.body = {err.message}
    }
  },

  download: function*() {
    let res = yield request({
      url: this.query.url,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0'
      },
      encoding: null
    }).catch(e => {
      this.status = 500
      this.body = `${e}`
    })

    if (!res) return

    // in case some covers from itunes only have a 600x600 one
    if (res.statusCode === 404) {
      const keyword = '/cover1200x1200.'
      const index = this.query.url.lastIndexOf(keyword)
      const count = _.size(this.query.url) - index - keyword.length

      if (index > 0 && count < 5) {
        res = yield request({
          url: this.query.url.replace(keyword, '/cover600x600.'),
          headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64; rv:39.0) Gecko/20100101 Firefox/39.0'
          },
          encoding: null
        }).catch(e => {
          this.status = 500
          this.body = e + ''
        })
      }
    }

    this.set(res.headers)
    this.body = res.body
    this.attachment(this.query.filename || res.request.uri.pathname)
  }
}

module.exports = controller

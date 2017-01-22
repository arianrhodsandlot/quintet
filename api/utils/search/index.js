const url = require('url')
const _ = require('lodash')
const Q = require('q')
const request = (options) => Q.denodeify(require('request'))(options).then(_.first)
const cheerio = require('cheerio')

const getOriginSrcFromItunes = function (src) {
  const falseReg = /cover\d{3}x\d{3}/
  const trueReg = /1200x1200/

  if (falseReg.test(src) && !trueReg.test(src)) {
    src = src.replace(falseReg, 'cover1200x1200')
  }
  return src
}

const getOriginSrcFrom163 = function (src) {
  return _.assign(
    url.parse(src), {
      search: ''
    }).format(src)
}

const getOriginSrc = function (src, site) {
  var getOriginSrc

  if (_.includes(site, 'itunes')) {
    getOriginSrc = getOriginSrcFromItunes
  } else if (_.includes(site, 'music.163.com')) {
    getOriginSrc = getOriginSrcFrom163
  } else {
    getOriginSrc = _.identity
  }

  return getOriginSrc(src)
}

const convertResultHtml2Json = function (resultHtml, site) {
  const $result = cheerio(resultHtml)
  const $meta = $result.children('.rg_meta')

  const meta = JSON.parse(_.unescape($meta.html()))

  const cover = {
    originTitle: meta.pt,
    title: meta.pt,
    refer: meta.ru,
    src: meta.ou,
    originSrc: getOriginSrc(meta.ou, site)
  }

  return cover
}

const searchResults2json = function (html, site) {
  const $html = cheerio(html)
  const $results = $html.find('.rg_di.rg_el')

  return _($results)
    .map(_.partial(convertResultHtml2Json, _, site))
    .take(12)
    .value()
}

const searchCovers = function (site, query) {
  const requestOption = {
    baseUrl: 'https://www.google.com',
    url: '/search',
    qs: {
      tbm: 'isch',
      gws_rd: 'cr', // get rid of our request being redirected by country
      q: `${query} site:${site}`
    },
    headers: {
      'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    }
  }
  return request(requestOption).then(function (searchResponse) {
    return searchResults2json(searchResponse.body, site)
  })
}

module.exports = searchCovers

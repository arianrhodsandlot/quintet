const url = require('url')
const _ = require('lodash')
const Q = require('q')
const request = (options) => Q.denodeify(require('request'))(options).then(_.first)
const cheerio = require('cheerio')
const path = require('path')

const getCoverOriginSrcFromItunes = function (src) {
  let parsedSrc = url.parse(src, true)
  let parsedPath = path.parse(parsedSrc.pathname)
  parsedPath.name = parsedPath.name.replace(/\d{3}x\d{3}/, '1200x1200')
  parsedPath.base = `${parsedPath.name}${parsedPath.ext}`
  parsedSrc.pathname = path.format(parsedPath)
  return url.format(parsedSrc)
}

const getCoverOriginSrcFrom163 = function (src) {
  let parsedSrc = url.parse(src, true)
  parsedSrc.search = ''
  return url.format(parsedSrc)
}

const getCoverOriginSrc = function (src) {
  const coverHost = url.parse(src, true).hostname
  if (coverHost.endsWith('.mzstatic.com')) {
    return getCoverOriginSrcFromItunes(src)
  } else if (coverHost.endsWith('.music.126.net')) {
    return getCoverOriginSrcFrom163(src)
  } else {
    return src
  }
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
    originSrc: getCoverOriginSrc(meta.ou)
  }

  return cover
}

const searchResults2json = function (html) {
  const $html = cheerio(html)
  const $results = $html.find('.rg_di.rg_el')

  return _($results)
    .map(convertResultHtml2Json)
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
    return searchResults2json(searchResponse.body)
  })
}

module.exports = searchCovers

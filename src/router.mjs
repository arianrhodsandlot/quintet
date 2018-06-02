import express from 'express'
import chowdown from 'chowdown'
import Agent from 'socks5-https-client/lib/Agent'
import url from 'url'
import request from 'request'
import {getCoverDownloadSrc} from './util'

const router = express.Router()

router
  .get('/', function (req, res) {
    res.locals.req = req
    res.locals.pageName = 'index'
    res.locals.query = ''
    res.locals.site = req.cookies.site
    res.locals.title = 'Holly Quintet'

    res.render('index')
  })
  .get('/search', async function(req, res) {
    let {query, site = req.cookies.site} = req.query

    const trimmedQuery = query.replace(/ +(?= )/g,'')
    if (query !== trimmedQuery) {
      const parsed = url.parse(req.path, true)
      parsed.search = null
      parsed.query.query = trimmedQuery
      const redirectUrl = url.format(parsed)
      res.redirect(redirectUrl)
    }

    const requestOptions = {
      baseUrl: 'https://www.google.com',
      url: '/search',
      qs: {
        tbm: 'isch',
        gws_rd: 'cr', // get rid of our request being redirected by country
        q: `${trimmedQuery} site:${site}`
      },
      headers: {
        'user-agent': req.get('user-agent')
      },
      agentClass: Agent
    }

    let albums
    try {
      albums = await chowdown(requestOptions).collection('.rg_el .rg_meta', chowdown.query.string())
      albums = albums.map(JSON.parse)
    } catch (e) {
      console.error(e)
    }
    res.locals.req = req
    res.locals.pageName = 'search'
    res.locals.query = trimmedQuery
    res.locals.site = site
    res.locals.albums = albums
    res.locals.title = 'Holly Quintet'
    res.locals.getCoverDownloadSrc = getCoverDownloadSrc

    res.render('search')
  })
  .get('/file', async function(req, res) {
    request(req.query.url)
      .on('response', function(remoteRes) {
        delete remoteRes.headers['content-disposition']
        res.attachment(req.query.filename)
      })
      .pipe(res)
  })

export default router

import express from 'express'
import chowdown from 'chowdown'
import Agent from 'socks5-https-client/lib/Agent'

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
    const {query, site = req.cookies.site} = req.query
    const requestOptions = {
      baseUrl: 'https://www.google.com',
      url: '/search',
      qs: {
        tbm: 'isch',
        gws_rd: 'cr', // get rid of our request being redirected by country
        q: `${query} site:${site}`
      },
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.117 Safari/537.36'
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
    res.locals.query = query
    res.locals.site = site
    res.locals.albums = albums
    res.locals.title = 'Holly Quintet'

    res.render('search')
  })

export default router

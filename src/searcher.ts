import LRU from 'lru-cache'
import request from 'request'
import chowdown from 'chowdown'
import Agent from 'socks5-https-client/lib/Agent'

const cache = new LRU({max: 500})
const baseRequestOptions: request.Options  = {
  baseUrl: 'https://www.google.com',
  uri: '/search',
  qs: {
    hl: 'zh-CN',
    tbm: 'isch',
    gws_rd: 'cr' // get rid of our request being redirected by country
  },
  timeout: 3000,
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.62 Safari/537.36'
  }
}
if (process.env.NODE_ENV !== 'production') {
  baseRequestOptions.agentClass = Agent
}

export default class Searcher {
  static getCacheKey (site: string, query: string) {
    return JSON.stringify({site, query})
  }

  static async searchRemote (site: string, query: string) {
    const requestOptions: request.Options = {
      ...baseRequestOptions,
      qs: {
        ...baseRequestOptions.qs,
        q: `site:${site} ${query}`
      }
    }

    let html: string[] = await chowdown(requestOptions).collection('.rg_el .rg_meta', chowdown.query.string())
    const albums: {ou: string; pt: string; ru: string}[] = html.map((a) => JSON.parse(a))

    const cacheKey = Searcher.getCacheKey(site, query)
    cache.set(cacheKey, albums)
    return albums
  }

  static async search (site: string, query: string) {
    const cacheKey = Searcher.getCacheKey(site, query)
    let albums = cache.get(cacheKey) as {ou: string; pt: string; ru: string}[]
    if (!albums) {
      albums = await Searcher.searchRemote(site, query)
    }
    return albums
  }
}

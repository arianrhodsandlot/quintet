import { selectAll } from 'css-select'
import { parseDocument } from 'htmlparser2'
import { LRUCache } from 'lru-cache'

const cache = new LRUCache({ max: 500 })
const baseSearchUrl = 'https://www.google.com/search'
const fakeUserAgent =
  'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Mobile Safari/537.36'
const params = {
  // this param means image search
  tbm: 'isch',
  // get rid of our request being redirected by country
  gws_rd: 'cr',
}
const headers = {
  'user-agent': fakeUserAgent,
}

function getCacheKey(site: string, query: string) {
  return JSON.stringify({ site, query })
}

async function searchRemote(site: string, query: string) {
  const q = `site:${site} ${query}`
  const searchUrl = `${baseSearchUrl}?${new URLSearchParams({ ...params, q })}`

  const response = await fetch(searchUrl, {
    headers,
  })
  const html = await response.text()

  const dom = parseDocument(html)
  const nodes = selectAll('.islrtb', dom).slice(0, 9)
  const result = nodes.map((node: any) => ({
    src: node.attribs['data-ou'],
    refer: node.attribs['data-ru'],
    title: node.attribs['data-pt'],
  }))

  const cacheKey = getCacheKey(site, query)
  cache.set(cacheKey, result)
  return result
}

export async function search(site: string, query: string) {
  type Result = Awaited<ReturnType<typeof searchRemote>>
  const cacheKey = getCacheKey(site, query)
  let result = cache.get(cacheKey) as Result
  if (!result) {
    result = await searchRemote(site, query)
  }
  return await searchRemote(site, query)
}

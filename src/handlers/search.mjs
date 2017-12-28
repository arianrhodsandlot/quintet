import find from 'lodash/find'
import Boom from 'boom'
import sites from '../consts/sites'
import scope2site from '../utils/scope2site'
import searchCovers from '../utils/search-covers'

export default async function search (request, h) {
  let {q: query, s: siteId} = request.query

  query = query.trim()
  siteId = siteId.trim()

  if (!query) throw Boom.badRequest()

  const matchedSite = find(sites, {id: siteId})
  if (!matchedSite) throw Boom.badRequest()

  return h.view('search', {
    sites,
    matchedSite,
    query,
    results: await searchCovers(matchedSite, query)
  })
}

import scope2site from '../utils/scope2site'
import searchCovers from '../utils/search-covers'

export default async function search (request, h) {
  const {q: query, s: scope} = request.params
  const site = scope2site(scope)
  const covers = await searchCovers(site, query)
  return h.view('search', {covers})
}

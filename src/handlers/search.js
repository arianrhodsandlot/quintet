const scope2site = require('../utils/scope2site')
const searchCovers = require('../utils/search-covers')
module.exports = async function (request, h) {
  const {q: query, s: scope} = request.params
  const site = scope2site(scope)
  const covers = await searchCovers(site, query)
  return h.view('search', {covers})
}

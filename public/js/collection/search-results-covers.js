import Cover from '../model/cover'

let SearchResultsCovers = Backbone.Collection.extend({
  model: Cover,
  url: '/api/covers'
})

module.exports = SearchResultsCovers

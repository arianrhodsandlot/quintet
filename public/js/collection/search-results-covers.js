import Cover from '../model/cover'

const SearchResultsCovers = Backbone.Collection.extend({
  model: Cover,
  url: '/api/covers'
})

export default SearchResultsCovers

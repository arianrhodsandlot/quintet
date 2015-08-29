import Cover from '../model/cover'

let SearchResultsCovers = Backbone.Collection.extend({
  model: Cover,
  url: '/api/covers',

  initialize: function(models, options) {
    this.fetch = _.bind(this.fetch, this, options)
  }
})

module.exports = SearchResultsCovers

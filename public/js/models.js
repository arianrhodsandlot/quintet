var SearchHistory = Backbone.Model.extend({
  defaults: {
    query: '',
    scope: '',
    bestResult: null
  }
})

var SearchHistories = Backbone.Model.extend({
  model: SearchHistory
})

var Cover = Backbone.Model.extend({
  defaults: {
    originTitle: '',
    title: '',
    refer: '',
    cover: {},
    starred: false
  },

  hasFullSize: function() {
    return this.cover.originSrc && this.cover.originSrc !== this.cover.src
  },

  star: function() {
    return this.set('starred', _.now());
  }
})

var SearchResultsCovers = Backbone.Collection.extend({
  model: Cover
})

var StarredCovers = Backbone.Collection.extend({
  model: Cover,
  comparator: 'starred'
})

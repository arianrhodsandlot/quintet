let SearchResultsCoversItem = Mn.ItemView.extend({
  template: '#search-results-covers-template',
  ui: {
    cover: '.cover-link',
  },
  events: {
    'click @ui.cover': 'preview'
  },
  collectionEvents: {
    request: 'loading',
    sync: 'render'
  },

  initialize() {
    this.collection.fetch()
  },

  loading() {
    console.log('loading')
  }
})

module.exports = SearchResultsCoversItem

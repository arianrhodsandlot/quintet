let StarredCoversItem = Mn.ItemView.extend({
  el: '#starred-results-covers',
  template: '#search-results-covers-template',
  ui: {
    cover: '.cover-link',
  },
  events: {
    'click @ui.cover': 'preview'
  }
})

module.exports = StarredCoversItem

let SearchResultsCoverView = Mn.ItemView.extend({
  className: 'cover',
  template: '#search-results-cover-template',
  ui: {
    cover: '.cover-link',
  },
  events: {
    'click @ui.cover': 'preview'
  },

  preview(e) {
    e.preventDefault()
    alert('clicked!')
  }
})

export default SearchResultsCoverView

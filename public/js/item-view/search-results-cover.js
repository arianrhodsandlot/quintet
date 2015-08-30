const SearchResultsCoverView = Mn.ItemView.extend({
  className: 'cover',
  template: '#cover-template',
  ui: {
    cover: '.cover-link',
  },
  events: {
    'click @ui.cover': 'preview'
  },

  preview(e) {
    //to do
  }
})

export default SearchResultsCoverView

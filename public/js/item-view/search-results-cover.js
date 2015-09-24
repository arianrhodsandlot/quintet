const SearchResultsCoverView = Mn.ItemView.extend({
  className: 'cover',
  template: '#cover-template',
  ui: {
    download: '.fa-download',
  },
  events: {
    'click @ui.download': 'download',
    'mousemove @ui.download': 'reset'
  },

  download(e) {
    this.ui.download.addClass('downloading')
  },

  reset() {
    this.ui.download.removeClass('downloading')
  }
})

export default SearchResultsCoverView

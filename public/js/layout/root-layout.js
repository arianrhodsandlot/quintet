let RootLayout = Mn.LayoutView.extend({
  el: 'body',
  regions: {
    searchForm: '#search-form',
    searchResultsCovers: '#search-results-covers',
    starredCovers: '#starred-covers'
  }
})

module.exports = RootLayout

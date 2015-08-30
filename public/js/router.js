import app from './app'
import SearchResultsCovers from './collection/search-results-covers'
import SearchFormView from './item-view/search-form'
import SearchResultsCoversView from './collection-view/search-results-covers'
import LoadingView from './item-view/loading'

let controller = {
  _showSearchForm() {
    var searchFormView = app.layout
      .getRegion('searchForm')
      .currentView

    if (_.isUndefined(searchFormView)) {
      app.layout.showChildView('searchForm', new SearchFormView())
    }

    return this
  },

  home() {
    this._showSearchForm()

    app.layout
      .getRegion('searchForm')
      .currentView
      .sleep()
      .reset()
      .focus()

    app.layout
      .getRegion('searchResultsCovers')
      .empty()
  },

  search(query, scope) {
    this._showSearchForm()

    let searchFormRegion = app.layout.getRegion('searchForm')
    let isSleeping = searchFormRegion.currentView.isSleeping()

    searchFormRegion
      .currentView
      .set({
        query, scope
      })
      .wake()

    let searchResultsCovers = new SearchResultsCovers()
    let searchResultsCoversRegion = app.layout.getRegion('searchResultsCovers')

    searchResultsCovers
      .on('request', function() {
        searchResultsCoversRegion.show(new LoadingView());
      })
      .on('sync', function() {
        let searchResultsCoversView = new SearchResultsCoversView({
          collection: searchResultsCovers
        })

        let show = _.bind(
          searchResultsCoversRegion.show,
          searchResultsCoversRegion,
          searchResultsCoversView
        )

        _.identity(isSleeping ? _.defer : _.attempt)(show)
      })
      .fetch({
        data: {
          query, scope
        }
      })
  }
}

let appRoutes = {
  '': 'home',
  'covers(?query=:query&scope=:scope)': 'search'
}

let Router = Mn.AppRouter.extend({
  controller, appRoutes
})

export default Router

import app from './app'
import SearchResultsCovers from './collection/search-results-covers'
import QueryCache from './model/query-cache'
import QueryCaches from './collection/query-caches'
import SearchFormView from './item-view/search-form'
import SearchResultsCoversView from './collection-view/search-results-covers'
import LoadingView from './item-view/loading'


const queryCaches = new QueryCaches(
  JSON.parse(localStorage.getItem('queryCaches')) ||
  []
)

const controller = {
  _showSearchForm() {
    const searchFormView = app.layout
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

    const searchFormRegion = app.layout.getRegion('searchForm')
    const isSleeping = searchFormRegion.currentView.isSleeping()

    searchFormRegion
      .currentView
      .set({
        query, scope
      })
      .wake()

    const searchResultsCovers = new SearchResultsCovers()
    const searchResultsCoversRegion = app.layout.getRegion('searchResultsCovers')

    const queryCache = queryCaches.findWhere({query,scope})

    const showCovers2Region = () => {
      const searchResultsCoversView = new SearchResultsCoversView({
        collection: searchResultsCovers
      })

      const show = _.bind(
        searchResultsCoversRegion.show,
        searchResultsCoversRegion,
        searchResultsCoversView
      )

      _.identity(isSleeping ? _.defer : _.attempt)(show)
    }

    if (!_.isEmpty(queryCache)) {
      searchResultsCovers.add(queryCache.get('covers'))
      showCovers2Region()
      alert('from cache')
      return
    } else {
      searchResultsCovers
        .on('request', () => {
          searchResultsCoversRegion.show(new LoadingView());
        })
        .on('sync', showCovers2Region)
        .fetch({
          data: {
            query, scope
          }
        })
        .done((covers) => {
          const queryCache = new QueryCache({
            query, scope, covers
          })

          queryCaches.add([queryCache])

          localStorage.setItem('queryCaches', JSON.stringify(queryCaches))
          alert('no res')
        })
    }
  }
}

const appRoutes = {
  '': 'home',
  'covers(?query=:query&scope=:scope)': 'search'
}

const Router = Mn.AppRouter.extend({
  controller, appRoutes
})

export default Router

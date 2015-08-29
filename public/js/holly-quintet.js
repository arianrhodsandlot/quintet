/*global _, Backbone, Mn */

var app = new Mn.Application()

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
  model: Cover,
  url: '/api/covers',

  initialize: function(models, options) {
    this.fetch = _.bind(this.fetch, this, options)
  }
})

$(function() {

  var RootLayout = Mn.LayoutView.extend({
    el: 'body',
    regions: {
      searchForm: '#search-form',
      searchResultsCovers: '#search-results-covers',
      starredCovers: '#starred-covers'
    }
  })

  var SearchFormItem = Mn.ItemView.extend({
    template: '#search-form-template',
    ui: {
      logo: '.logo',
      form: 'form',
      query: '.query'
    },
    events: {
      'click @ui.logo': 'home',
      'submit @ui.form': 'search'
    },

    home: function(e) {
      e.preventDefault()
      app.trigger('navigate', this.ui.logo.attr('href'))
    },

    search: function(e) {
      this.ui.query.val(_.trim(this.ui.query.val().replace(/\s+/g, ' ')))

      if (this.ui.query.val()) {
        e.preventDefault();

        var fragment = this.ui.form.attr('action') +
          '?' +
          this.ui.form.serialize()

        app.trigger('navigate', fragment)
      } else {
        this.home(e)
      }
    }
  })

  var SearchResultsCoversItem = Mn.ItemView.extend({
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

    initialize: function(){
      this.collection.fetch()
    },

    loading: function(){
      console.log('loading')
    }
  })

  var StarredCoversItem = Mn.ItemView.extend({
    el: '#starred-results-covers',
    template: '#search-results-covers-template',
    ui: {
      cover: '.cover-link',
    },
    events: {
      'click @ui.cover': 'preview'
    }
  })

  var Router = Mn.AppRouter.extend({
    appRoutes: {
      '': 'home',
      'covers(?query=:query&scope=:scope)': 'search',
      'covers(?filter=:filter)': 'starred'
    }
  })

  app
    .on('navigate', _.bind(
      _.partial(
        Backbone.history.navigate, _, {
          trigger: true
        }
      ),
      Backbone.history
    ))
    .on('before:start', function() {
      app.layout = new RootLayout();
    })
    .on('start', function() {
      app.router = new Router({
        controller: {
          _showSearchForm: function() {
            var searchFormItem = app.layout
              .getRegion('searchForm')
              .currentView

            if (_.isUndefined(searchFormItem)) {
              app.layout
                .getRegion('searchForm')
                .show(new SearchFormItem())
            }

            return this;
          },

          home: function() {
            this._showSearchForm()

            app.layout
              .getRegion('searchResultsCovers')
              .empty()
          },

          search: function(query, scope) {
            this._showSearchForm()

            app.layout
              .getRegion('searchResultsCovers')
              .show(new SearchResultsCoversItem({
                collection: new SearchResultsCovers([], {
                  data: {
                    query: query,
                    scope: scope
                  }
                })
              }));
          },

          starred: function(filter) {
            if (filter !== 'starred') {
              return;
            }

            app.layout
              .getRegion('starredCovers')
              .show(new StarredCoversItem());
          }
        }
      })
    })
    .on('start', _.bind(
      Backbone.history.start,
      Backbone.history, {
        pushState: true
      }
    ))
    .start()
  window.app = app
})

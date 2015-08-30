import app from './app'
import Layout from './layout/layout'
import Router from './router'

window.app = app
  .on('navigate', _.bind(
    _.partial(
      Backbone.history.navigate, _, {
        trigger: true
      }
    ),
    Backbone.history
  ))
  .on('before:start', function() {
    _.assign(app, {
      layout: new Layout(),
      router: new Router()
    })
  })
  .on('start', _.bind(
    Backbone.history.start,
    Backbone.history, {
      pushState: true
    }
  ))

$(_.bind(app.start, app))

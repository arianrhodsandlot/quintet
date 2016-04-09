import app from './app'
import Layout from './layout'
import Router from './router'

app
  .on('navigate', function (fragment) {
    Backbone.history.navigate(fragment, {trigger: true})
  })
  .on('navigate', function () {
    if (window.ga) window.ga('send', 'pageview')
  })
  .on('before:start', function () {
    app.layout = new Layout()
    app.router = new Router()
  })
  .on('start', _.bind(
    Backbone.history.start,
    Backbone.history, {
      pushState: true
    }
  ))

$(_.bind(app.start, app))

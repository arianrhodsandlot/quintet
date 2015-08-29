import app from './app'
import RootLayout from './layout/root-layout'
import Router from './router'

$(() => {
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
      _.assign(app, {
        layout: new RootLayout(),
        router: new Router()
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

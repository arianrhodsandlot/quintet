import app from './app'
import Layout from './layout'
import Router from './router'

app
  .on('navigate', _.bind(
    _.partial(
      Backbone.history.navigate, _, {
        trigger: true
      }
    ),
    Backbone.history
  ))
  .on('navigate', () => _.attempt(() => ga('send', 'pageview')))
  .on('before:start', () => {
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

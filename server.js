const Glue = require('glue')
const {manifest, route, serve} = require('.')

Glue.compose(manifest, {
  relativeTo: __dirname
}, function (err, server) {
  if (err) throw err
  route(server)
  serve(server)
})

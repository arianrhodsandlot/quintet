module.exports = function (request, h) {
  h.proxy({
    uri: request.query.url,
    timeout: 5000
  })
}

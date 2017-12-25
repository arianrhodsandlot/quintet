module.exports = function (request, h) {
  h.proxy({
    uri: request.query.u,
    timeout: 5000
  })
}

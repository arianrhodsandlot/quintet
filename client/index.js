module.exports = [{
  method: 'GET',
  path: '/',
  handler: {
    file: 'client/dist/index.html'
  }
}, {
  method: 'GET',
  path: '/covers',
  handler: {
    file: 'client/dist/index.html'
  }
}, {
  method: 'GET',
  path: '/dist/{file*}',
  handler: {
    directory: {
      path: 'client/dist/'
    }
  }
}]

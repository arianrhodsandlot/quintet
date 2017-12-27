export default function download (request, h) {
  h.proxy({
    uri: request.query.u,
    timeout: 5000
  })
}

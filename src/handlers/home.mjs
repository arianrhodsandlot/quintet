import sites from '../consts/sites'

export default function (request, h) {
  return h.view('home', {sites})
}

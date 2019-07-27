import Bundler from 'parcel-bundler'

const bundler = new Bundler('src/assets/entries/*', {
  scopeHoist: true
})

export default bundler

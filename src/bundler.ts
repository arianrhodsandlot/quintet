import Bundler from 'parcel-bundler'

const bundler = new Bundler('src/assets/entries/*', {
  scopeHoist: process.env.NODE_ENV === 'production'
})

export default bundler

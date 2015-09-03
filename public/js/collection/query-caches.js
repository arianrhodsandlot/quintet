import QueryCache from '../model/query-cache'

const QueryCaches = Backbone.Collection.extend({
  model: QueryCache,

  initialize() {
  	 return this.fetch()
  },

  fetch() {
  	return this.set(
  		JSON.parse(localStorage.getItem('queryCaches')) ||
    	[]
    )
  },

  save() {
  	localStorage.setItem('queryCaches', JSON.stringify(this))

  	return this
  }
})

export default QueryCaches

import controller from './controller'

const appRoutes = {
  '': 'home',
  'covers(?query=:query&scope=:scope)': 'search'
}

const Router = Mn.AppRouter.extend({
  controller, appRoutes
})

export default Router

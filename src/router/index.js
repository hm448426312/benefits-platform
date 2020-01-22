import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = [
  {
    path: '/',
    name: 'demo',
    component: (resolve) => require(['@/pages/Demo'], resolve)
  }
]
export default new Router({
  mode: 'history',
  routes: router
})

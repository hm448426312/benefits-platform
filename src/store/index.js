import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  menu: [],
  userInfo: null
}
const actions = {
}
const mutations = {
  setMenu (state, menu) {
    state.menu = menu
  },
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  }
}
const getters = {
  menu: state => state.menu,
  userInfo: state => state.userInfo
}
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})

export default store

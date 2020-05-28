import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
  },
  getters:{
    userInfo: state => {
      return state.userInfo
    },
  },
  mutations: {
    setUserInfo(state, value) {
      state.userInfo = value
    },
  },
  actions: {
  },
  modules: {
  }
})

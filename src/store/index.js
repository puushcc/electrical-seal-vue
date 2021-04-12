import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: ''  ,
    isCollapse: ''
  },
  getters: {
    getAccount: state => {
      return state.account
    },
    getIsCollapse: state => {
      return state.isCollapse
    },
    

},
  mutations: {
    SET_ACCOUNT: (state, account) => {
      state.account = account
    },
    SET_ISCOLLAPSE: (state, isCollapse) => {
      state.isCollapse = isCollapse
    }
  },
  actions: {
  },
  modules: {
  }
})

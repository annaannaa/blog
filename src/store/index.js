import state from './state'
import Vuex from 'vuex'
import Vue from 'vue'
import mutations from './mutations'
Vue.use(Vuex)
export default new Vuex.Store({
  state,
  mutations
})

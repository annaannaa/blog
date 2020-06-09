const SHOW_LOADING = 'SHOW_LOADING'
const HIDE_LOADING = 'HIDE_LOADING'

const state = {
  status: false
}

const mutations = {
  [SHOW_LOADING] (state) {
    state.status = true
  },
  [HIDE_LOADING] (state) {
    state.status = false
  }
}


const actions = {
  showLoading: ({ commit }) => {
    commit(SHOW_LOADING);
  },

  hideLoading: ({ commit }) => {
    commit(HIDE_LOADING);
  }
}


export default {
  namespaced: true,
  state,
  mutations,
  actions

}
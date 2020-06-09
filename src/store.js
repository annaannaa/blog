import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// 引入login 模块
import loading from "./components/loading/index"

export default new Vuex.Store({
  // 通过modules属性引入login 模块。
  modules: {
    loading: loading
  }
})
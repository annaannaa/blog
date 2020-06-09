// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import API from './API'
import './assets/baseCss.css'
import './assets/theme/dayTheme/index.css'
import './assets/theme/nightTheme/index.css'
// import '../element-variables.scss'
import ElementUI from 'element-ui'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'font-awesome/css/font-awesome.css'

import mockdata from './mock'
Vue.use(VueQuillEditor);
Vue.use(ElementUI)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.prototype.$API = API
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

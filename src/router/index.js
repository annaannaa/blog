import Vue from 'vue'
import Router from 'vue-router'
import mainHome from '@/mainHome/index'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: mainHome
  },
  {
    path: '/login',
    component: () => import(`@/login/index`)
  }
  ]
})

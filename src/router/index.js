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
    name: 'login',
    component: () => import(`@/login/index`)
  },
  {
    path: '/writeBlog',
    name: 'writeBlog',
    component: () => import(`@/writeBlog/index`)
  },
  {
    path: '/searchBlog',
    name: 'searchBlog',
    component: () => import(`@/searchBlog/index`)
  },
  {
    path: '/blogInfo',
    name: 'blogInfo',
    component: () => import(`@/blogInfo/index`)
  },
  {
    path: '/mine',
    name: 'mine',
    component: () => import(`@/mine/index`)
  },
  {
    path: '/test',

    component: () => import(`@/test`)
  }
  ]
})

import Vue from 'vue'
import VueRouter from 'vue-router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueAnalytics from 'vue-analytics'
Vue.use(VueAnalytics, {
  id: 'UA-177594854-1',
  router
})
import viewSlnavi from '@/views/ViewSlnavi'
// import viewAbout from '@/views/ViewAbout'
// import viewCreateEvent from '@/views/ViewCreateEvent'
// viewEventは負荷軽減のためクリック時に呼び出す

Vue.use(BootstrapVue) // added
Vue.use(IconsPlugin)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'viewSlnavi-kenzen',
    component: viewSlnavi,
    props: { mode: 'k' }
  },
  {
    path: '/adult',
    name: 'viewSlnavi-adult',
    component: viewSlnavi,
    props: { mode: 'e' }
  },
  {
    path: '/all',
    name: 'viewSlnavi-all',
    component: viewSlnavi,
    props: { mode: 'c' }
  },
  {
    path: '/search/:searchword',
    name: 'viewSlnavi-search',
    component: viewSlnavi,
    props: { mode: 'c' }
  },
  {
    path: '/event',
    name: 'viewEvent',
    component: () => import(/* webpackChunkName: "viewEvent" */ '@/views/ViewEvent.vue')
    // component: viewEvent,
  },
  {
    path: '/createEvent',
    name: 'viewCreateEvent',
    component: () => import(/* webpackChunkName: "viewCreateEvent" */ '@/views/ViewCreateEvent.vue')
    //component: viewCreateEvent
  },
  {
    path: '/about',
    name: 'viewAbout',
    component: () => import(/* webpackChunkName: "viewAbout" */ '@/views/ViewAbout.vue')
    // component: viewAbout
  },
]

const router = new VueRouter({
  routes
})

export default router

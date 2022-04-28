import Vue from 'vue'
import VueRouter from 'vue-router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
/*
import VueAnalytics from 'vue-analytics'
*/
import VueGtm from 'vue-gtm'
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
    path: '/event/:eid',
    name: 'viewEventDirect',
    component: () => import(/* webpackChunkName: "viewEvent" */ '@/views/ViewEvent.vue')
    // component: viewEvent,
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
    // component: viewCreateEvent
  },
  {
    path: '/createEvent/:logincode',
    name: 'viewCreateEventLogin',
    component: () => import(/* webpackChunkName: "viewCreateEvent" */ '@/views/ViewCreateEvent.vue')
    // component: viewCreateEvent
  },
  {
    path: '/updateEvent/:eid',
    name: 'updateEvent',
    component: () => import(/* webpackChunkName: "viewCreateEvent" */ '@/views/ViewCreateEvent.vue')
    // component: viewCreateEvent
  },
  {
    path: '/job',
    name: 'viewJob',
    component: () => import(/* webpackChunkName: "viewJob" */ '@/views/ViewJob.vue')
    // component: viewJob
  },
  {
    path: '/gift',
    name: 'viewGift',
    component: () => import(/* webpackChunkName: "viewAbout" */ '@/views/ViewGift.vue')
    // component: viewAbout
  },
  {
    path: '/about',
    name: 'viewAbout',
    component: () => import(/* webpackChunkName: "viewAbout" */ '@/views/ViewAbout.vue')
    // component: viewAbout
  },
  {
    path: '/analytics/:flag',
    name: 'viewAnalytics',
    component: () => import(/* webpackChunkName: "viewAnalytics" */ '@/views/ViewAnalytics.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
})
/*
Vue.use(VueAnalytics, {
  id: 'UA-177594854-1',
  router
})
*/

Vue.use(VueGtm, {
  id: 'G-RV9WMZV704'
})

export default router


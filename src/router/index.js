import Vue from 'vue'
import VueRouter from 'vue-router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import viewAbout from '@/views/ViewAbout'
import viewSlnavi from '@/views/ViewSlnavi'
// import viewCreateEvent from '@/views/ViewCreateEvent'
// viewEventは負荷軽減のためクリック時に呼び出す

Vue.use(BootstrapVue) // added
Vue.use(IconsPlugin)
Vue.use(VueRouter)

const routes = [
  {
    path: '/about',
    name: 'viewAbout',
    component: viewAbout
  },
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
    path: '/search/:searchword',
    name: 'viewSlnavi-search',
    component: viewSlnavi,
    props: { mode: 'c' }
  },
]

const router = new VueRouter({
  routes
})

export default router

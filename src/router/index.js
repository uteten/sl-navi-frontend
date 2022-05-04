import Vue from 'vue'
import VueRouter from 'vue-router'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueAnalytics from 'vue-analytics'
import VueGtm from '@gtm-support/vue2-gtm'
import viewSlnavi from '@/views/ViewSlnavi'
// import viewAbout from '@/views/ViewAbout'
// import viewCreateEvent from '@/views/ViewCreateEvent'
// viewEventは負荷軽減のためクリック時に呼び出す

Vue.use(BootstrapVue) // added
Vue.use(IconsPlugin)
Vue.use(VueRouter)
const BASE_TITLE = 'SL-Navi | '
const DEFAULT_ADD_TITLE = 'セカンドライフの日本人向けリンク集'

const routes = [
  {
    path: '/',
    name: 'viewSlnavi-kenzen',
    component: viewSlnavi,
    props: { mode: 'k' }
  },
  {
    path: '/kenzen/:tagid',
    name: 'viewSlnavi-kenzen-tag',
    component: viewSlnavi,
    props: { mode: 'k' }
  },
  {
    path: '/adult',
    name: 'viewSlnavi-adult',
    component: viewSlnavi,
    props: { mode: 'e' },
    meta: { title: 'セカンドライフの日本人向けアダルト施設' }
  },
  {
    path: '/adult/:tagid',
    name: 'viewSlnavi-adult-tag',
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
    path: '/all/:tagid',
    name: 'viewSlnavi-all-tag',
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
    component: () => import(/* webpackChunkName: "viewEvent" */ '@/views/ViewEvent.vue'),
    meta: { title: 'セカンドライフの日本人向けイベント情報' }
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
    path: '/editShop',
    name: 'viewEditShop',
    component: () => import(/* webpackChunkName: "viewEditShop" */ '@/views/ViewEditShop.vue')
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
    component: () => import(/* webpackChunkName: "viewAbout" */ '@/views/ViewGift.vue'),
    meta: { title: 'セカンドライフのギフト情報' }
    // component: viewAbout
  },
  {
    path: '/about',
    name: 'viewAbout',
    component: () => import(/* webpackChunkName: "viewAbout" */ '@/views/ViewAbout.vue'),
    meta: { title: 'このサイトの説明' }
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
router.afterEach((to, from) => {
  if (to.path.match(/\/[0-9]/)) {
    return
  } else if (to.meta.title) {
    document.title = BASE_TITLE + to.meta.title
  } else {
    document.title = BASE_TITLE + DEFAULT_ADD_TITLE
  }
})

Vue.use(VueAnalytics, {
  id: 'UA-177594854-1',
  router
})

Vue.use(VueGtm, {
  id: 'GTM-WMCN78F',
  enabled: true,
  debug: false,
  loadScript: true,
  vueRouter: router
})

export default router


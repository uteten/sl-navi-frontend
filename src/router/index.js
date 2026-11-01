import { createRouter, createWebHistory } from 'vue-router'
import viewSlnavi from '@/views/ViewSlnavi.vue'
// viewEventは負荷軽減のためクリック時に呼び出す

const BASE_TITLE = 'SL-Navi | '
const DEFAULT_ADD_TITLE = 'セカンドライフの日本人向けポータルサイト'

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
    component: () => import('@/views/ViewEvent.vue')
    // component: viewEvent,
  },
  {
    path: '/event',
    name: 'viewEvent',
    component: () => import('@/views/ViewEvent.vue'),
    meta: { title: 'セカンドライフの日本人向けイベント情報' }
    // component: viewEvent,
  },
  {
    path: '/createEvent',
    name: 'viewCreateEvent',
    component: () => import('@/views/ViewCreateEvent.vue'),
    meta: { title: 'イベント登録' }
    // component: viewCreateEvent
  },
  {
    path: '/createEvent/:logincode',
    name: 'viewCreateEventLogin',
    component: () => import('@/views/ViewCreateEvent.vue')
    // component: viewCreateEvent
  },
  {
    path: '/updateEvent/:eid',
    name: 'updateEvent',
    component: () => import('@/views/ViewCreateEvent.vue')
    // component: viewCreateEvent
  },
  {
    path: '/gift',
    name: 'viewGift',
    component: () => import('@/views/ViewGift.vue'),
    meta: { title: 'セカンドライフのギフト情報' }
    // component: viewAbout
  },
  {
    path: '/about',
    name: 'viewAbout',
    component: () => import('@/views/ViewAbout.vue'),
    meta: { title: 'このサイトの説明' }
    // component: viewAbout
  }
]

// ルートはバックエンドが index.html を返すパス (SPA_PATHS) の範囲に限る (R2.2)。
// base は静的ファイルの配信元 (static.sl-navi.com) なので、履歴の base には使わない。
const router = createRouter({
  history: createWebHistory('/'),
  routes
})

router.afterEach((to) => {
  if (to.path.match(/\/[0-9]/)) {
    return
  } else if (to.meta.title) {
    document.title = BASE_TITLE + to.meta.title
  } else {
    document.title = BASE_TITLE + DEFAULT_ADD_TITLE
  }
})

export default router

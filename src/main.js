import { createApp } from 'vue'
import { createHead } from '@unhead/vue/client'
import { createGtm } from '@gtm-support/vue-gtm'
import { BBadge, BCollapse, BModal, BNavbarToggle, BPopover, createBootstrap } from 'bootstrap-vue-next'
import VueCookies from 'vue-cookies'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import App from './App.vue'
import router from './router/index.js'
import gv from './mixins/globalValiables.js'
import SetInterval from './plugins/SetInterval/index.js'
import AdsenseUnit from './components/AdsenseUnit.vue'

const app = createApp(App)

app.mixin(gv)
app.use(router)
app.use(createHead())
app.use(createBootstrap())
app.use(VueCookies)
app.use(SetInterval)
app.use(createGtm({
  id: 'GTM-TGJQ98FP',
  enabled: true,
  debug: false,
  loadScript: true,
  vueRouter: router
}))

// テンプレートで使う bootstrap-vue-next の部品と広告枠 (design D3、D4)
app.component('BBadge', BBadge)
app.component('BCollapse', BCollapse)
app.component('BModal', BModal)
app.component('BNavbarToggle', BNavbarToggle)
app.component('BPopover', BPopover)
app.component('AdsenseUnit', AdsenseUnit)

app.mount('#app')

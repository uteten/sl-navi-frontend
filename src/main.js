import Vue from 'vue'
import App from './App.vue'

import router from './router'
import SetInterval from '@/plugins/SetInterval'

import Ads from 'vue-google-adsense'

Vue.use(require('vue-script2'))
Vue.use(Ads.Adsense)
Vue.use(Ads.InArticleAdsense)
Vue.use(Ads.InFeedAdsense)

Vue.use(SetInterval)

Vue.config.productionTip = false

Vue.filter('capitalize', function (val) {
  return val ? val.toUpperCase() : ''
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

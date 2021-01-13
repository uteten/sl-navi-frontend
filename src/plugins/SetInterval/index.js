export default {
  install (vue) {
    vue.prototype.$intervals = []
    vue.prototype.$setInterval = (func, intervalMilliSec) => {
      if (typeof (process.env.VUE_APP_DISABLE_SET_INTERVAL) !== 'undefined') {
        console.log(`[DISABLE_SET_INTERVAL] Check environment vars`)
        return null
      }
      const id = setInterval(() => {
        if (document.visibilityState === 'visible') {
          func()
        }
      }, intervalMilliSec)
      vue.prototype.$intervals.push(id)
      return id
    }
    vue.prototype.$clearInterval = (id) => {
      clearInterval(id)
      vue.prototype.$intervals = vue.prototype.$intervals.filter(i => i !== id)
    }
    vue.prototype.$clearAllIntervals = () => {
      vue.prototype.$intervals.forEach(clearInterval)
      vue.prototype.$intervals = []
    }
  }
}
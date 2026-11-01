// 画面が見えているときだけ func を呼ぶ setInterval
export default {
  install (app) {
    const g = app.config.globalProperties
    g.$intervals = []
    g.$setInterval = (func, intervalMilliSec) => {
      if (typeof import.meta.env.VITE_DISABLE_SET_INTERVAL !== 'undefined') {
        console.log('[DISABLE_SET_INTERVAL] Check environment vars')
        return null
      }
      const id = setInterval(() => {
        if (document.visibilityState === 'visible') {
          func()
        }
      }, intervalMilliSec)
      g.$intervals.push(id)
      return id
    }
    g.$clearInterval = (id) => {
      clearInterval(id)
      g.$intervals = g.$intervals.filter(i => i !== id)
    }
    g.$clearAllIntervals = () => {
      g.$intervals.forEach(clearInterval)
      g.$intervals = []
    }
  }
}

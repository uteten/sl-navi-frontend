export default {
  methods: {
    text2html (z) {
      const urlPattern = /(https?:\/\/[^ \r\n]+)/g
      return z.replace(urlPattern, '<a target="_blank" href="$1">$1</a>').replace(/\n/g, '<br>')
    },
    nitiji2: function (str) {
      return str.replace(/:00$/, '').replace('T', ' ')
    },
    nitiji: function (str) {
      return str.replace(/:00$/, '').replace('T', ' ').replace(/202[0-9]-/, '').replace('-', '/').replace(/^0/, '').replace(/\/0/, '/')
    },
    tukihi: function (str) {
      return str.replace(/T.*/, '').replace(/-/g, '/')
    },
    escapeHtml: function (tmp) {
      if (typeof tmp !== 'string') {
        return tmp
      }
      tmp = tmp.replace(/[&'`"<>]/g, function (match) {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;'
        }[match]
      })
      const imgPattern = /(https?:\/\/)(.*)(png|gif|jpg|jpeg)([a-zA-Z0-9.\-&=;%$]*)/gi
      const urlPattern = /([^"])(https?:\/\/[^ )\r\n]+)/g
      tmp = tmp.replace(imgPattern, '<img width="400" src="$1$2$3">')
      tmp = tmp.replace(urlPattern, '$1<a target="_blank" href="$2">$2</a>')
      return tmp.replace(/\n/g, '<br>')
    },
    twitterUrl: function (event) {
      const url = encodeURIComponent('https://sl-navi.com/event/' + event.id)
      const txt = encodeURIComponent(event.title)
      return 'https://twitter.com/intent/tweet?text=' + txt + '&hashtags=slnavi&url=' + url
    },
    // 共有ボタンのリンク先。vue-social-sharing (Vue 2 専用) と同じ共有 URL を作る (design D3)
    shareUrl (network, url, title) {
      const u = encodeURIComponent(url)
      const t = encodeURIComponent(title || '')
      if (network === 'twitter') {
        return 'https://twitter.com/intent/tweet?text=' + t + '&url=' + u + '&hashtags=secondlife,sljp'
      }
      return 'https://www.facebook.com/sharer/sharer.php?u=' + u + '&title=' + t + '&hashtag=%23secondlife'
    },
    testa (num) {
      return "a"+num
    }
  }
}

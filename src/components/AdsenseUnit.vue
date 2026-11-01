<template>
  <div class="adswrapper">
    <ins
      ref="ins"
      class="adsbygoogle"
      :style="insStyle"
      :data-ad-client="dataAdClient"
      :data-ad-slot="dataAdSlot"
      :data-ad-format="dataAdFormat"
      :data-full-width-responsive="dataFullWidthResponsive === 'yes' ? 'true' : null"
    />
  </div>
</template>

<script>
// AdSense の広告枠。Google の貼り付けコード (<ins class="adsbygoogle"> と
// adsbygoogle.push({})) をそのまま描く。vue-google-adsense (Vue 2 専用) の
// <Adsense> と同じ HTML を出す (design D3)。
const ADS_SCRIPT = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'

function loadAdsScript () {
  if (document.querySelector(`script[src="${ADS_SCRIPT}"]`)) return
  const s = document.createElement('script')
  s.async = true
  s.src = ADS_SCRIPT
  document.head.appendChild(s)
}

export default {
  name: 'AdsenseUnit',
  props: {
    insStyle: { type: String, default: 'display:block;' },
    dataAdClient: { type: String, default: '' },
    dataAdSlot: { type: String, default: '' },
    dataAdFormat: { type: String, default: 'auto' },
    dataFullWidthResponsive: { type: String, default: 'no' }
  },
  mounted () {
    loadAdsScript()
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch (e) {
      console.log(['adsense', e])
    }
  }
}
</script>

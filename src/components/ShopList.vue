// INTERVAL_RELOAD_SHOP(秒)毎に SHOP_SOURCE を取得

<template>
  <div
    id="shops"
    class="col shops"
  >
    <div class="shop_top">
      施設
    </div>
    <div
      v-for="z in shops_s"
      :id="z.flag"
      :key="z.flag"
      class="f"
      tabindex="0"
    >
      <shop-element
        ref="appShopList"
        :z="z"
      />
    </div>
    <template v-if="shops_g.length>1">
      <Adsense
        id="ad2"
        key="ad2"
        tabindex="0"
        data-ad-client="ca-pub-7267369281211974"
        data-ad-slot="3986041962"
        ins-style="display:inline-block;margin:3px;position:relative;width:160px;height:160px;cursor: pointer;float:left"
        data-ad-format=""
        data-full-width-responsive="no"
      />
    </template>
    <div
      v-for="z in shops_g"
      :id="z.flag"
      :key="z.flag"
      class="f"
      tabindex="0"
    >
      <shop-element
        ref="appShopList"
        :z="z"
      />
    </div>

    <!--
    <iframe
      :src="'https://sl-navi.com/static/dmm-ad1.html?'+lastT"
      scrolling="no"
      marginwidth="0"
      frameborder="0"
      class="f"
    />
    -->
    <div v-if="!shops[0]">
      なし
    </div>
    <div class="counter text-muted">
      <span class="counter_ele">閲覧数：今日{{ countToday }}人</span>
      <span class="counter_ele">アバター検知数：1時間{{ countSensor1h }}人 / 1日{{ countSensor24h }}人</span>
      <span class="counter_ele">現在のログイン数：{{ countLogin }}人</span>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import ShopElement from '@/components/ShopElement'

Vue.prototype.$axios = axios

const INTERVAL_RELOAD_SHOP = 180
const SHOP_SOURCE = '//sl-navi.com/api/shop'
const ALOG_SOURCE = '//sl-navi.com/api/alog'
export default {
  name: 'ShopList',
  components: {
    ShopElement
  },
  filters: {
    'staff_url': function (value) {
      return '/d2p/' + value[0].replace(' ', '%20') + '?'
    },
    'staff_name': function (value) {
      return value[0]
    },
    'staff_sex': function (value) {
      if (value[1] === 0) {
        return 'female'
      } else if (value[1] === 1) {
        return 'male'
      } else {
        return
      }
    }
  },
  props: {
    'mode': {
      type: String,
      default: 'k'
    },
    'ad': {
      type: String,
      default: '0'
    }
  },
  data: function () {
    return {
      shops: [],
      shops_s: [],
      shops_g: [],
      cacheTagid: '',
      cacheMode: '',
      cacheSearch: '',
      playFlag: 0,
      playUrl: '',
      countSensor1h: '-',
      countSensor24h: '-',
      countYesterday: '-',
      countToday: '-',
      countLogin: '-',
      adindex: 0
    }
  },
  mounted () {
    const that = this
    this.$setInterval(() => {
      that.getShops(that.cacheMode, that.cacheTagid, that.cacheSearch)
    }, 1000 * INTERVAL_RELOAD_SHOP)
    this.getCounter()
    this.$setInterval(() => {
      that.getCounter()
    }, 1000 * 60)
  },
  methods: {
    async alog (flag, event) {
      await axios.post(ALOG_SOURCE, {
        flag: flag,
        event: event
      })
    },
    nowOpen: function (z) {
      if (!z.event) {
        return 0
      }
      let start = z.event.start
      let end = z.event.end
      // let now=this._formatDate(new Date(),'YYYY-MM-DDThh:mm:ss')
      const now = new Date()
      start = new Date(start)
      end = new Date(end)
      if (start < now && now < end) {
        if (end - start < 60 * 60 * 24 * 1000) {
          console.log(end - start)
          return 'short'
        } else {
          return 'long'
        }
      } else if (now < start) {
        return 'before'
      } else {
        return ''
      }
    },
    playRadio (url) {
      if (url === this.playUrl && this.playFlag === 1) {
        // 同じurlをクリックすると止まる
        this.playFlag = 0
        this.playUrl = ''
      } else {
        // 異なるurlは再生
        this.playFlag = 1
        this.playUrl = url
      }
      this.$emit('radio', this.playUrl)
    },
    _formatDate: function (date, format) {
      format = format.replace(/YYYY/g, date.getFullYear())
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
      format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
      return format
    },
    isNewShop (z) {
      const now = new Date()
      now.setDate(now.getDate() - 7)
      const oneWeek = this._formatDate(now, 'YYYY-MM-DDThh:mm:ss')
      // console.log([z.created_at,one_week])
      if (z.created_at > oneWeek) {
        return 1
      } else {
        return 0
      }
    },
    shopDescription (z) {
      const text = z.info
      const urlPattern = /(https?:\/\/[^ \r\n]+)/g
      return text.replace(urlPattern, '<a target="_blank" href="$1">$1</a>').replace(/\n/g, '<br>')
    },
    existBlog (z) {
      return (z.blog !== 'http://www.google.com' && z.blog.indexOf('http') === 0)
    },
    async getShops (m, tagid, search) {
      // console.log(['shoplist:getShop:axios', tagid, m, search])
      this.cacheMode = m
      this.cacheTagid = tagid
      this.cacheSearch = search
      await axios.get(SHOP_SOURCE, {
        params: {
          tagid: tagid,
          mode: m,
          search: search
        }
      }).then(res => {
        this.shops_s=[]
        this.shops_g=[]
        res.data.forEach((one) => {
          if( one.sn >0 ){
            this.shops_s.push(one)
          }else{
            this.shops_g.push(one)
          }
        })
        // console.log(['shoplist:getShop:then', this.shops])
      })
    },
    async getCounter () {
      await axios.get('https://sl-navi.com/static/counter2.json').then(res => {
        var j = res.data
        this.countSensor1h = j.countSensor1h
        this.countSensor24h = j.countSensor24h
        this.countToday = j.countToday
        this.countYesterday = j.countYesterday
        this.countLogin = j.countLogin
      })
    }

  }
}
</script>

<style scoped>
  .f{
    margin: 3px;
    position: relative;
    display: inline-block;
    width: 160px;
    height: 160px;
    cursor: pointer;
    float: left;
  }
  .shops{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 0;
  }
  .shop_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  hr{
    border:none;
    border-bottom: dashed 2px #ffb03f;
  }
  h4{
    color: #ffaa00;
    border-bottom: dashed 2px #ffb03f;
  }
  .counter{
    text-align: right;
    font-size: 85%;
    clear:both;
  }
  .counter_ele{
    margin-right:10px;
  }
</style>

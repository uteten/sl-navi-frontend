// INTERVAL_RELOAD_SHOP(秒)毎に SHOP_SOURCE を取得

<template>
  <div
    id="shops"
    class="col shops"
  >
    <div class="shop_header">
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
          v-on:addBadShop="addBadShop"
        :z="z"
      />
    </div>
    <template v-if="shop_count<25">
      <div
        v-for="z in shops_g"
        :id="z.flag"
        :key="z.flag"
        class="f"
        tabindex="0"
      >
        <shop-element
          ref="appShopList"
          v-on:addBadShop="addBadShop"
          :z="z"
        />
      </div>
    </template>
    <!--
    <template v-if="ad && shops_g.length>1">
      <Adsense
        id="ad2"
        key="ad2"
        tabindex="0"
        data-ad-client="ca-pub-7267369281211974"
        data-ad-slot="3986041962"
        ins-style="display:inline-block;padding:3px 0 0 3px;margin:3px;position:relative;width:160px;height:160px;cursor: pointer;float:left"
        data-ad-format=""
        data-full-width-responsive="no"
      />
    </template>
    -->
    <template v-if="shop_count>=25">
      <div
        v-for="z in shops_g"
        :id="z.flag"
        :key="z.flag"
        class="f"
        tabindex="0"
      >
        <shop-element
          ref="appShopList"
          v-on:addBadShop="addBadShop"
          :z="z"
        />
      </div>
    </template>
    <!--
    <iframe
      :src="'https://sl-navi.com/static/dmm-ad1.html?'+lastT"
      scrolling="no"
      marginwidth="0"
      frameborder="0"
      class="f"
    />
    -->
    <div v-if="!shops_s[0] && !shops_g[0]">
      なし
    </div>
    <div class="counter text-muted">
      <span class="clear_bad_shops" @click="clearBadShops">
        [<b-icon-trash scale="0.8" />
        非表示にした施設の再表示]
      </span>
      <!--
      <span class="counter_ele">閲覧数：今日{{ countToday }}人</span>
      -->
      <span class="counter_ele">アバター検知数：1時間{{ countSensor1h }}人 / 1日{{ countSensor24h }}人</span>
      <span class="counter_ele">現在のログイン数：{{ countLogin }}人</span>
    </div>

    <b-modal
      ref="my-modal"
      v-model="showModal"
      class="modal fade"
      size="lg"
      hide-header
      hide-footer
    >
      {{ trash_shop }} を非表示にしました。<br>再表示したい場合は、リストの下の
      「<b-icon-trash scale="1" class="trash_icon"/>非表示にした施設の再表示」を選択してください
    </b-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import ShopElement from '@/components/ShopElement'

Vue.prototype.$axios = axios

const INTERVAL_RELOAD_SHOP = 180
const SHOP_SOURCE = '//sl-navi.com/api/shop'
export default {
  name: 'ShopList',
  components: {
    ShopElement
  },
  props: {
    'mode': {
      type: String,
      default: 'k'
    },
    'ad': {
      type: String,
      default: '0'
    },
    'nowT': {
      default: '0'
    }
  },
  data: function () {
    return {
      shops_s: [],
      shops_g: [],
      cacheTagid: '',
      cacheMode: '',
      cacheSearch: '',
      countSensor1h: '-',
      countSensor24h: '-',
      countYesterday: '-',
      countToday: '-',
      countLogin: '-',
      shop_count: 0,
      trash_shop: '-',
      badShops: []
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
    const badShopsLine = String(this.$cookies.get('badShops'))
    this.badShops = badShopsLine.split(".")
    console.log(["badshop",this.badShops])
    this.$cookies.set('badShops', this.badShops.join("."),60*60*24*180)

  },
  methods: {
    clearBadShops () {
      this.badShops=[]
      this.$cookies.set('badShops', "",60*60*24*180)
      this.getShops(this.cacheMode, this.cacheTagid, this.cacheSearch)
    },
    addBadShop: function(one) {
      this.badShops.push(one.flag.substring(0, one.flag.indexOf('-')))
      this.getShops(this.cacheMode, this.cacheTagid, this.cacheSearch)
      this.$cookies.set('badShops', this.badShops.join("."),60*60*24*180)

      this.trash_shop = one.name
      this.$refs['my-modal'].show()
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
        this.shop_count=res.data.length
        // tagid=-150 新着は全部shops_sに表示
        res.data.forEach((one) => {
          if( ! this.badShops.includes(one.flag.substring(0, one.flag.indexOf('-'))) ){
            if( one.sn > 0 || tagid == -150 ){
              this.shops_s.push(one)
            }else{
              this.shops_g.push(one)
            }
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
  .shop_header{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  .counter{
    text-align: right;
    font-size: 85%;
    clear:both;
  }
  .counter_ele{
    margin-right:10px;
  }
  .clear_bad_shops{
    color: #5689d7;
  }
</style>

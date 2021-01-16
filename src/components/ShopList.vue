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
      v-for="z in shops"
      :id="z.flag"
      :key="z.flag"
      class="f"
      tabindex="0"
    >
      <!-- 看板と人数 -->
      <!--img @click="$ga.event('shop', 'click_shopflag', z.name);alog(z.flag,'info')" class="flag" :src="'https://secondlife.com/app/image/' + z.flag + '/1'"  :class="z.event ? 'ow_event':''"-->
      <img
        class="flag"
        :src="'https://sl-navi.azureedge.net/static/flag/' + z.flag"
        :class="z.event ? 'ow_event':''"
        @click="$ga.event('shop', 'click_shopflag', z.name);alog(z.flag,'info')"
      >
      <span
        v-if="isNewShop(z)"
        class="new_shop badge badge-primary"
      >新施設</span>
      <span
        v-if="nowOpen(z)==1"
        class="event_shop badge badge-danger"
      >イベント中</span>
      <span
        v-if="nowOpen(z)==2"
        class="event_shop badge badge-info"
      >イベント予定</span>

      <div class="memo">
        <span
          v-if="existStaff(z)"
          class="sn"
        >{{ z.sn }}</span>
        <span
          v-if="existGuest(z)"
          class="cn"
        >{{ z.cn }}</span>
        <span
          v-if="z.female>0"
          class="female"
        >♀×{{ z.female }}</span>
        <span
          v-if="z.male>0"
          class="male"
        >♂×{{ z.male }}</span>
        <span
          v-if="isShopClose(z)"
          class="badge badge-secondary"
        >閉店中</span>
      </div>
      <!-- ポップアップの中身 -->
      <b-popover
        triggers="click blur"
        placement="bottom"
        style="display:none"
        :target="z.flag"
      >
        <!-- :show="shops.length===1" -->
        <template #title>
          <a
            :href="'/search/'+z.flag"
            v-html="z.name"
          />
          <b-badge
            v-if="nowOpen(z)==1"
            variant="danger"
          >
            イベント中
          </b-badge>
          <span class="popover_title_right">
            <ShareNetwork
              network="Twitter"
              :url="'https://sl-navi.com/search/'+z.flag"
              :title="z.name "
              :description="z.description"
              hashtags="secondlife,sljp"
              sns_twitter_user="SL_uten"
            >
              <img
                class="sns_icon"
                src="https://sl-navi.com/static/twitter.png"
              >
            </ShareNetwork>
            <ShareNetwork
              network="Facebook"
              :url="'https://sl-navi.com/search/'+z.flag"
              :title="z.name "
              :description="z.description"
              hashtags="secondlife,sljp"
              sns_twitter_user="SL_uten"
            >
              <img
                class="sns_icon"
                src="https://sl-navi.com/static/facebook.png"
              >
            </ShareNetwork>

          </span>
        </template>
        <span v-html="shopDescription(z)" /><br>
        <span
          v-if="z.event"
          class="event_info"
        >
          <span class="badge badge-success">直近のイベント</span>
          <a :href="'/event/'+z.event.id"><b-icon-calendar2-week scale="0.8" />{{ nitiji(z.event.start)+" 〜 "+nitiji(z.event.end) }}  {{ z.event.title }}</a><br>
        </span>
        <span
          v-if="isAdultShop(z)"
          class="badge badge-danger"
        >アダルト施設</span>
        <span
          v-if="isKenzenShop(z)"
          class="badge badge-primary"
        >一般施設</span>
        <span
          v-for="tag in z.tags"
          :key="tag.id"
          class="badge badge-light"
        >{{ tag }}</span><br>
        <span class="n2">
          スタッフ<span class="sn2">{{ z.sn }}</span>人
          <span v-if="z.staffs.length!=0">
            (<span
              v-for="staff in z.staffs"
              :key="staff[0]"
            >
              <a
                :href="staff|staff_url"
                target="_blank"
                :class="staff|staff_sex"
              >
                <template v-if="staff!=''">{{ staff|staff_name }}</template>
              </a>
              <span v-if="staff[0] != z.staffs[z.staffs.length-1][0]">,</span>
            </span>)
          </span>
          / 訪問者<span class="cn2">{{ z.cn }}</span>人
          <template v-if="z.female+z.male>0">
            / 男女内訳
            <span v-if="z.female>0">
              ♀{{ z.female }}人
            </span>
            <span v-if="z.male>0">
              ♂{{ z.male }}人
            </span>
          </template>
        </span><br>
        <span
          v-if="z.owner_key != z.parcel_owner_key"
          class="n2"
        >
          センサ設置者:
          <a
            :href= "&quot;http://world.secondlife.com/resident/&quot;+z.owner_key"
            target="_blank"
          >
            {{ z.owner_name }}
          </a><br>
        </span>
        <a
          target="_blank"
          :href="'https://maps.secondlife.com/secondlife/' + z.sim + '/' + z.x + '/' + z.y + '/' + z.z"
          @click="$ga.event('shop', 'click_mapurl', z.name);alog(z.flag,'map')"
        >
          <b-icon-map scale="0.8" />ここに移動({{ z.sim }})
        </a>
        <span v-if="existBlog(z)">
          / <a
            target="_blank"
            :href="z.blog"
          >
            <b-icon-link scale="0.8" />Web( {{ z.blog.replace(/^http(|s):\/\//, '') }} )
          </a>
        </span>
        <br>
        <a
          v-if="z.radio!=''"
          target="_blank"
          :href="'http://uten.jp/radio.cgi?'+z.radio"
          @click="playRadio(z.radio)"
        >
          <b-icon-music-player-fill scale="0.8" />土地設定のラジオを聞く<br>
        </a>
        <!--
        <a v-if="z.radio!=''" HREF="javaScript:void(0)" @click="playRadio(z.radio)">
            <b-icon-music-player-fill scale="0.8" v-if="playFlag==1" ></b-icon-music-player-fill>
            <b-icon-music-note-beamed scale="0.8" v-if="playFlag==1" ></b-icon-music-note-beamed>
            <b-icon-music-player scale="0.8" v-else ></b-icon-music-player>
            土地設定のラジオを聞く(一部shoutcast未対応)
          <br>
        </a>
        -->
        <img
          class="heatmap"
          :src="'/static/heatmap/' + z.flag + '.png?'"
        >
      </b-popover>
    </div>
    <div v-if="!shops[0]">
      なし
    </div>
    <!--
    <div v-if="shops" class="f" id="ac" tabindex="0">
      <Adsense
        data-ad-client="ca-pub-7267369281211974"
        data-ad-slot="3986041962"
        ins-style="width:150px;height:150px;"
        data-ad-format=""
        data-full-width-responsive="no">
      </Adsense>
    </div>
    -->
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

var INTERVAL_RELOAD_SHOP = 60
var SHOP_SOURCE = '//sl-navi.com/api/shop'
var ALOG_SOURCE = '//sl-navi.com/api/alog'
export default {
  name: 'ShopList',
  filters: {
    'staff_url': function (value) {
      return '/d2p/' + value[0]
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
    }
  },
  data: function () {
    return {
      shops: [],
      cacheTagid: '',
      cacheMode: '',
      cacheSearch: '',
      playFlag: 0,
      playUrl: ''
    }
  },
  mounted () {
    var that = this
    this.$setInterval(() => {
      that.getShops(that.cacheMode, that.cacheTagid, that.cacheSearch)
    }, 1000 * INTERVAL_RELOAD_SHOP)
  },
  methods: {
    async alog (flag, event) {
      await axios.post(ALOG_SOURCE, {
        flag: flag,
        event: event
      })
    },
    nitiji: function (str) {
      return str.replace(/:00$/, '').replace('T', ' ').replace(/202[0-9]-/, '').replace('-', '/').replace(/^0/, '').replace(/\/0/, '/')
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
        return 1
      } else if (now < start) {
        return 2
      } else {
        return 0
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
    isEvent (z) {
      return z.event
    },
    existStaff (z) {
      return (z.sn > 0)
    },
    existGuest (z) {
      return (z.cn > 0)
    },
    isShopClose (z) {
      return (z.status === 0)
    },
    isAdultShop (z) {
      return (z.h === 1)
    },
    isKenzenShop (z) {
      return (z.h === 2)
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
        this.shops = res.data
        // console.log(['shoplist:getShop:then', this.shops])
      })
    }
  }
}
</script>

<style scoped>
  /* 看板 */
  .f{
    margin:4px;
    position: relative;
    display: inline-block;
    width: 150px;
    height: 150px;
    cursor: pointer;

  }
  /* 看板の上にcn snを並べて乗せるdiv */
  .memo{
    align-items: flex-end;
    position: absolute;
    left: 0px;
    bottom: 0px;
    display: flex;
  }
  .new_shop{
    align-items: flex-start;
    position: absolute;
    left: 0px;
    top: 0px;
    display: flex;
  }
  .event_shop{
    align-items: flex-start;
    position: absolute;
    right: 0px;
    top: 0px;
    display: flex;
  }
  .popover_title_right{
    align-items: flex-start;
    position: absolute;
    right: 0px;
    top: 3px;
  }
  .cn {
    width: 25px;
    height: 25px;
    color: #ffffff;
    background-color: #2779bd;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
  }
  .sn{
    width: 25px;
    height: 25px;
    color: #ffffff;
    background-color: #ffaa00;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
  }
  .male{
    height: fit-content;
    font-size: 60%;
    color: #ffffff;
    border-radius: 25%;
    cursor: pointer;
    background-color: #00aaaa;
  }
  .female{
    height: fit-content;
    font-size: 60%;
    color: #ffffff;
    border-radius: 25%;
    cursor: pointer;
    background-color: #ff8070;
  }

  .n2{
    font-size: 75%;
    font-weight: 700;

  }
  .cn2{
    width: 25px;
    height: 25px;
    padding: 0px 4px;
    color: #ffffff;
    background-color: #2779bd;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  .sn2{
    width: 25px;
    height: 25px;
    padding: 0px 4px;
    color: #ffffff;
    background-color: #ffaa00;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  /* ポップオーバー系 */
  .popover {
    max-width: 700px;
  }

  .popover-header{
    background: #fdf0e0;
    border-bottom: dashed 2px #ffb03f;
    padding: 0.3em 0.5em 0.3em 0.5em;
  }

  .popover {
    border: outset 1px #ffb03f;
    border-radius: 9px;
  }
  .flag {
    width: 150px;
    height: 150px;
  }
  .now_event{
    border: solid 3px #ff0000;
  }

  .heatmap {
    height: 120px;
    width: 320px;
  }
  .shops{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 0;
    margin-left: 15px;
    margin-bottom: 15px;
  }
  .shop_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  .sns_icon{
    width:20px;
    height:20px;
    margin: 5px;
  }
  .event_info{
    font-size: 75%;
    font-weight: 700;
  }

  hr{
    border:none;
    border-bottom: dashed 2px #ffb03f;
  }
  h4{
    color: #ffaa00;
    border-bottom: dashed 2px #ffb03f;
  }

</style>

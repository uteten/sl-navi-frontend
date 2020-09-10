// 1分に1回自動更新
<template>
  <div id="shops" class="col shops">
    <div class="shop_top">施設</div>
    <div v-for="z in shops" :id="z.flag" :key="z.flag" class="f" tabindex="0">
      <!-- 看板と人数 -->
      <img class="flag" :src="'https://secondlife.com/app/image/' + z.flag + '/1'"  :class="z.event ? 'ow_event':''">
      <span v-if="isNewShop(z)" class="new_shop badge badge-primary">新施設</span>
      <div class="memo">
        <span v-if="existStaff(z)" class="sn">{{ z.sn }}</span>
        <span v-if="existGuest(z)" class="cn">{{ z.cn }}</span>
        <span v-if="z.female>0" class="female">♀×{{ z.female }}</span>
        <span v-if="z.male>0" class="male">♂×{{ z.male }}</span>
        <span v-if="isShopClose(z)" class="badge badge-secondary">閉店中</span>
      </div>
      <!-- ポップアップの中身 -->
      <b-popover triggers="click blur" placement="bottom" style="display:none"
        :target="z.flag" :show="shops.length===1"
      >
        <template v-slot:title>
          <a :href="'#/search/'+z.flag" v-html="z.name"></a>
          <b-badge v-if="isEvent(z)" variant="danger">イベント中</b-badge>
        </template>
        <span v-html="shop_description(z)"></span><br>
        <span v-if="isAdultShop(z)" class="badge badge-danger">アダルト施設</span>
        <span v-if="isKenzenShop(z)" class="badge badge-primary">一般施設</span>
        <span v-for="tag in z.tags" :key="tag.id" class="badge badge-light">{{ tag }}</span><br>
        <span class="n2">
          スタッフ<span class="sn2">{{ z.sn }}</span>人
          <span v-if="z.staffs.length!=0">
            (<a v-for="staff in z.staffs" :href="staff|staff_url" :key="staff.id"
              target=_blank  :class="staff|staff_sex">
              <template v-if="staff!=''">{{ staff|staff_name }}</template>
            </a>)
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
        <a target=_blank v-bind:href="'https://maps.secondlife.com/secondlife/' + z.sim + '/' + z.x + '/' + z.y + '/' + z.z">
            <b-icon-map scale="0.8"></b-icon-map>ここに移動({{ z.sim }})
        </a>
        <span v-if="existBlog(z)">
          / <a target="_blank" v-bind:href="z.blog">
            <b-icon-link scale="0.8"></b-icon-link>Web( {{ z.blog.replace(/^http(|s):\/\//, '') }} )
            </a>
        </span>
        <br>
        <img class="heatmap" v-bind:src="'/static/heatmap/' + z.flag + '.png?'">
      </b-popover>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

var INTERVAL_RELOAD_SHOP = 60
var SHOP_SOURCE = '//sl-navi.com/api/shop'
export default {
  name: 'ShopList',
  props: ['mode'],
  data: function () {
    return {
      shops: [],
      cache_tagid: "",
      cache_mode: "",
      cache_search: ""
    }
  },
  filters: {
    'staff_url': function (value) {
      return '/d2p/' + value[0]
    },
    'staff_name': function (value) {
      return value[0]
    },
    'staff_sex': function (value) {
      if (value[1] == 0){
        return "female"
      }else if(value[1] == 1){
        return "male"
      }else{
        return
      }
    }
  },
  methods: {
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
    _formatDate:function (date, format) {
      format = format.replace(/YYYY/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
      return format;
    },
    isNewShop (z) {
      let now=new Date()
      now.setDate(now.getDate() - 7);
      let one_week=this._formatDate(now,'YYYY-MM-DDThh:mm:ss')
      // console.log([z.created_at,one_week])
      if(z.created_at>one_week){
        return 1
      }else{
        return 0
      }
    },
    shop_description (z) {
      let text=z.info
      const url_pattern=/(https?:\/\/[^ \r\n]+)/g
      return text.replace(url_pattern,'<a target="_blank" href="$1">$1</a>').replace(/\n/g, '<br>')
    },
    existBlog (z) {
      return (z.blog !== 'http://www.google.com' && z.blog.indexOf('http') === 0)
    },
    async getShops (m, tagid, search) {
      // console.log(['shoplist:getShop:axios', tagid, m, search])
      this.cache_mode=m
      this.cache_tagid=tagid
      this.cache_search=search
      await axios.get(SHOP_SOURCE, {
        params: {
          tagid: tagid,
          mode: m,
          search: search
        }
      }).then(res => {
        this.shops=res.data
        // console.log(['shoplist:getShop:then', this.shops])
      })
    }
  },
  mounted () {
      var that=this
      this.$setInterval(() => {
        that.getShops(that.cache_mode, that.cache_tagid, that.cache_search)
      }, 1000*INTERVAL_RELOAD_SHOP)

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
    height: 150px;
    width: 400px;
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
</style>

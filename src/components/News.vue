<template>
  <div id="news" class="col news">
    <div class="news_top">最近のおしらせ</div>
    <h6>メンテナンス情報</h6>
    <ul class="news_menu">
      <li class="news_item">2020/10/23<span class="badge badge-primary">バグ修正(WebGUI)</span> SL認証直後にイベント投稿すると投稿できない問題の修正</li>
      <li class="news_item">2020/10/09<span class="badge badge-primary">微調整 v4.07</span> 開店/閉店/Auto状況を看板の下に表示するようにしました（フローティングテキストは廃止)</li>
    </ul>
    <h6>新店舗情報</h6>
    <ul class="news_menu">
      <li class="news_item" v-for="z in shops" :id="z.flag" :key="z.flag">
        {{ nitiji(z.created_at) }} <span class="badge badge-primary">新規施設</span>
        {{ (z.h===1 ? "アダルト施設" : "一般施設") }}
        [<a :href="'/search/'+z.flag" v-html="z.name"></a>]を追加
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios


var NEW_SHOP_SOURCE = '//sl-navi.com/api/shop?new=5'
export default {
  name: 'News',
  data: function () {
    return {
      shops: []
    }
  },
  methods: {
    nitiji: function (str) {
      return str.replace(/T.*/, "").replace(/-/g, "/")
    },
    async getShops () {
      await axios.get(NEW_SHOP_SOURCE).then(res => {
        for (var z of res.data) {
          this.shops.push(z)
        }
      })
    }
  }
}
</script>

<style scorped>
  /* ====  News.vue ==== */
  .news_menu {
    padding: 0.2em 0 0.2em 0;
    margin: 0;
  }

  .news_item {
    color:black;
    font-size: small;
    line-height: 1.0;
    padding: 0.5em 0 0.5em 0.7em;
    list-style: none;
  }
  .news{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 0;
    margin-left: 15px;
    margin-bottom: 15px;
  }
  .news_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  .news_item .badge{
    margin-right: 0.8em;
  }
  h6{
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 20px;
    color: #444444;
    border-bottom: solid 1px #ffb03f;
  }

</style>
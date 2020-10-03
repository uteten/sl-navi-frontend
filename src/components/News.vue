<template>
  <div id="news" class="col news">
    <div class="news_top">最近のおしらせ</div>
    <h6>メンテナンス情報</h6>
    <ul class="news_menu">
      <li class="news_item">2020/09/24<span class="badge badge-primary">微調整 v4.06</span> 開店/閉店/Auto状況をフローティングテキストで表示可能にしました</li>
      <li class="news_item">2020/09/17<span class="badge badge-primary">微調整(WebGUI)</span> 一言メッセージは「閉店で即座に消え、開店のままで12時間表示。１人が複数投稿すると最新投稿のみ表示」に変更</li>
      <li class="news_item">2020/08/21 <span class="badge badge-danger">障害</span>ほぼ全センサの同期が切れる障害が発生しました。センサ設置者は「センサを編集⇒スクリプトリセット」を実施して復旧させてください。すみません。</li>
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
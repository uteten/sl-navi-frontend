<template>
  <div
    id="news"
    class="col news"
  >
    <div class="news_top">
      最近のおしらせ
    </div>
    <h6>メンテナンス情報</h6>
    <ul class="news_menu">
      <li class="news_item">
        2021/05/08~05/09 <span class="badge badge-primary">バグ修正(WebGUI)</span>たまに一般施設の画面が表示されないバグが発生しており、修正しました
      </li>
      <li class="news_item">
        2021/04/12 <span class="badge badge-primary">仕様修正 v4.3</span> 男女判定の仕組み見直し（着てる服は無視して、シェイプの♂♀でのみ判断）
      </li>
      <li class="news_item">
        2021/04/08 <span class="badge badge-primary">仕様修正(WebGUI)</span> 'チップ任意'のタグを非表示にしました（そもそもチップは任意なので）
      </li>
      <li class="news_item">
        2021/03/27 <span class="badge badge-primary">機能追加(WebGUI)</span> SLT⇨JST変換機をメインページに追加
      </li>
    </ul>
    <h6>新店舗情報</h6>
    <ul class="news_menu">
      <li
        v-for="z in shops"
        :id="z.flag"
        :key="z.flag"
        class="news_item"
      >
        {{ tukihi(z.created_at) }} <span class="badge badge-primary">新規施設</span>
        {{ (z.h===1 ? "アダルト施設" : "一般施設") }}
        [<a
          :href="'/search/'+z.flag"
          v-html="z.name"
        />]を追加
      </li>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

const NEW_SHOP_SOURCE = '//sl-navi.com/api/shop?new=5'
export default {
  name: 'News',
  data: function () {
    return {
      shops: []
    }
  },
  methods: {
    async getShops () {
      await axios.get(NEW_SHOP_SOURCE).then(res => {
        for (const z of res.data) {
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

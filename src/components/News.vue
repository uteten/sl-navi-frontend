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
        2021/02/09 <span class="badge badge-warning">ルール追加予定</span> SHOP施設が安売りとかで長期イベントを開催するとTOPに赤バッジがついて目立ちすぎなので対策検討中。ご意見あればIMください
      </li>
      <li class="news_item">
        2021/01/01 <span class="badge badge-primary">微調整(WebGUI)</span> イベント予定のある施設は緑のバッジを表示
      </li>
      <li class="news_item">
        2020/12/27 <span class="badge badge-primary">微調整(WebGUI)</span> 登録したイベントを修正する機能の追加
      </li>
      <li class="news_item">
        2020/12/13 <span class="badge badge-primary">微調整(WebGUI)</span> TOPに表示する施設条件を緩和(詳細はメニューのセンサ配布場所⇒FAQ)
      </li>
      <li class="news_item">
        2020/12/12 <span class="badge badge-primary">機能追加 v4.1</span> 土地音楽をブラウザで再生できるようにしました(センサ設置者＝土地所有者のときのみ可能)
      </li>
      <li class="news_item">
        2020/10/09 <span class="badge badge-primary">微調整 v4.07</span> 開店/閉店/Auto状況を看板の下に表示するようにしました(フローティングテキストは廃止)
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

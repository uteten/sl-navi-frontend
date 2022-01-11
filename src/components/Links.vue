<template>
  <div
    id="links"
    class="col news"
  >
    <div class="links_top">
      リンク集
    </div>
    <h6>初心者向け/総合</h6>
    <dl class="links_menu">
      <dt class="links_item">
        <a
          target="_blank"
          href="https://aniava.net/"
        >
          Second Life 美少女アバター wiki
        </a>
      </dt>
      <dd class="links_item">
        :アニメのアバターなど
      </dd>
      <dt class="links_item">
        <a
          target="_blank"
          href="https://seesaawiki.jp/furrys_habitat/"
        >
          SecondLife Furry's Habitat Wiki
        </a>
      </dt>
      <dd class="links_item">
        :けもののアバターなど
      </dd>
    </dl>
    <h6>買い物/イベント</h6>
    <dl class="links_menu">
      <dt class="links_item">
        <a
          target="_blank"
          href="https://www.seraphimsl.com/"
        >
          Seraphimsl
        </a>
      </dt>
      <dd class="links_item">
        :イベント/セール情報(英語)
      </dd>
      <dt class="links_item">
        <a
          target="_blank"
          href="https://hypeeventssl.wixsite.com/hypeeventssl/"
        >
          MIIX SL
        </a>
      </dt>
      <dd class="links_item">
        :セール情報(英語)
      </dd>
    </dl>
    <div class="links_item">
      ※便利なサイトを教えてくださいいい！（<a href="https://twitter.com/sl_uten">@SL_uten</a>へDM）
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  name: 'Links',
  data: function () {
    return {
      shops: []
    }
  }
}
</script>

<style scorped>
  dt{
    float: left;
  }
  dd{
    margin-left: 80px;
  }
  .links_menu {
    padding: 0.1em 0 0.1em 0;
    margin: 0;
  }

  .links_item {
    color:black;
    font-size: small;
    line-height: 1.0;
    padding: 0.1em 0 0.1em 0.7em;
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
  .links_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  .links_item .badge{
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

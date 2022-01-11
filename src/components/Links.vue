<template>
  <div
    id="links"
    class="col news"
  >
    <div class="news_top">
      リンク集
    </div>
    <h6>初心者向けサイト</h6>
    <dl class="news_menu">
      <dt class="news_item">
        <a
          target="_blank"
          href="https://aniava.net/"
        >
          美少女アニメアバターを作ろう！ [Second Life 美少女アバター wiki]
        </a>
      </dt>
      <dd class="news_item">
        :アニアバとか色々
      </dd>
    </dl>
    <div class="news_item">
      ※おすすめサイトを教えてください（<a href="https://twitter.com/sl_uten">@SL_uten</a>へDMで）
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

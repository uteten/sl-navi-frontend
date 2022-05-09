<template>
  <span>
    <dt class="links_item none">
      <a
        target="_blank"
        :href="url"
      >
        {{ title }}
      </a>
    </dt>
    <template
      v-for="z in articles"
    >
      <dt
        :key="z.link"
        class="links_item right"
      >
        <a
          :key="z.link"
          target="_blank"
          :href="z.link"
        >
          {{ z.title }}
        </a>
      </dt>
    </template>
  </span>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

export default {
  name: 'BlogArticles',
  props: {
    'title': {
      type: String,
      default: ''
    },
    'url': {
      type: String,
      default: ''
    },
    'json': {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      articles: [],
      nowTime: 0
    }
  },
  mounted () {
    this.nowTime = (new Date()).getTime()
    this.getData()
  },
  methods: {
    async getData () {
      await axios.get('//sl-navi.com/static/' + this.json + '.json?' + this.nowTime).then(res => {
      // await axios.get(this.json + '.json').then(res => {
        this.articles = res.data
      })
    }
  }
}
</script>

<style scorped>
  .none{
    float: none;
  }
  dt.left{
    float: left;
  }
  dt.right{
    margin-left: 20px;
    float: none;
    font-weight: normal;
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
    color: #906000;
    border-bottom: dashed 2px #ffb03f;
  }

</style>

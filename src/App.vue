<template>
  <div class="container-fluid">
    <div
      id="app"
      class="row"
    >
      <b-nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a
          id="sitetitle"
          class="navbar-brand"
          href="/"
        >SL-Navi</a>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse
          id="nav-collapse"
          is-nav
        >
          <ul
            id="topmenu"
            class="navbar-nav mr-auto"
          >
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link"
              >
                <b-icon-house scale="0.8" />一般
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/adult"
                class="nav-link"
              >
                <b-icon-heart-fill scale="0.8" />アダルト
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/all"
                class="nav-link"
                :class="searchword ? 'router-link-exact-active' : '' "
              >
                <b-icon-building scale="0.8" />両方
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/event"
                class="nav-link"
              >
                <b-icon-calendar-week scale="0.8" />イベント
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/about"
                class="nav-link"
              >
                <b-icon-info-circle-fill scale="0.8" />説明
              </router-link>
            </li>
          </ul>
          [ SLログイン人数 {{ inworld.toLocaleString() }}人 ]
          <form class="search form-inline">
            <input
              v-model="searchword"
              type="search"
              name="search"
              value=""
              class="form-control mr-sm-2"
              placeholder="キーワードで探す"
              aria-label="Search"
              @keydown.enter="goSearch($event.keyCode)"
            >
            <input
              type="text"
              name="dummy"
              style="display:none;"
            >
            <button
              class="btn btn-warning my-2 my-sm-0"
              type="button"
              @click="goSearch(13)"
            >
              <b-icon-search scale="0.8" />
            </button>
          </form>
        </b-collapse>
      </b-nav>
      <router-view
        ref="view"
        @selectedTag="searchword=''"
      />
      <footer class="footer">
        <div class="container">
          <p class="text-muted">
            © 2020-2021 sl-navi  | <a href="https://twitter.com/SL_Uten">@uten</a>
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VueHead from 'vue-head'
import VueCookies from 'vue-cookies'
import gv from './mixins/globalValiables'
import axios from 'axios'

Vue.prototype.$axios = axios

Vue.mixin(gv)
Vue.use(VueCookies)
Vue.use(VueHead)

export default {
  name: 'App',
  data: function () {
    return {
      mode: 'k', // [k=健全(/) e=Ero(/adult) c=全部(/all)]
      searchword: '',
      inworld: 0
    }
  },
  head: {
    title: {
      inner: 'SL-Navi',
      complement: 'セカンドライフの日本人向けリンク集'
    },
    meta: [
      { name: 'description', content: 'SL-Naviはセカンドライフ内で日本人がいるお店や遊び場、新施設が見つかるリンク集です。施設オーナーは審査不要で即座に施設紹介ができます。' },
      { name: 'keywords', content: 'セカンドライフ, Secondlife, sl-navi' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
      { charset: 'utf-8' }
      // ...
    ],
    link: [
      { rel: 'icon', href: '/static/favicon.ico' }
    ]
  },
  watch: {
    '$route.path': function () {
      this.syncSearchFormFromPath() // 同上(店のタイトルをクリックしてPathが変わったとき)
    }
  }, mounted () {
    this.syncSearchFormFromPath() // 検索フォームをPathにあわせて入力した状態にする（初期状態）
    const that = this
    this.getInworld()
    this.$setInterval(() => {
      that.getInworld()
    }, 1000 * 60)
  },
  methods: {
    goSearch (keyCode) {
      if (keyCode !== 13) return
      // 検索ワードが異なるときはPathを変える。同じ時は単に検索する
      if (this.searchword && this.$route.params.searchword !== this.searchword) {
        this.$router.push('/search/' + this.searchword.replace('/', '%2F'))
      } else {
        this.$refs.view.actionSearch(this.searchword)
      }
    },
    syncSearchFormFromPath () {
      // console.log(['syncTopMenuFromPath', this.$route.path])
      // 検索パスがある場合は/allを選択、それ以外はパスに合わせて選択かつ検索フォームをクリア
      const word = this.$route.path.match(/^\/search\/(.*)/)
      if (word && word[1] !== '') {
        this.searchword = word[1].replace('%2F', '/')
      } else {
        this.searchword = ''
      }
    },
    async getInworld () {
      await axios.get('https://sl-navi.com/static/inworld.txt').then(res => {
        this.inworld = res.data
      })
    }
  }
}
</script>

<style>
.nav-item{
  font-size: 90%;
}
  /* -- 全体的な設定 -- */
  body{
    padding-top: 4.5rem;
    background-color: #ffffff;
  }
  #app {
    text-align: left;
  }
  #sitetitle {
    color: #ffaa00;
    font-family: 'arial black';
  }
  .view{
    width: 100%
  }
  .bi-heart-fill{
    color: crimson;
  }
  .bi-calendar-week{
    color: blue;
  }
  a.router-link-exact-active {
    background-color: #ffffff;
    border-left: solid 1px #dddddd;/*左側の線*/
    border-right: solid 1px #dddddd;/*右側の線*/
    border-bottom: solid 3px #ffc107;/*下側の線*/
    border-bottom-right-radius: 3px;
    border-bottom-left-radius: 3px;
    cursor: pointer;
  }
  .footer{
    width: 100%;
    text-align: center;

  }
</style>

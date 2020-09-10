<template>
  <div class="container-fluid" >
    <div id="app" class="row" >
        <b-nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a id="sitetitle" class="navbar-brand" href="./">SL-Navi</a>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <ul id="topmenu" class="navbar-nav mr-auto">
                <li class="nav-item" ><router-link to="/"      class="nav-link"><b-icon-house scale="0.8"></b-icon-house>一般施設</router-link></li>
                <li class="nav-item" ><router-link to="/adult" class="nav-link"><b-icon-heart-fill scale="0.8"></b-icon-heart-fill>アダルト施設</router-link></li>
                <li class="nav-item" ><router-link to="/all"   class="nav-link" :class="this.searchword ? 'router-link-exact-active' : '' "><b-icon-building scale="0.8"></b-icon-building>全施設</router-link></li>
                <li class="nav-item" ><router-link to="/event" class="nav-link"><b-icon-calendar-week scale="0.8"></b-icon-calendar-week>イベントカレンダー</router-link></li>
                <li class="nav-item" ><router-link to="/about" class="nav-link"><b-icon-info-circle-fill scale="0.8"></b-icon-info-circle-fill> お知らせ＆センサ配布場所</router-link></li>
            </ul>
            <form class="search form-inline">
                <input type="search" v-model="searchword" @keydown.enter="goSearch($event.keyCode)"
                      name="search" value="" class="form-control mr-sm-2" placeholder="キーワードで探す" aria-label="Search">
                <input type="text" name="dummy" style="display:none;">
                <button v-on:click="goSearch(13)" class="btn btn-warning my-2 my-sm-0" type="button">
                  <b-icon-search scale="0.8"></b-icon-search>
                </button>
            </form>
        </b-collapse>
        </b-nav>
      <router-view ref="view" @selected_tag="searchword=''"/>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import VueHead from 'vue-head'
import SetInterval from '@/plugins/SetInterval'
Vue.use(SetInterval)


Vue.use(VueHead)
export default {
  name: 'App',
  data: function () {
    return {
      mode: 'k', // [k=健全(/) e=Ero(/adult) c=全部(/all)]
      searchword: '',
      search_active: ''
    }
  },
  head: {
    title: {
      inner: 'SL-Navi',
      complement: 'セカンドライフ内の遊び場紹介'
    },
    meta: [
        { name: 'description', content: 'SL-Naviはセカンドライフ内で日本人がいるお店や遊び場、新施設をぱっと見つけることができます。また施設オーナーは簡単に即座に施設を紹介できます。' },
        { name: 'keywords', content: 'セカンドライフ カフェ,セカンドライフ 店,セカンドライフ,SecondLife,ファーリー,sl-navi,アダルト' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
        { charset: 'utf-8' },
        // ... 
    ],
    link: [
      { rel: 'icon', href: '/static/favicon.ico' }
    ]
  },
  methods: {
    goSearch (keyCode) {
      if (keyCode !== 13) return;
      // 検索ワードが異なるときはPathを変える。同じ時は単に検索する
      if (this.searchword && this.$route.params.searchword !== this.searchword) {
        this.$router.push('/search/' + this.searchword)
      } else {
        this.$refs.view.actionSearch(this.searchword)
      }
    },
    syncSearchFormFromPath () {
      // console.log(['syncTopMenuFromPath', this.$route.path])
      // 検索パスがある場合は/allを選択、それ以外はパスに合わせて選択かつ検索フォームをクリア
      let word = this.$route.path.match(/^\/search\/(.*)/)
      if (word && word[1] !== '') {
        this.searchword = word[1]
      } else {
        this.searchword = ''
      }
    }
  },mounted () {
    this.syncSearchFormFromPath() // 検索フォームをPathにあわせて入力した状態にする（初期状態）
  },
  watch: {
    '$route.path': function () {
      this.syncSearchFormFromPath() // 同上(店のタイトルをクリックしてPathが変わったとき)
    }
  }
}
</script>

<style>
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
</style>

<template>
  <div class="container-fluid" >
    <div id="app" class="row" >
        <b-nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a id="sitetitle" class="navbar-brand" href="/">SL-Navi</a>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
            <ul id="topmenu" class="navbar-nav mr-auto">
                <li class="nav-item" ><router-link to="/"      class="nav-link"><span :class="selected['/']"><b-icon-house scale="0.8"></b-icon-house>一般施設</span></router-link></li>
                <li class="nav-item" ><router-link to="/adult" class="nav-link"><span :class="selected['/adult']"><b-icon-heart-fill scale="0.8"></b-icon-heart-fill>アダルト施設</span></router-link></li>
                <li class="nav-item" ><router-link to="/all"   class="nav-link"><span :class="selected['/all']"><b-icon-building scale="0.8"></b-icon-building>全施設</span></router-link></li>
                <li class="nav-item" ><a class="nav-link" href="/event"><span :class="selected['/event']"><b-icon-calendar-week scale="0.8"></b-icon-calendar-week>イベントカレンダー</span></a></li>
                <li class="nav-item" ><router-link to="/about" class="nav-link"><span :class="selected['/about']"><b-icon-info-circle-fill scale="0.8"></b-icon-info-circle-fill> お知らせ＆センサ配布場所</span></router-link></li>
            </ul>
            <form class="search form-inline">
                <input type="search" v-model="searchword" @keydown.enter="goSearch($event.keyCode)"
                      name="search" value="" class="form-control mr-sm-2" placeholder="キーワードで探す" aria-label="Search">
                <input type="text" name="dummy" style="display:none;">
                <button v-on:click="goSearch" class="btn btn-warning my-2 my-sm-0" type="button">
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

Vue.use(VueHead)
export default {
  name: 'App',
  data: function () {
    return {
      mode: 'k', // [k=健全(/) e=Ero(/adult) c=全部(/all)]
      searchword: '',
      selected: {}
    }
  },
  head: {
    title: {
      inner: 'SL-Navi',
      complement: 'セカンドライフ内の遊び場紹介'
    },
    meta: [
        { name: 'description', content: 'SL-Naviはセカンドライフ内で日本人がいるお店や遊び場を見つけたり、新しい店舗をぱっと見つけることができます。また、施設オーナー様は簡単に即座に施設を紹介できます。' },
        { name: 'keywords', content: 'セカンドライフ カフェ,セカンドライフ 店,セカンドライフ,SecondLife,ファーリー,sl-navi' },
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
    syncTopMenuFromPath () {
      console.log(['syncTopMenuFromPath', this.$route.path])
      // いったんTopメニューの選択を全クリア
      for (let x of ['/', '/adult', '/all', '/event', '/about']) {
        this.$set(this.selected, x, '')
      }
      // 検索パスがある場合は/allを選択、それ以外はパスに合わせて選択かつ検索フォームをクリア
      let word = this.$route.path.match(/^\/search\/(.*)/)
      if (word && word[1] !== '') {
        this.$set(this.selected, '/all', 'selected')
        this.searchword = word[1]
      } else {
        this.$set(this.selected, this.$route.path, 'selected')
        this.searchword = ''
      }
    }
  },
  mounted () {
    this.syncTopMenuFromPath() // TopメニューをPathに合わせて選択した状態にする（初期状態）
  },
  watch: {
    '$route.path': function () {
      this.syncTopMenuFromPath() // TopメニューをPathに合わせて選択した状態にする(変化したとき）
    }
  }
}
</script>

<style>
  .view{
    width: 100%
  }
  #sitetitle {
    color: #ffaa00;
    font-family: 'arial black';
  }
  #app {
    text-align: left;
  }
  /* -- 全体的な設定 -- */
  body{
    padding-top: 4.5rem;
    background-color: #ffffff;
  }
  .bi-heart-fill{
    color: crimson;
  }

  .bi-calendar-week{
    color: blue;
  }

  .selected{
    background-color: #ffaa00;
    border-radius: 5px;
    cursor: pointer;
  }

  /* 使ってない */
  /* popoverの中(削除済み) */
  .testp {
    font-size:small;
  }
#nav a.router-link-exact-active {
  color: #42b983;
}
</style>

<template>
  <div class="container-fluid">
    <div class="row">
      <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <a
          id="sitetitle"
          class="navbar-brand"
          href="/"
        >
          <img
            class="logo-img"
            src="https://static.sl-navi.com/sl-navi-logo.png"
          >
        </a>
        <b-navbar-toggle target="nav-collapse" />
        <b-collapse
          id="nav-collapse"
          is-nav
        >
          <ul
            id="topmenu"
            class="navbar-nav me-auto"
          >
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link"
                :class="$route.path.match('/kenzen/') ? 'router-link-exact-active' : '' "
              >
                <i class="bi bi-house-fill" />一般
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/adult"
                class="nav-link"
                :class="$route.path.match('/adult/') ? 'router-link-exact-active' : '' "
              >
                <i class="bi bi-heart-fill" />アダルト
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/all"
                class="nav-link"
                :class="$route.path.match(/\/all\/|\/search\//) ? 'router-link-exact-active' : '' "
              >
                <i class="bi bi-building" />両方
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/event"
                class="nav-link"
              >
                <i class="bi bi-calendar-week" />イベント
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/gift"
                class="nav-link"
              >
                <i class="bi bi-gift-fill" />ギフト
              </router-link>
            </li>
            <li class="nav-item">
              <router-link
                to="/about"
                class="nav-link"
              >
                <i class="bi bi-info-circle-fill" />説明
              </router-link>
            </li>
          </ul>
          <form class="search d-flex">
            <input
              v-model="searchword"
              type="search"
              name="search"
              value=""
              class="form-control me-sm-2"
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
              <i class="bi bi-search" />
            </button>
          </form>
        </b-collapse>
      </nav>
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          ref="view"
          @selected-tag="searchword=''"
        />
      </router-view>
      <footer class="footer">
        <div class="container">
          <p class="text-muted">
            © 2020-2026 sl-navi
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>
<script>
import { useHead } from '@unhead/vue'

export default {
  name: 'App',
  setup () {
    // title は router の afterEach が決めるので、ここでは meta と link だけ
    useHead({
      meta: [
        { name: 'description', content: 'セカンドライフ内で日本人がいるお店や遊び場、新施設紹介' },
        { name: 'keywords', content: 'セカンドライフ, Secondlife, sl-navi' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, shrink-to-fit=no' }
      ],
      link: [
        { rel: 'icon', href: '/static/favicon.ico' }
      ]
    })
  },
  data: function () {
    return {
      mode: 'k', // [k=健全(/) e=Ero(/adult) c=全部(/all)]
      searchword: '',
      countSensor1h: '-',
      countSensor24h: '-',
      countYesterday: '-',
      countToday: '-'
    }
  },
  watch: {
    '$route.path': function () {
      this.syncSearchFormFromPath() // 同上(店のタイトルをクリックしてPathが変わったとき)
    }
  }, mounted () {
    this.syncSearchFormFromPath() // 検索フォームをPathにあわせて入力した状態にする（初期状態）
    /*
    const that = this
    this.getCounter()
    this.$setInterval(() => {
      that.getCounter()
    }, 1000 * 60)
    */
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
    }
    /*
    async getCounter () {
      await axios.get('/static/counter2.json').then(res => {
        var j = res.data
        this.countSensor1h = j.countSensor1h
        this.countSensor24h = j.countSensor24h
        this.countToday = j.countToday
        this.countYesterday = j.countYesterday
      })
    }
    */
  }
}
</script>

<style>
  .navbar {
    padding: 0 10px !important;
  }
  .logo-img{
    height: 26px;
    padding: 0;
    border:0;
    margin: 0px 0px 0px 0px;
    vertical-align: 0;
  }
  .nav-item{
    font-size: 100%;
  }
  .navbar-brand{
    padding: 10px 5px 0px 0px !important;
  }
  body{
    padding-top: 3.5rem;
    background-color: #ffffff;
  }
  #sitetitle {
    color: #ffaa00;
    font-family: 'arial black';
  }
  /*
  .bi-heart-fill{
    color: crimson;
  }
  */
  .bi-calendar-week{
    color: blue;
  }
  .bi-gift-fill{
    color: #32a014;
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
  /* Bootstrap 4 と同じく、リンクの下線はホバー時だけ (Bootstrap 5 は常に下線) */
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  /* bootstrap-vue-next の popover は施設の枠の中に置かれるので、幅を中身に合わせる
     (bootstrap-vue は body 直下に置いていた) */
  .popover {
    width: max-content;
  }
  /* bootstrap-vue のアイコン (SVG) と同じく、文字との間を少し空ける */
  .bi {
    margin-right: 0.1em;
  }
  .footer{
    width: 100%;
    text-align: center;

  }
</style>

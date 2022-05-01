<template>
  <div class="col col-12 row">
    <tag-list
      ref="appTagList"
      class="col-lg-2 order-lg-1 order-2"
      :mode="mode"
      @selected-tag="actionSelectedTag"
    />
    <div class="col-lg-10 order-lg-2 order-1">
      <messages ref="appMessages" />
      <shop-list
        ref="appShopList"
        :ad="nowT == lastT"
      />
      <!-- 基本GoogleAD -->
      <div
        v-if="$cookies.get('dev')!=1 && !isLocalhost() && nowT == lastT && nowT % 5==0"
        class="ad"
      >
        <Adsense
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="4854478492"
          ins-style="display:inline-block;width:100%;height:160px;"
          data-ad-format=""
          data-full-width-responsive=""
        />
      </div>
      <!--
      <div
        v-if="$cookies.get('dev')!=1 && nowT == lastT"
        class="ad"
      >
        <Adsense
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="5067544569"
          ins-style="display:inline-block;float:left;width:50%;height:320px;"
          data-ad-format=""
          data-full-width-responsive=""
        />
        <Adsense
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="5067544569"
          ins-style="display:inline-block;width:50%;height:320px;"
          data-ad-format=""
          data-full-width-responsive=""
        />
      </div>
      -->
      <!-- リロードかつ健全以外 -->
      <!--
      <div
        v-if="nowT != lastT && mode=='e' "
        class="col ad"
      >
        <iframe
          :src="'https://sl-navi.com/static/dmm-ad1.html?'+lastT"
          width="300"
          height="252"
          scrolling="no"
          border="0"
          marginwidth="0"
          style="border:none;"
          frameborder="0"
        />
        <iframe
          :src="'https://sl-navi.com/static/dmm-ad2.html?'+lastT"
          width="300"
          height="252"
          scrolling="no"
          border="0"
          marginwidth="0"
          style="border:none;"
          frameborder="0"
        />
      </div>
      -->
      <event-list ref="appEventList" />
      <links ref="appLinks" />
      <!--
      <news ref="appNews" />
      -->
    </div>
  </div>
</template>

<script>
import TagList from '@/components/TagList'
import Messages from '@/components/Messages'
// import News from '@/components/News'
import Links from '@/components/Links'
import ShopList from '@/components/ShopList'
import EventList from '@/components/EventList'

// import '@/css/slnavi-vue.css'
const ACTIVE_SHOP_TAGID = -300
// const OPEN_SHOP_TAGID = -2
const ALL_SHOP_TAGID = -100

export default {
  name: 'ViewSlnavi',
  components: {
    TagList,
    // News,
    Links,
    Messages,
    ShopList,
    EventList
  },
  props: {
    'mode': {
      type: String,
      default: 'k'
    }
  },
  data: function () {
    return {
      tagid: ACTIVE_SHOP_TAGID,
      searchword: this.$route.params.searchword,
      nowT: 1,
      lastT: 1,
      reloadCount: 0
    }
  },
  watch: {
    mode: function () {
      // 検索モードは$route.params.searchwordの監視でハンドリングするので無視する
      if (!this.$route.params.searchword) {
        // console.log(['viewSlnavi:watch:mode', to, from])
        // mode変更時の初期値
        this.tagid = ACTIVE_SHOP_TAGID
        // this.tagid = OPEN_SHOP_TAGID
        this.$refs.appTagList.changeStatus(this.mode, this.tagid)
        this.$refs.appShopList.getShops(this.mode, this.tagid)
        this.$refs.appMessages.getMessages(this.mode)
        this.$refs.appEventList.getEvents(this.mode)
      }
    },
    '$route.params.searchword': function () {
      // onsole.log(['viewSlnavi:watch:searchword', to, from])
      this.searchword = this.$route.params.searchword
      if (this.searchword) {
        this.actionSearch(this.searchword)
      }
    }
  },
  mounted () {
    const date = new Date()
    this.nowT = date.getTime()
    this.lastT = Number(this.$cookies.get('t'))
    this.reloadCount = Number(this.$cookies.get('c'))
    // 10分に4回だけ広告表示
    if (this.nowT - this.lastT > 10 * 60 * 1000) {
      // 10分以上経ってるときはカウントリセット
      this.$cookies.set('t', this.nowT)
      this.$cookies.set('c', 0)
      this.lastT = this.nowT
    } else if (this.reloadCount < 3) {
      this.$cookies.set('t', this.nowT)
      this.$cookies.set('c', this.reloadCount + 1)
      this.lastT = this.nowT
    }
    // console.log(['viewSlnavi:mounted!!', this])
    if (this.searchword) {
      // console.log(['viewSlnavi:mounted-search', this.searchword])
      this.tagid = ALL_SHOP_TAGID
      this.$refs.appTagList.getTags(this.tagid)
      this.actionSearch(this.searchword)
      this.$refs.appEventList.getEvents()
      this.$refs.appNews.getShops()
      this.$refs.appMessages.getMessages(this.mode)
    } else {
      // 初期値
      this.tagid = ACTIVE_SHOP_TAGID
      // this.tagid = OPEN_SHOP_TAGID
      this.$refs.appTagList.getTags(this.tagid)
      this.$refs.appShopList.getShops(this.mode, this.tagid)
      this.$refs.appEventList.getEvents(this.mode)
      this.$refs.appNews.getShops()
      this.$refs.appMessages.getMessages(this.mode)
    }
  },
  methods: {
    actionSelectedTag: function (e) {
      this.tagid = e
      this.$refs.appShopList.getShops(this.mode, e)
      this.$emit('selected-tag', e)
    },
    actionSearch: function (e) {
      console.log(['view:actionSearch', e])
      this.tagid = ALL_SHOP_TAGID
      this.$refs.appTagList.changeStatus('c', this.tagid)
      this.$refs.appShopList.getShops('c', this.tagid, e)
    },
    isLocalhost: function (e) {
      if (location.origin === 'http://localhost:8080') {
        return 1
      } else {
        return 0
      }
    }
  }
}
</script>
<style>
.row{
  padding-right: 0px;
  padding-left: 0px;
}
.col{
  margin-left: 0px;
  margin-left: 0px;
  margin-bottom: 15px;
}
.ad{
  text-align: center;
  padding: 0;
  margin-left: 15px;
  margin-bottom: 15px;

}
</style>

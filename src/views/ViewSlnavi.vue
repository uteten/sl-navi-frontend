<template>
  <div class="col col-12 row">
    <tag-list
      ref="appTagList"
      class="col-lg-2 order-lg-1 order-2"
      :mode="mode"
      @selected-tag="actionSelectedTag"
    />
    <div class="col-lg-10 order-lg-2 order-1">
      <shop-messages ref="appMessages" />
      <shop-list
        ref="appShopList"
        :ad="nowT == lastT"
        :nowT="nowT"
      />
      <div
        v-if="nowT % 1==99  && mode=='k'"
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
      <event-list ref="appEventList" />
      <div
        v-if="$cookies.get('dev')!=1 && !isLocalhost() && nowT == lastT && nowT % 3==99"
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
      <site-links ref="appLinks" />
      <!--
      <news ref="appNews" />
      <div
        v-if="nowT == lastT && mode=='k'"
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
      -->
    </div>
  </div>
</template>

<script>
import TagList from '@/components/TagList'
import ShopMessages from '@/components/ShopMessages'
// import News from '@/components/News'
import SiteLinks from '@/components/SiteLinks'
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
    SiteLinks,
    ShopMessages,
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
      tagid: Number(this.$route.params.tagid) || ACTIVE_SHOP_TAGID,
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
        // console.log(['viewSlnavi:watch:mode'])
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
      // console.log('search')
      // onsole.log(['viewSlnavi:watch:searchword', to, from])
      this.searchword = this.$route.params.searchword
      if (this.searchword) {
        this.actionSearch(this.searchword)
      }
    },
    '$route.params.tagid': function () {
      this.tagid = this.$route.params.tagid
      if (this.tagid) {
        this.actionSelectedTag(this.tagid)
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
      this.$refs.appEventList.getEvents()
      this.$refs.appMessages.getMessages(this.mode)
      this.actionSearch(this.searchword)
    } else if (this.tagid) {
      // console.log(['viewSlnavi:mounted-tagid', this.tagid])
      this.$refs.appTagList.getTags(this.tagid)
      this.$refs.appEventList.getEvents(this.mode)
      this.$refs.appMessages.getMessages(this.mode)
      this.actionSelectedTag(this.tagid)
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
      // console.log(['view:actionSearch', e])
      this.tagid = ALL_SHOP_TAGID
      this.$refs.appTagList.changeStatus('c', this.tagid)
      this.$refs.appShopList.getShops('c', this.tagid, e)
    },
    isLocalhost: function (e) {
      console.log(e)
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
/* popoverのヘッダはShopElement.vueに書いても反映されないのでここに書く*/
.bs-popover-bottom > .arrow::after{
  border-bottom-color: #fdf0e0;
}
.bs-popover-bottom > .arrow::before{
  border-bottom-color: #ffb03f;
}
.popover-header{
    font-size: large;
    background: #fdf0e0;
    border-bottom: dashed 1px #ffb03f;
    padding: 0.3em 0.5em 0.3em 0.5em;
}
.popover {
    max-width: 700px;
    min-width: 430px;
    border: 1px solid #ffb03f;
    border-radius: 5px;
}
  .row{
  padding-right: 0px;
  padding-left: 0px;
}
.col-lg-10{
  padding-left: 5px;
  padding-right: 5px;
}
.col{
  margin-left: 0px;
  margin-left: 0px;
  margin-bottom: 15px;
}
.ad{
  text-align: center;
  padding: 0;
  margin-left: 0px;
  margin-right: 0px;
  margin-bottom: 15px;

}
</style>

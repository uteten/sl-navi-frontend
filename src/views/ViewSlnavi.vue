<template>
  <div class="view row">
    <tag-list
      ref="appTagList"
      :mode="mode"
      @selected-tag="actionSelectedTag"
    />
    <div class="view col">
      <messages ref="appMessages" />
      <shop-list ref="appShopList" />
      <div
        v-if="$cookies.get('dev')!=1"
        class="col ad"
      >
        <Adsense
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="4854478492"
          ins-style="display:inline-block;width:80%;height:120px;"
          data-ad-format=""
          data-full-width-responsive=""
        />
      </div>
      <event-list ref="appEventList" />
      <news ref="appNews" />
    </div>
  </div>
</template>

<script>
import TagList from '@/components/TagList'
import Messages from '@/components/Messages'
import News from '@/components/News'
import ShopList from '@/components/ShopList'
import EventList from '@/components/EventList'

// import '@/css/slnavi-vue.css'
const ACTIVE_SHOP_TAGID = -3
// const OPEN_SHOP_TAGID = -2
const ALL_SHOP_TAGID = -1

export default {
  name: 'ViewSlnavi',
  components: {
    TagList,
    News,
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
      searchword: this.$route.params.searchword
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
      this.$refs.appEventList.getEvents()
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
    }
  }
}
</script>
<style>
table {
  margin-left:auto;margin-right:auto;
  width:80%;
}
td{
  width:50%;
}
.ad{
  text-align: center;
  /*
  max-height: 200px;
  background: #fdfcec;
  border: 1px solid #ffb03f;
  border-radius: 5px;
  */
  padding: 0;
  margin-left: 15px;
  margin-bottom: 15px;

}
.event_info_image{
  width: 100%;
}
h5{
    color: #ffaa00;
    font-weight: bold;
}
.modal-header{
	background: #fdf0e0;
}
.modal-content{
	border-radius: 10px;
	border: solid 2px #ffb03f;
}
#google-center-div {
  vertical-align: middle;
}
</style>

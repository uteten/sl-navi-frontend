<template>
  <div class="view row">
    <tag-list ref="appTagList" :mode="mode"
              v-on:selected_tag="actionSelectedTag"></tag-list>
    <div class="view col">
      <shop-list ref="appShopList"></shop-list>
      <event-list ref="appEventList"></event-list>
      <news ref="appNews"></news>
    </div>
  </div>
</template>

<script>
import TagList from '@/components/TagList'
import News from '@/components/News'
import ShopList from '@/components/ShopList'
import EventList from '@/components/EventList'
// import '@/css/slnavi-vue.css'
const ACTIVE_SHOP_TAGID = -3
// const OPEN_SHOP_TAGID = -2
const ALL_SHOP_TAGID = -1

export default {
  name: 'ViewSlnavi',
  props: ['mode'],
  data: function () {
    return {
      tagid: ACTIVE_SHOP_TAGID,
      searchword: this.$route.params.searchword
    }
  },
  components: {
    TagList,
    News,
    ShopList,
    EventList
  },
  methods: {
    actionSelectedTag: function (e) {
      this.tagid = e
      this.$refs.appShopList.getShops(this.mode, e)
      this.$emit('selected_tag', e)
    },
    actionSearch: function (e) {
      console.log(['view:actionSearch', e])
      this.mode = 'c'
      this.tagid = ALL_SHOP_TAGID
      this.$refs.appTagList.changeStatus(this.mode, this.tagid)
      this.$refs.appShopList.getShops(this.mode, this.tagid, e)
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
        this.$refs.appList.getEvents()
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
  // beforeUpdate () {
  //   console.log(['viewSlnavi:befoUpdate', this])
  // },
  mounted () {
    // console.log(['viewSlnavi:mounted!!', this])
    if (this.searchword) {
      // console.log(['viewSlnavi:mounted-search', this.searchword])
      this.tagid = ALL_SHOP_TAGID
      this.$refs.appTagList.getTags(this.tagid)
      this.actionSearch(this.searchword)
      this.$refs.appEventList.getEvents()
    } else {
      // 初期値
      this.tagid = ACTIVE_SHOP_TAGID
      // this.tagid = OPEN_SHOP_TAGID
      this.$refs.appTagList.getTags(this.tagid)
      this.$refs.appShopList.getShops(this.mode, this.tagid)
      this.$refs.appEventList.getEvents()
    }
  }
}
</script>

<template>
  <div class="view row">
    <tag-list ref="appTagList" :mode="mode"
              v-on:selected_tag="actionSelectedTag"></tag-list>
    <shop-list ref="appShopList"></shop-list>
  </div>
</template>

<script>
import TagList from '@/components/TagList'
import ShopList from '@/components/ShopList'
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
    ShopList
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
    mode: function (to, from) {
      // 検索モードは$route.params.searchwordの監視でハンドリングするので無視する
      if (!this.$route.params.searchword) {
        console.log(['viewSlnavi:watch:mode', to, from])
        // mode変更時の初期値
        this.tagid = ACTIVE_SHOP_TAGID
        // this.tagid = OPEN_SHOP_TAGID
        this.$refs.appTagList.changeStatus(this.mode, this.tagid)
        this.$refs.appShopList.getShops(this.mode, this.tagid)
      }
    },
    '$route.params.searchword': function (to, from) {
      console.log(['viewSlnavi:watch:searchword', to, from])
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
    console.log(['viewSlnavi:mounted!!', this])
    if (this.searchword) {
      console.log(['viewSlnavi:mounted-search', this.searchword])
      this.tagid = ALL_SHOP_TAGID
      this.$refs.appTagList.getTags(this.tagid)
      this.actionSearch(this.searchword)
    } else {
      // 初期値
      this.tagid = ACTIVE_SHOP_TAGID
      // this.tagid = OPEN_SHOP_TAGID
      this.$refs.appTagList.getTags(this.tagid)
      this.$refs.appShopList.getShops(this.mode, this.tagid)
    }
  }
}
</script>

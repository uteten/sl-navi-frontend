<template>
  <div class="view row">
    <tag-list ref="appTagList" :mode="mode"
              v-on:selected_tag="actionSelectedTag"></tag-list>
    <div class="view col">
      <messages ref="appMessages"></messages>
      <shop-list ref="appShopList"></shop-list>
      <event-list ref="appEventList"></event-list>
      <news ref="appNews"></news>
      <!-- イベント直リンク表示 -->
      <b-modal v-if="event_data.id" v-model="showModal" class="modal fade" :title="event_data.title" size="lg" hide-footer>
        <img class="event_info_image" :src="event_data.img_url">
        <dl class="dl-horizontal">
            <dt>形式</dt><dd>{{ event_data.genre.name }}</dd>
            <dt>期間</dt><dd>{{ nitiji(event_data.start_time)+" 〜 "+nitiji(event_data.end_time) }}</dd>
            <dt>場所</dt><dd><a @click="$ga.event('event', 'click_mapurl', event_data.title)"  target=_blank :href="event_data.map_url">{{ event_data.map_url }}</a></dd>
            <dt>詳細</dt><dd v-html="escape_html(event_data.description)"></dd>
            <dt>この画面のリンク</dt><dd><a target=_blank :href="'https://sl-navi.com/#/eid/'+event_data.id" v-html="'https://sl-navi.com/#/eid/'+event_data.id"></a></dd>
            <dt>投稿</dt><dd>Posted by <a target=_blank :href="'https://twitter.com/'+event_data.created_by.name">@{{ event_data.created_by.name }}</a></dd>
        </dl>
      </b-modal>

    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

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
  props: ['mode'],
  data: function () {
    return {
      tagid: ACTIVE_SHOP_TAGID,
      searchword: this.$route.params.searchword,
      event_data:{},
      showModal:false
    }
  },
  components: {
    TagList,
    News,
    Messages,
    ShopList,
    EventList
  },
  methods: {
    async getEvent (){
      var EVENT_SOURCE = '//sl-navi.com/event/api/slevent/'
      await axios.get(EVENT_SOURCE+this.$route.params.eid).then(res => {
        this.event_data=res.data
        this.showModal=true
      })
    },
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
    },
    escape_html: function (tmp) {
      if(typeof tmp !== 'string') {
        return tmp;
      }
      tmp= tmp.replace(/[&'`"<>]/g, function(match) {
        return {
          '&': '&amp;',
          "'": '&#x27;',
          '`': '&#x60;',
          '"': '&quot;',
          '<': '&lt;',
          '>': '&gt;',
        }[match]
      });
      const img_pattern=/\[ *(https?:\/\/[^\]]+) *\]/g
      tmp=tmp.replace(img_pattern,'<img width="400" src="$1">')
      const url_pattern=/[^"](https?:\/\/[^ \r\n]+)/g
      tmp=tmp.replace(url_pattern,'<a target="_blank" href="$1">$1</a>')
      return tmp.replace(/\n/g, '<br>')
    },
    nitiji: function (str) {
      return str.replace(/:00$/, "").replace("T", " ").replace(/202[0-9]-/, "").replace("-", "/").replace(/^0/, "").replace(/\/0/, "/");
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
    // イベントダイレクト表示
    if(this.$route.params.eid){
      this.getEvent()
    }

  }
}
</script>
<style>
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

</style>
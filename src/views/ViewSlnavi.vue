<template>
  <div class="view row">
    <tag-list ref="appTagList" :mode="mode"
              v-on:selected_tag="actionSelectedTag"></tag-list>
    <div class="view col">
      <messages ref="appMessages"></messages>
      <shop-list ref="appShopList"></shop-list>
      <div class="col ad" v-if="$cookies.get('dev')!=1">
        <!--
          <Adsense 
            data-ad-client="ca-pub-7267369281211974" 
            data-ad-slot="4854478492"
            data-ad-format="auto"
            data-full-width-responsive="yes">
          </Adsense>
        -->
        <!--
        <Adsense 
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="5623461223"
          ins-style="width:728px;height:90px;"
          data-ad-format=""
          data-full-width-responsive="no">
        </Adsense>
        -->
        <!--
        <Adsense 
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="2039245917"
          ins-style="width:728px;height:150px;"
          data-ad-format=""
          data-full-width-responsive="no">
        </Adsense>
        -->
        <!--
        <Adsense 
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="5610007024"
          ins-style="width:728px;height:120px;"
          data-ad-format=""
          data-full-width-responsive="no">
        </Adsense>
        -->
        <!--
        <Adsense 
          data-ad-client="ca-pub-7267369281211974"
          data-ad-slot="3156886463"
          ins-style="width:800px;height:120px;"
          data-ad-format=""
          data-full-width-responsive="no">
        </Adsense>
        -->
        <!--
        <table>
          <tr><td >
          <Adsense
            data-ad-client="ca-pub-7267369281211974" 
            data-ad-slot="4854478492"
            ins-style="display:inline-block;width:100%;height:120px;"
            data-ad-format=""
            data-full-width-responsive="">
          </Adsense>
          </td>
          <td>
          <Adsense
            data-ad-client="ca-pub-7267369281211974" 
            data-ad-slot="4854478492"
            ins-style="display:inline-block;width:100%;height:120px;"
            data-ad-format=""
            data-full-width-responsive="">
          </Adsense>
          </td></tr>
          </table>
        -->
        <Adsense
          data-ad-client="ca-pub-7267369281211974" 
          data-ad-slot="4854478492"
          ins-style="display:inline-block;width:80%;height:120px;"
          data-ad-format=""
          data-full-width-responsive="">
        </Adsense>
        <!--
        <template v-if="mode=='e'">
            <Adsense
              data-ad-client="ca-pub-7267369281211974" 
              data-ad-slot="4854478492"
              ins-style="display:inline-block;width:80%;height:120px;"
              data-ad-format=""
              data-full-width-responsive="">
            </Adsense>
        </template>
        <template v-else-if="mode=='c'">
          <Adsense
            data-ad-client="ca-pub-7267369281211974" 
            data-ad-slot="1881928276"
            ins-style="display:inline-block;width:80%;height:120px;"
            data-ad-format=""
            data-full-width-responsive="">
          </Adsense>
        </template>
        <template v-else>
          <span>
          <Adsense
            data-ad-client="ca-pub-7267369281211974" 
            data-ad-slot="4351011658"
            ins-style="display:inline-block;width:80%;height:120px;"
            data-ad-format=""
            data-full-width-responsive="">
          </Adsense>
          </span>
        </template>
        -->

      </div>

      <event-list ref="appEventList"></event-list>
      <news ref="appNews"></news>
      <!--
        <audio id="audio" :src="stream_url" :autoplay="stream_play" type="audio/mpeg">      
        Your browser does not support the audio element.
        </audio>
        <audio id="audioc" :src="stream_url+'/;'" :autoplay="stream_play" type="audio/mpeg">
        Your browser does not support the audio element.
        </audio>
      -->
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
  props: ['mode'],
  data: function () {
    return {
      tagid: ACTIVE_SHOP_TAGID,
      searchword: this.$route.params.searchword,
      event_data:{},
      stream_url: '',
      stream_play: 'autoplay'
    }
  },
  components: {
    TagList,
    News,
    Messages,
    ShopList,
    EventList,
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
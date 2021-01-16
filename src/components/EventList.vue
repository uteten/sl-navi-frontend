// INTERVAL_RELOAD_EVENT(600秒)毎に EVENT_SOURCE を取得

// 48時間以内に開始 もしくは開催中
<template>
  <div
    id="events"
    class="col events"
  >
    <div class="events_top">
      ２４時間以内のイベント
    </div>
    <ul
      id="events"
      class="event_list"
    >
      {{ messageNoEvent }}
      <li
        v-for="event in events"
        :id="event.id"
        :key="event.id"
        :value="event.id"
        class="event_item"
        tabindex="0"
      >
        <div
          class="event_data_top"
          :style="'background:'+event.color"
          v-html="event.genre.name+nowOpen2(event)"
        />
        <ul
          class="event_data"
          :style="'border: 2px solid '+event.color+';'"
        >
          <li>
            <img
              :src="event.img_url"
              class="event_image"
              @click="$ga.event('event', 'click_eventflag', event.title)"
            >
          </li>
          <li>{{ nitiji(event.start_time)+" 〜 "+nitiji(event.end_time) }}</li>
        </ul>
        <!-- ポップアップの中身 -->
        <b-popover
          triggers="click blur"
          placement="left"
          style="display:none"
          :target="String(event.id)"
        >
          <img
            class="event_info_image"
            :src="event.img_url"
          >
          <dl class="dl-horizontal">
            <dt>タイトル</dt><dd><a :href="'/event/'+event.id">{{ event.title }}</a></dd>
            <dt>形式</dt><dd>{{ event.genre.name }}</dd>
            <dt>期間</dt><dd>{{ nitiji(event.start_time)+" 〜 "+nitiji(event.end_time) }}</dd>
            <dt>場所</dt><dd>
              <a
                target="_blank"
                :href="event.map_url"
                @click="$ga.event('event', 'click_mapurl', event.title)"
              >{{ event.map_url }}</a>
            </dd>
            <dt>詳細</dt><dd v-html="escapeHtml(event.description)" />
            <dt>投稿</dt>
            <dd>
              Posted by
              <a
                v-if="event.created_by.name.indexOf('.')==-1"
                target="_blank"
                :href="'https://twitter.com/'+event.created_by.name"
              >@{{ event.created_by.name }}</a>
              <span v-else>{{ event.created_by.name }}</span>
            </dd>

            <dt>SNS共有</dt>
            <dd>
              <ShareNetwork
                network="Twitter"
                :url="'https://sl-navi.com/event/'+event.id"
                :title="event.title "
                :description="event.description"
                hashtags="secondlife,sljp"
                sns_twitter_user="SL_uten"
              >
                <img
                  class="sns_icon"
                  src="https://sl-navi.com/static/twitter.png"
                >
              </ShareNetwork>
              <ShareNetwork
                network="Facebook"
                :url="'https://sl-navi.com/event/'+event.id"
                :title="event.title "
                :description="event.description"
                hashtags="secondlife,sljp"
                sns_twitter_user="SL_uten"
              >
                <img
                  class="sns_icon"
                  src="https://sl-navi.com/static/facebook.png"
                >
              </ShareNetwork>
            </dd>
          </dl>
        </b-popover>
      </li>
    </ul>
    <div align="right">
      <router-link to="/createEvent">
        <span class="badge badge-danger">イベント登録はここをクリック</span>
      </router-link>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueSocialSharing from 'vue-social-sharing'
Vue.use(VueSocialSharing)

Vue.prototype.$axios = axios

var INTERVAL_RELOAD_EVENT = 600
var EVENT_SOURCE = '//sl-navi.com/event/api/slevent/open_within/1'
export default {
  name: 'EventList',
  props: {
    'mode': {
      type: String,
      default: 'k'
    }
  },
  data: function () {
    return {
      events: [],
      messageNoEvent: ''
    }
  },
  mounted () {
    var that = this
    this.$setInterval(() => {
      that.getEvents()
    }, 1000 * INTERVAL_RELOAD_EVENT)
  },
  methods: {
    twitterUrl: function (event) {
      var url = encodeURIComponent('https://sl-navi.com/event/' + event.id)
      var txt = encodeURIComponent(event.title)
      return 'https://twitter.com/intent/tweet?text=' + txt + '&hashtags=slnavi&url=' + url
    },
    _nowOpen: function (start, end) {
      const now = new Date()
      start = new Date(start)
      end = new Date(end)
      if (start < now && now < end) {
        now.setHours(now.getHours() + 24)
        if (now > end) {
          return 2 // 24時間以内に終了
        } else {
          return 1 // 長期開催
        }
      } else {
        return start - now
      }
    },
    nowOpen2: function (event) {
      const nowOpen = this._nowOpen(event.start_time, event.end_time)
      if (nowOpen <= 2) {
        if (event.long_duration && nowOpen === 2) {
          return '<span class=\'badge badge-info\'>長期開催中</span><span class=\'badge badge-danger\'>最終日<span>'
        } else if (event.long_duration) {
          return '<span class=\'badge badge-info\'>長期開催中<span>'
        } else {
          return '<span class=\'badge badge-primary\'>開催中<span>'
        }
      } else {
        // return '('+Math.round(nowOpen/60/60/1000)+'時間後に開催)'
        return ''
      }
    },
    async getEvents () {
      await axios.get(EVENT_SOURCE).then(res => {
        this.events = []
        for (const z of res.data) {
          if (!z['long_duration']) {
            this.events.push(z)
          }
        }
        for (const z of res.data) {
          if (z['long_duration']) {
            this.events.push(z)
          }
        }
        if (!this.events[0]) {
          this.messageNoEvent = '直近のイベント情報はありません（みんな登録してねっ）'
        }
      })
    }
  }
}
</script>

<style scoped>
  /* ====  EventList.vue ==== */

  /* ポップオーバー系 */
  .popover {
    max-width: 650px;
  }

  .popover-header{
    background: #fdf0e0;
    border-bottom: dashed 2px #ffb03f;
    padding: 0.3em 0.5em 0.3em 0.5em;
  }

  .popover {
    border: outset 1px #ffb03f;
    border-radius: 9px;
  }
  .events{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 0;
    margin-left: 15px;
    margin-bottom: 15px;
  }
  .events_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }

  .event_list{
    padding: 0.2em 0 0.2em 0;
    margin: 0;
  }
  .event_item{
    margin:4px;
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .event_image{
    padding: 0;
    width: 150px;
    height: 150px;
  }

  .event_data_top{
    font-size: small;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0 0.7em;
    list-style-type: none!important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
  }
  .event_data_top_memo{
    font-size: xx-small;
    color: #aa0000;
  }

  .event_data{
    padding: 0;
    background-color: #ffe3b3;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .event_data li{
    padding: 0;
    margin: 0 5px 0 5px;
    color:#666666;
    font-size:x-small;
    list-style: none;
    font-weight: bold;
  }
  .event_info_image{
    padding: 0;
    max-width: 600px;
  }
  .tweet{
    color:#ffffff;
    background-color: #1e97ee;
    padding: 2px 7px 5px 7px;
    margin: 0px;
    border-radius: 5px;
  }
  .tweeticon{
    width:14px;
    height:14px;
  }
  .sns_icon{
    width:20px;
    height:20px;
    margin: 5px;
  }

</style>

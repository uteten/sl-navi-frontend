// INTERVAL_RELOAD_EVENT(600秒)毎に EVENT_SOURCE を取得

// 48時間以内に開始 もしくは開催中
<template>
  <div id="events" class="col events">
    <div class="events_top">２４時間以内のイベント</div>
    <ul id="events" class="event_list">
      {{ message_no_event }}
        <li v-for = "event in events"
            :key ="event.id"
            :value = "event.id"
            :id="event.id"
            class = "event_item"
            tabindex="0">
            <div class="event_data_top" v-html="event.genre.name+nowOpen2(event)"
            :style="'background:'+event.color">
            </div>
            <ul class="event_data"
            :style="'border: 2px solid '+event.color+';'">
              <li><img @click="$ga.event('event', 'click_eventflag', event.title)" :src="event.img_url" class="event_image" ></li>
              <li>{{ nitiji(event.start_time)+" 〜 "+nitiji(event.end_time) }}</li>
            </ul>
            <!-- ポップアップの中身 -->
            <b-popover triggers="click blur" placement="left" style="display:none"
                        :target="String(event.id)"
            >
                <img class="event_info_image" :src="event.img_url">
                <dl class="dl-horizontal">
                    <dt>タイトル</dt><dd><a :href="'/event/'+event.id">{{ event.title }}</a></dd>
                    <dt>形式</dt><dd>{{ event.genre.name }}</dd>
                    <dt>期間</dt><dd>{{ nitiji(event.start_time)+" 〜 "+nitiji(event.end_time) }}</dd>
                    <dt>場所</dt><dd><a @click="$ga.event('event', 'click_mapurl', event.title)"  target=_blank :href="event.map_url">{{ event.map_url }}</a></dd>
                    <dt>詳細</dt><dd v-html="escape_html(event.description)"></dd>
                    <dt>投稿</dt>
                    <dd>Posted by 
                        <a v-if="event.created_by.name.indexOf('.')==-1" target=_blank :href="'https://twitter.com/'+event.created_by.name">@{{ event.created_by.name }}</a>
                        <span v-else>{{ event.created_by.name }}</span>
                    </dd>


                    <dt>SNS共有</dt>
                    <dd>
                      <ShareNetwork network="Twitter" :url="'https://sl-navi.com/event/'+event.id"
                        :title="event.title " :description="event.description"
                        hashtags="secondlife,sljp" sns_twitter_user="SL_uten">
                          <img class="sns_icon" src="https://sl-navi.com/static/twitter.png">
                      </ShareNetwork>
                      <ShareNetwork network="Facebook" :url="'https://sl-navi.com/event/'+event.id"
                        :title="event.title " :description="event.description"
                        hashtags="secondlife,sljp" sns_twitter_user="SL_uten">
                          <img class="sns_icon" src="https://sl-navi.com/static/facebook.png">
                      </ShareNetwork>
                    </dd>
                </dl>
            </b-popover>
        </li>
    </ul>
    <div align="right">
      <router-link to="/createEvent"><span class="badge badge-danger">イベント登録はここをクリック</span></router-link>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import VueSocialSharing from 'vue-social-sharing'
Vue.use(VueSocialSharing)

Vue.prototype.$axios = axios

var INTERVAL_RELOAD_EVENT= 600
var EVENT_SOURCE = '//sl-navi.com/event/api/slevent/open_within/1'
export default {
  name: 'EventList',
  props: ['mode'],
  data: function () {
    return {
      events: [],
      message_no_event: ""
    }
  },
  methods: {
    twitterUrl: function(event) {
      var url = encodeURIComponent('https://sl-navi.com/event/'+event.id)
      var txt = encodeURIComponent(event.title)
      return  'https://twitter.com/intent/tweet?text=' + txt + '&hashtags=slnavi&url='+url
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
      //const img_pattern=/\[ *(https?:\/\/[^\]]+) *\]/g
      const img_pattern=/(https?:\/\/)(.*)(png|gif|jpg|jpeg)([a-zA-Z0-9.\-&=;%$]*)/gi
      tmp=tmp.replace(img_pattern,'<img width="400" src="$1$2$3">')
      const url_pattern=/([^"])(https?:\/\/[^ )\r\n]+)/g
      tmp=tmp.replace(url_pattern,'$1<a target="_blank" href="$2">$2</a>')
      return tmp.replace(/\n/g, '<br>')
    },
    nitiji: function (str) {
      return str.replace(/:00$/, "").replace("T", " ").replace(/202[0-9]-/, "").replace("-", "/").replace(/^0/, "").replace(/\/0/, "/");
    },
    _formatDate:function (date, format) {
      format = format.replace(/YYYY/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
      format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3));
      return format;
    },
    _nowOpen: function (start,end){
      // let now=this._formatDate(new Date(),'YYYY-MM-DDThh:mm:ss')
      let now=new Date()
      start=new Date(start)
      end=new Date(end)
      if(start<now && now<end ){
        now.setHours(now.getHours()+24)
        if(now>end){
          return 2 // 24時間以内に終了
        }else{
          return 1 // 長期開催
        }
      }else{
        return start-now
      }
    },
    nowOpen2: function (event){
      let now_open=this._nowOpen(event.start_time,event.end_time)
      if(now_open<=2){
        if(event.long_duration && now_open==2){
          return '<span class=\'badge badge-info\'>長期開催中</span><span class=\'badge badge-danger\'>最終日<span>'
        }else if(event.long_duration){
          return '<span class=\'badge badge-info\'>長期開催中<span>'
        }else{
          return '<span class=\'badge badge-primary\'>開催中<span>'
        }
      }else{
        // return '('+Math.round(now_open/60/60/1000)+'時間後に開催)'
        return ''
      }
    },
    async getEvents (){
      await axios.get(EVENT_SOURCE).then(res => {
        this.events=[]
        for (let z of res.data) {
          if(!z["long_duration"]){
            this.events.push(z)
          }
        }
        for (let z of res.data) {
          if(z["long_duration"]){
            this.events.push(z)
          }
        }

      if(!this.events[0]){
          this.message_no_event="直近のイベント情報はありません（みんな登録してねっ）"
        }
      })
    }
  },
  mounted () {
      var that=this
      this.$setInterval(() => {
        that.getEvents()
      }, 1000*INTERVAL_RELOAD_EVENT)

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

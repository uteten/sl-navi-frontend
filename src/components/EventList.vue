// 48時間以内に開始 もしくは開催中
// 10分に1回自動更新
<template>
  <div id="events" class="col events">
    <div class="events_top">最近のイベント</div>
    <ul id="events" class="event_list">
      {{ message_no_event }}
        <li v-for = "event in events"
            :key ="event.id"
            :value = "event.id"
            :id="event.id"
            class = "event_item"
            tabindex="0">
            <div class="event_data_top" v-html="event.genre.name+
            (nowOpen(event.start_time,event.end_time) ? '<span class=\'badge badge-primary\'>開催中<span>':'')"></div>

            
            <ul class="event_data">
              <li><img :src="event.img_url" class="event_image" ></li>
              <li>{{ nitiji(event.start_time)+" 〜 "+nitiji(event.end_time) }}</li>
            </ul>
            <!-- ポップアップの中身 -->
            <b-popover triggers="click blur" placement="left" style="display:none"
                        :target="String(event.id)"
            >
                <img class="event_info_image" :src="event.img_url">
                <dl class="dl-horizontal">
                    <dt>タイトル</dt><dd>{{ event.title }}</dd>
                    <dt>形式</dt><dd>{{ event.genre.name }}</dd>
                    <dt>期間</dt><dd>{{ nitiji(event.start_time)+" 〜 "+nitiji(event.end_time) }}</dd>
                    <dt>場所</dt><dd><a target=_blank :href="event.map_url">{{ event.map_url }}</a></dd>
                    <dt>詳細</dt><dd v-html="escape_html(event.description)"></dd>
                    <dt>投稿</dt><dd>Posted by <a target=_blank :href="'https://twitter.com/'+event.created_by.name">@{{ event.created_by.name }}</a></dd>
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
Vue.prototype.$axios = axios


var EVENT_SOURCE = '//sl-navi.com/event/api/slevent/open_within/2'
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
      const url_pattern=/(https?:\/\/[^ \r\n]+)/g
      return tmp.replace(url_pattern,'<a target="_blank" href="$1">$1</a>').replace(/\n/g, '<br>')
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
    nowOpen: function (start,end){
      let now=new Date()
      now=this._formatDate(now,'YYYY-MM-DDThh:mm:ss')
      if(start<now && now<end ){
        return 1
      }else{
        return 0
      }
    },
    async getEvents (){
      await axios.get(EVENT_SOURCE).then(res => {
        this.events=[]
        for (var z of res.data) {
          this.events.push(z)
        }
        console.log("hoge")

      if(!this.events[0]){
          this.message_no_event="直近のイベント情報はありません（みんな登録してねっ）"
        }
      })
    }
  },
  mounted () {
      var that=this
      this.intervalId = setInterval(function () {
        that.getEvents()
      }, 1000*600)
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
    font-size: small;
    list-style: none;
    font-weight: bold;
  }
  .event_info_image{
    padding: 0;
    max-width: 600px;
  }

</style>

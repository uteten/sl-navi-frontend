<template>
<div class="view">
  <div align="right">
    <router-link to="/createEvent"><span class="badge badge-danger">イベント登録はここをクリック</span></router-link>
  </div>
  <FullCalendar ref="fullCalendar" :options="calendarOptions" />
  <ul>
      <li v-for="z in legend" :key=z.color class="list-inline-item"><font :color=z.color>■</font>{{ z.name }}</li>
  </ul>
  <b-modal ref="my-modal"  v-model="showModal"  :title=ed_title class="modal fade" size="lg" hide-footer>
      <img class="flag" :src="ed_img">
      <dl class="dl-horizontal">
          <dt>形式</dt><dd>{{ ed_genre }}</dd>
          <dt>期間</dt><dd>{{ ed_span}}</dd>
          <dt>場所</dt><dd><a target=_blank :href="ed_map">{{ ed_map }}</a></dd>
          <dt>詳細</dt><dd v-html="ed_desc"></dd>
          <dt>SNS共有</dt>
          <dd>
            <ShareNetwork network="Twitter" :url="'https://sl-navi.com/event/'+ed_id"
              :title="ed_title " :description="ed_desc"
              hashtags="secondlife,sljp" sns_twitter_user="SL_uten">
                <img class="sns_icon" src="https://sl-navi.com/static/twitter.png">
            </ShareNetwork>
            <ShareNetwork network="Facebook" :url="'https://sl-navi.com/event/'+ed_id"
              :title="ed_title " :description="ed_desc"
              hashtags="secondlife,sljp" sns_twitter_user="SL_uten">
                <img class="sns_icon" src="https://sl-navi.com/static/facebook.png">
            </ShareNetwork>
          </dd>
          <dt>投稿</dt>
          <dd>Posted by 
              <a v-if="ed_by.indexOf('.')==-1" target=_blank :href="'https://twitter.com/'+ed_by">@{{ ed_by }}</a>
              <span v-else>{{ ed_by }}</span>
          </dd>
      </dl>
      <button v-if="username==ed_by||username=='SL_Uten'||username=='uten'" @click="deleteEvent(ed_id)" class="form-control">削除</button>
  </b-modal>
  <div align="right">
    <router-link to="/createEvent"><span class="badge badge-danger">イベント登録はここをクリック</span></router-link>
  </div>
</div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
//import listPlugin from '@fullcalendar/list';

//import interactionPlugin from '@fullcalendar/interaction'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
import axios from 'axios'
import VueSocialSharing from 'vue-social-sharing'

Vue.prototype.$axios = axios
Vue.use(BootstrapVue) // added
Vue.use(IconsPlugin)
Vue.use(VueSocialSharing)


var LOGIN_STATUS_URL = '//sl-navi.com/event/api/user'
var GENRE_SOURCE = '//sl-navi.com/event/api/genre'
var EVENT_SOURCE = '//sl-navi.com/event/api/slevent'
export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  filters: {
    'twitter_or_sl': function (z) {
      if(z.indexOf(".")>0){
        return ''
      }else{
        return 'https://twitter.com/'+z
      }
    }
  },
  data () {
    return {
      calendarOptions: {
        locale: 'en',
        firstDay: 1,
        plugins: [ dayGridPlugin, timeGridPlugin ],
        initialView: 'dayGridMonth',
        eventSources: [EVENT_SOURCE],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        eventTimeFormat: { // like '14:30:00'
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        },
        eventClick: function(e) {
          this.popup(e)
        }.bind(this)
      },
      legend: [],
      showModal:false,
      username: '',
      csrftoken: '',
      ed_id: '',
      ed_title: '',
      ed_img: '',
      ed_genre: '',
      ed_span: '',
      ed_map: '',
      ed_desc: '',
      ed_by: ''
    }
  },
  methods: {
    twitterUrl: function(id,title) {
      var url = encodeURIComponent('https://sl-navi.com/event/'+id)
      var txt = encodeURIComponent(title)
      return  'https://twitter.com/intent/tweet?text=' + txt + '&hashtags=slnavi&url='+url
    },
    popup: function (e){
      let ee=e.event;
      this.ed_id=ee.id
      this.ed_title=ee.title
      this.ed_img=ee.extendedProps.img_url
      this.ed_genre=ee.extendedProps.genre.name
      this.ed_span=this.nitiji(ee.extendedProps.start_time)+" 〜 "+this.nitiji(ee.extendedProps.end_time)
      this.ed_map=ee.extendedProps.map_url
      this.ed_desc=this.escape_html(ee.extendedProps.description)
      this.ed_by=ee.extendedProps.created_by.name
      this.$refs['my-modal'].show()
      this.$router.push('/event/' + ee.id).catch(err => {console.log(err)})
    },
		getCookie: function (name) {
			let cookieValue = null;
			if (document.cookie && document.cookie !== '') {
					const cookies = document.cookie.split(';');
					for (let i = 0; i < cookies.length; i++) {
							const cookie = cookies[i].trim();
							// Does this cookie string begin with the name we want?
							if (cookie.substring(0, name.length + 1) === (name + '=')) {
									cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
									break;
							}
					}
			}
			return cookieValue;
		},
    deleteEvent: function (event_id){
			const headers ={
				'X-CSRFTOKEN': this.csrftoken
			}
      axios.delete(EVENT_SOURCE+"/"+event_id, {headers: headers}
			).then(res =>{
				alert("削除に成功しました")
        this.$refs['my-modal'].hide()
        let calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.refetchEvents()
				console.log(res)
      }).catch(err=>{
				console.log(["error",err])
				if(err.response.status==401){
          alert("削除に失敗しました。認証情報が確認できないのでログインしてから再実行してください")
				}else if(err.response.status==403){
          alert("削除に失敗しました。投稿者した記事しか削除できません")
				}else{
					alert("削除に失敗しました。すでに削除済みかも？")
        }
        this.$refs['my-modal'].hide()
        let calendarApi = this.$refs.fullCalendar.getApi()
        calendarApi.refetchEvents()
			})
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
      const url_pattern=/[^"](https?:\/\/[^ \r\n]+)/g
      tmp=tmp.replace(url_pattern,'<a target="_blank" href="$1">$1</a>')
      return tmp.replace(/\n/g, '<br>')

    },
    nitiji: function (str) {
      return str.replace(/:00$/, "").replace("T", " ").replace(/202[0-9]-/, "").replace("-", "/").replace(/^0/, "").replace(/\/0/, "/");
    },
    async getUsername () {
			await axios.get(LOGIN_STATUS_URL).then(res => {
        if(res.data[0]){
          this.username=res.data[0].username
        }else{
          this.username=""
        }
				console.log(["username=",this.username,res.data])
      }).catch(err=>{
				console.log(err)
				this.username=""
      })
    }
  },
  async mounted(){
    // genreの凡例
    await axios.get(GENRE_SOURCE).then(res => {
      this.legend=res.data
    })
    this.getUsername()
    this.csrftoken = this.getCookie('csrftoken')
   // イベントダイレクト表示
    if(this.$route.params.eid){
      console.log("nya")
      var EVENT_SOURCE = '//sl-navi.com/event/api/slevent/'
      await axios.get(EVENT_SOURCE+this.$route.params.eid).then(res => {
        let ee=res.data;
        this.ed_id=ee.id
        this.ed_title=ee.title
        this.ed_img=ee.img_url
        this.ed_genre=ee.genre.name
        this.ed_span=this.nitiji(ee.start_time)+" 〜 "+this.nitiji(ee.end_time)
        this.ed_map=ee.map_url
        this.ed_desc=this.escape_html(ee.description)
        this.ed_by=ee.created_by.name
        this.$refs['my-modal'].show()
        this.showModal=true
      })
    }


}
}
</script>
<style scorped>
    .textarea{
	grid-row:20;
}
.fc-day-sat {
    background-color: #eaf4ff;
}
.fc-day-sun {
    background-color: #ffeaea;
}
.flag{
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
.fc a {
    color: inherit;
    text-decoration: none;
    cursor: pointer;
}
.fc-toolbar-title {
    font-weight:900;
    color: #ffaa00;
}
.fc .fc-button-primary:not(:disabled).fc-button-active{
    background-color: #ffaa00;
    border-color: var(--fc-button-border-color,#ff8800);
}
.fc .fc-button-primary{
    font-weight:900;
    background-color: #ffcc44;
    border-color: var(--fc-button-border-color,#ff8800);
}
.fc .fc-button:disabled{
    background-color: #ffaa00;
    border-color: var(--fc-button-border-color,#ff8800);
}
.fc-daygrid-dot-event .fc-event-title {
  font-weight: normal;
}
.fc-h-event .fc-event-main {
    color: #000;
    color: var(--fc-event-text-color,#000);
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
  height:14px
}
.sns_icon{
  width:20px;
  height:20px;
  margin: 5px;
}

</style>

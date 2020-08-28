<template>
<div class="view">
    <div align="right"><a href="/event/create"><span class="badge badge-danger">イベント登録はここをクリック</span></a></div>
    <ul>
        <li v-for="z in legend" :key=z.color class="list-inline-item"><font :color=z.color>■</font>{{ z.name }}</li>
    </ul>
    <FullCalendar :options="calendarOptions" />
    <ul>
        <li v-for="z in legend" :key=z.color class="list-inline-item"><font :color=z.color>■</font>{{ z.name }}</li>
    </ul>
    <b-modal ref="my-modal" :title=ed_title class="modal fade" size="lg" hide-footer>
        <img class="flag" :src="ed_img">
        <dl class="dl-horizontal">
            <dt>形式</dt><dd>{{ ed_genre }}</dd>
            <dt>期間</dt><dd>{{ ed_span}}</dd>
            <dt>場所</dt><dd><a target=_blank :href="ed_map">{{ ed_map }}</a></dd>
            <dt>詳細</dt><dd v-html="ed_desc"></dd>
            <dt>投稿</dt><dd>Posted by <a target=_blank :href="ed_by|twitter">@{{ ed_by }}</a></dd>
        </dl>
    </b-modal>
    <div align="right"><a href="/event/create"><span class="badge badge-danger">イベント登録はここをクリック</span></a></div>
</div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
//import interactionPlugin from '@fullcalendar/interaction'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios
Vue.use(BootstrapVue) // added
Vue.use(IconsPlugin)


var GENRE_SOURCE = '//sl-navi.com/event/api/genre'
var EVENT_SOURCES = ['//sl-navi.com/event/api/slevent?format=json']
export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  filters: {
    'twitter': function (z) {
      return 'https://twitter.com/'+z
    }
  },
  data () {
    return {
      calendarOptions: {
        locale: 'ja',
        firstDay: 1,
        plugins: [ dayGridPlugin, timeGridPlugin ],
        initialView: 'dayGridMonth',
        eventSources: EVENT_SOURCES,
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
    popup: function (e){
      let ee=e.event;
      this.ed_title=ee.title
      this.ed_img=ee.extendedProps.img_url
      this.ed_genre=ee.extendedProps.genre.name
      this.ed_span=this.nitiji(ee.extendedProps.start_time)+" 〜 "+this.nitiji(ee.extendedProps.end_time)
      this.ed_map=ee.extendedProps.map_url
      this.ed_desc=this.escape_html(ee.extendedProps.description)
      this.ed_by=ee.extendedProps.created_by.name
      this.$refs['my-modal'].show()
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
      return tmp.replace(/\n/g,"<br>");
    },
    nitiji: function (str) {
      return str.replace(/:00$/, "").replace("T", " ").replace(/202[0-9]-/, "").replace("-", "/").replace(/^0/, "").replace(/\/0/, "/");
    }
  },
  async mounted(){
   // genreの凡例
      await axios.get(GENRE_SOURCE).then(res => {
        this.legend=res.data
      })
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

}
    /*
.fc-toolbar-title {
    color: #ffaa00;
}
.fc .fc-button-primary:not(:disabled).fc-button-active{
    background-color: #ffaa00;
    border-color: var(--fc-button-border-color,#ff8800);
}
.fc .fc-button-primary{
    background-color: #ffcc44;
    border-color: var(--fc-button-border-color,#ff8800);
}
.fc .fc-button:disabled{
    background-color: #ffaa00;
    border-color: var(--fc-button-border-color,#ff8800);
}
*/
.modal-content{
	border-radius: 10px;
	border: solid 2px #ffb03f;
}
</style>
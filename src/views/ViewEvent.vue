<template>
  <div class="view">
    <div align="right">
      <router-link to="/createEvent">
        <span class="badge badge-danger">イベント登録はここをクリック</span>
      </router-link>
    </div>
    <FullCalendar
      ref="fullCalendar"
      :options="calendarOptions"
    />
    <ul>
      <li
        v-for="z in legend"
        :key="z.color"
        class="list-inline-item"
      >
        <font :color="z.color">
          ■
        </font>{{ z.name }}
      </li>
    </ul>
    <b-modal
      ref="my-modal"
      v-model="showModal"
      :title="edTitle"
      class="modal fade"
      size="lg"
      hide-footer
    >
      <img
        class="flag"
        :src="edImg"
      >
      <dl class="dl-horizontal">
        <dt>形式</dt><dd>{{ edGenre }}</dd>
        <dt>期間</dt><dd>{{ edSpan }}</dd>
        <dt>場所</dt><dd>
          <a
            target="_blank"
            :href="edMap"
          >{{ edMap }}</a>
        </dd>
        <dt>詳細</dt><dd v-html="edDesc" />
        <dt>SNS共有</dt>
        <dd>
          <ShareNetwork
            network="Twitter"
            :url="'https://sl-navi.com/event/'+edId"
            :title="edTitle "
            :description="edDesc"
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
            :url="'https://sl-navi.com/event/'+edId"
            :title="edTitle "
            :description="edDesc"
            hashtags="secondlife,sljp"
            sns_twitter_user="SL_uten"
          >
            <img
              class="sns_icon"
              src="https://sl-navi.com/static/facebook.png"
            >
          </ShareNetwork>
        </dd>
        <dt>投稿</dt>
        <dd>
          Posted by
          <a
            v-if="edBy.indexOf('.')==-1"
            target="_blank"
            :href="'https://twitter.com/'+edBy"
          >@{{ edBy }}</a>
          <span v-else>{{ edBy }}</span>
        </dd>
      </dl>
      <template v-if="username==edBy||username=='SL_Uten'||username=='uten'">
        変更する
        <router-link :to="'/updateEvent/'+edId">
          <button class="badge badge-warning">
            登録内容の更新
          </button>
        </router-link>
        <button
          class="badge badge-danger"
          @click="deleteEvent(edId)"
        >
          登録内容の削除
        </button>
      </template>
    </b-modal>
    <div align="right">
      <router-link to="/createEvent">
        <span class="badge badge-danger">イベント登録はここをクリック</span>
      </router-link>
    </div>
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
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

const LOGIN_STATUS_URL = '//sl-navi.com/event/api/user'
const GENRE_SOURCE = '//sl-navi.com/event/api/genre'
const EVENT_SOURCE = '//sl-navi.com/event/api/slevent'
export default {
  components: {
    FullCalendar // make the <FullCalendar> tag available
  },
  filters: {
    'twitter_or_sl': function (z) {
      if (z.indexOf('.') > 0) {
        return ''
      } else {
        return 'https://twitter.com/' + z
      }
    }
  },
  data () {
    return {
      calendarOptions: {
        locale: 'en',
        firstDay: 1,
        plugins: [dayGridPlugin, timeGridPlugin],
        initialView: 'dayGridMonth',
        eventSources: [EVENT_SOURCE],
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        eventTimeFormat: { // like '14:30:00'
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        },
        eventClick: function (e) {
          this.popup(e.event)
        }.bind(this)
      },
      legend: [],
      showModal: false,
      username: '',
      csrftoken: '',
      edId: '',
      edTitle: '',
      edImg: '',
      edGenre: '',
      edSpan: '',
      edMap: '',
      edDesc: '',
      edBy: ''
    }
  },
  async mounted () {
    // genreの凡例
    await axios.get(GENRE_SOURCE).then(res => {
      this.legend = res.data
    })
    this.getUsername()
    this.csrftoken = this.getCookie('csrftoken')
    // イベントダイレクト表示
    if (this.$route.params.eid) {
      await axios.get(EVENT_SOURCE + '/' + this.$route.params.eid).then(res => {
        this.popup(res.data)
      })
    }
  },
  methods: {
    popup: function (e) {
      this.edId = e.id
      this.edTitle = e.title
      if (e.extendedProps) {
        e = e.extendedProps
      }
      this.edImg = e.img_url
      this.edGenre = e.genre.name
      this.edSpan = this.nitiji(e.start_time) + ' 〜 ' + this.nitiji(e.end_time)
      this.edMap = e.map_url
      this.edDesc = this.escapeHtml(e.description)
      this.edBy = e.created_by.name
      this.$refs['my-modal'].show()
      this.showModal = true
      this.$router.push('/event/' + this.edId).catch(err => { console.log(err) })
    },
    deleteEvent: function (eventId) {
      const headers = {
        'X-CSRFTOKEN': this.csrftoken
      }
      axios.delete(EVENT_SOURCE + '/' + eventId, { headers: headers }).then(
        res => {
          alert('削除しました')
          this.$refs['my-modal'].hide()
          this.$refs.fullCalendar.getApi().refetchEvents()
          console.log(['ViewEvent.delete', res])
        }).catch(err => {
        if (err.response.status === 401) {
          alert('削除に失敗しました。認証情報が確認できないのでログインしてから再実行してください')
        } else if (err.response.status === 403) {
          alert('削除に失敗しました。投稿者した記事しか削除できません')
        } else {
          alert('削除に失敗しました。すでに削除済みかも？')
        }
        this.$refs['my-modal'].hide()
        this.$refs.fullCalendar.getApi().refetchEvents()
      })
    },
    async getUsername () {
      await axios.get(LOGIN_STATUS_URL).then(res => {
        if (res.data[0]) {
          this.username = res.data[0].username
        } else {
          this.username = ''
        }
        console.log(['username=', this.username, res.data])
      }).catch(err => {
        console.log(err)
        this.username = ''
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

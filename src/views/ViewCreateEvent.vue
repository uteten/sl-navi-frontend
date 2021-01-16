<template>
  <div class="view">
    <h4 v-if="eid==0">
      イベント登録画面
    </h4>
    <h4 v-else>
      イベント更新画面
    </h4>

    <div class="card-body">
      <form>
        <div class="col-md-8 order-md-1">
          <label>投稿者：</label>
          <template v-if="username">
            <a
              href="javascript:void(0)"
              @click="logout()"
            >{{ username }}(ログアウトする場合はクリックしてください)</a>
          </template>
          <template v-else>
            未ログイン(以下のいずれかで認証してください。)<br>
            <span class="badge badge-info">いずれの認証もSL-Naviでアカウント情報を管理しないため安全です</span><br>
            <ul>
              <li>Twitter認証(<a href="//sl-navi.com/user/login/twitter/?next=/createEvent">ここをクリック</a>)</li>
              <li>
                SL認証(<a
                  target="_blank"
                  href="http://maps.secondlife.com/secondlife/japan%20canvas/102/172/2002"
                >SL内の認証用オブジェクト</a>にタッチし、表示されるURLにこのブラウザでアクセス)
              </li>
            </ul>
          </template>
          <br>
          <p
            v-if="errors.username"
            class="alert alert-danger"
            v-html="errors.username"
          />

          <label for="id_title">イベント名（必須）:</label>
          <input
            id="id_title"
            v-model="title"
            name="title"
            type="text"
            maxlength="64"
            class="form-control"
            required
            @change="checkLogin"
          >
          <p
            v-if="errors.title"
            class="alert alert-danger"
            v-html="errors.title"
          />

          <label for="id_img_url">画像（必須）（UID or URL）:</label>
          <div class="form-row">
            <div class="form-group col-sm-10">
              <input
                id="id_img_url"
                v-model="imgUrl"
                name="img_url"
                type="text"
                placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX or https://xxx..."
                maxlength="200"
                class="form-control"
                required
              >
            </div>
            <div class="col-sm-2">
              <button
                type="button"
                class="form-control"
                @click="loadImg()"
              >
                画像読込
              </button>
            </div>
            <img
              id="kanban_img"
              :src="loadImgUrl"
              @error="loadImgUrlError(this)"
            >
          </div>
          <p
            v-if="errors.img_url"
            class="alert alert-danger"
            v-html="errors.img_url"
          />

          <label for="id_mode">対象（必須）:</label>
          <select
            id="id_mode"
            v-model="mode"
            name="mode"
            class="form-control"
          >
            <option
              value="k"
              selected
            >
              一般
            </option>
            <option value="e">
              アダルト
            </option>
          </select>
          <p
            v-if="errors.mode"
            class="alert alert-danger"
            v-html="errors.mode"
          />

          <label for="id_genre">ジャンル（必須）:</label>
          <select
            id="id_genre"
            v-model="genre"
            name="genre"
            class="form-control"
            required
          >
            <option value="">
              ---------
            </option>
            <option value="3">
              ライブ
            </option>
            <option value="5">
              ゲーム
            </option>
            <option value="6">
              セール
            </option>
            <option value="7">
              祭り
            </option>
            <option value="1">
              ラジオ
            </option>
            <option value="2">
              ダンス
            </option>
            <option value="9">
              ショー
            </option>
            <option value="8">
              その他
            </option>
          </select>
          <p
            v-if="errors.genre"
            class="alert alert-danger"
            v-html="errors.genre"
          />

          <label for="id_start_time">開始日時（必須）:</label>
          <VueCtkDateTimePicker
            v-model="startTime"
            format="YYYY-MM-DD HH:mm"
            :first-day-of-week="1"
            no-label
            no-header
          />
          <p
            v-if="errors.start_time"
            class="alert alert-danger"
            v-html="errors.start_time"
          />

          <label for="id_end_time">終了日時（必須）:</label>
          <VueCtkDateTimePicker
            v-model="endTime"
            format="YYYY-MM-DD HH:mm"
            :first-day-of-week="1"
            :min-date="startTime"
            no-label
            no-header
          />
          <p
            v-if="errors.end_time"
            class="alert alert-danger"
            v-html="errors.end_time"
          />

          <label for="id_description">詳細（必須）（タグとか使えないです。単なるテキストでお願いします。画像のURLを張ると自動で画像になります）:</label>
          <textarea
            id="id_description"
            v-model="description"
            name="description"
            cols="20"
            rows="20"
            class="form-control"
            required
          />
          <p
            v-if="errors.description"
            class="alert alert-danger"
            v-html="errors.description"
          />

          <label for="id_map_url">マップ（必須）(SIM名に「スペース」があるときは、代わりに「%20」を入力してください）:</label>
          <input
            id="id_map_url"
            v-model="mapUrl"
            name="map_url"
            type="text"
            placeholder="https://maps.secondlife.com/secondlife/SIM-NAME/XXX/YYY/ZZZ"
            maxlength="200"
            class="form-control"
            required
          >
          <p
            v-if="errors.map_url"
            class="alert alert-danger"
            v-html="errors.map_url"
          />

          <label for="id_shop_flag">主催する施設がSL-naviにある場合、その画像UID（任意）:</label>
          <input
            id="id_shop_flag"
            v-model="shopFlag"
            name="shop_flag"
            type="text"
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            maxlength="37"
            class="form-control"
          >
          ※入力すると、施設の看板画像をクリックしたときに、イベント情報のリンクも追加表示します。<br>
          （ただ、イベント開催場所が主催する施設のTPポイントと近い場合は、自動で関連付くので入力不要です)
          <p
            v-if="errors.shop_flag"
            class="alert alert-danger"
            v-html="errors.shop_flag"
          />
          <br><br>
          <div class="form-row">
            <div class="col-sm-2">
              <button
                type="button"
                class="form-control"
                @click="postEvent()"
              >
                <template v-if="eid==0">
                  投稿
                </template>
                <template v-else>
                  更新
                </template>
              </button>
            </div>
          </div>
          <hr>
          ※投稿したデータを削除する際は、ログインした状態でイベントカレンダーからイベントを選択し画面下の[削除]ボタンを押してください
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker)

var LOGIN_STATUS_URL = '//sl-navi.com/event/api/user'
var LOGOUT_URL = '//sl-navi.com/event/api/user/logout'
var EVENT_SOURCE = '//sl-navi.com/event/api/slevent'
var BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
export default {
  name: 'ViewCreateEvent',
  data: function () {
    return {
      loadImgUrl: BLANK_IMG,
      errors: {},
      csrftoken: 'dmy',
      username: '',
      title: '',
      imgUrl: '',
      mode: 'k',
      genre: '',
      startTime: '',
      endTime: '',
      description: '',
      mapUrl: '',
      shopFlag: '',
      eid: 0
    }
  }, watch: {
    startTime: function (val) {
      if (!this.endTime) {
        this.endTime = val
      }
    }
  },
  async mounted () {
    this.getUsername()
    this.csrftoken = this.getCookie('csrftoken')
    // this.csrftoken="testabc"
    console.log(['csrftoken=', this.csrftoken])

    if (this.$route.params.eid) {
      await axios.get(EVENT_SOURCE + '/' + this.$route.params.eid).then(res => {
        const ee = res.data

        this.eid = ee.id
        this.title = ee.title
        this.imgUrl = ee.img_url
        this.loadImgUrl = ee.img_url
        this.genre = ee.genre.id
        this.mode = ee.mode
        this.mapUrl = ee.map_url
        this.startTime = ee.start_time
        this.endTime = ee.end_time
        this.description = ee.description
        this.shopFlag = ee.shop_flag
      })
    }
  },
  methods: {
    checkLogin: function () {
      if (!this.username) {
        alert('先にログイン認証してください')
        this.title = ''
      }
    },
    loadImg: function () {
      this.$delete(this.errors, 'img_url')
      // URLチェックしたあと<img>に表示
      let tmpUrl
      const ret = this.imgUrl.match(/^https:\/\/gyazo.com\/(.*)/)
      if (ret) {
        tmpUrl = 'https://i.gyazo.com/' + ret[1] + '.png'
      } else if (this.imgUrl.match('^(http://|https://)')) {
        tmpUrl = this.imgUrl
      } else if (this.imgUrl.match('[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}')) {
        tmpUrl = 'https://secondlife.com/app/image/' + this.img_url + '/2'
      } else if (this.imgUrl.match('^/static/event_img/')) {
        tmpUrl = this.imgUrl
      } else {
        tmpUrl = ''
      }
      this.imgUrl = tmpUrl
      this.loadImgUrl = this.imgUrl
    },
    loadImgUrlError: function () {
      this.loadImgUrl = BLANK_IMG
      this.$set(this.errors, 'img_url', '画像が読み込めません.入力データを確認してください')
    },
    getCookie: function (name) {
      let cookieValue = null
      if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';')
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim()
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1))
            break
          }
        }
      }
      return cookieValue
    },
    postEvent: function () {
      this.errors = {}
      if (!this.username) {
        this.$set(this.errors, 'username', '↑まずログインしてください')
      }
      if (this.loadImgUrl === BLANK_IMG || this.loadImgUrl !== this.imgUrl) {
        this.$set(this.errors, 'img_url', 'URLもしくはUIDを入力した後、画像読込ボタンを押してください')
      }
      if (!this.mapUrl.match('^(http://|https://)maps.secondlife.com/secondlife/')) {
        this.$set(this.errors, 'map_url', '正しいマップのURLを入力してください')
      }
      // 必須項目チェック
      const keys = ['title', 'genre', 'startTime', 'endTime', 'description']
      for (const z in keys) {
        if (!this[keys[z]]) {
          this.$set(this.errors, keys[z], 'この項目は必須です')
        }
      }
      if (Object.keys(this.errors).length > 0) {
        alert('投稿に失敗しました。投稿内容を確認してください。')
        return
      }
      const headers = {
        'X-CSRFTOKEN': this.csrftoken
      }
      axios.post(EVENT_SOURCE, {
        'eid': this.eid,
        'title': this.title,
        'img_url': this.imgUrl,
        'mode': this.mode,
        'genre': this.genre,
        'start_time': this.startTime,
        'end_time': this.endTime,
        'description': this.description,
        'map_url': this.mapUrl,
        'shop_flag': this.shopFlag
      }, {
        headers: headers
      }).then(res => {
        alert('投稿に成功しました(投稿がWeb反映されるのに1分程度かかります)')
        console.log(res)
        this.title = ''
        this.imgUrl = ''
        this.loadImgUrl = BLANK_IMG
        this.mode = 'k'
        this.genre = ''
        this.startTime = ''
        this.endTime = ''
        this.description = ''
        this.mapUrl = ''
        this.shopFlag = ''
      }).catch(err => {
        console.log(['error', err])
        for (var key in err.response.data) {
          this.$set(this.errors, key, err.response.data[key].join('<br>'))
        }
        if (err.response.status === 403) {
          alert('投稿に失敗しました。認証情報が確認できないか画面遷移がおかしい可能性があります。画面を更新してから投稿してください。')
        } else {
          alert('投稿に失敗しました。投稿内容を確認してください。')
        }
      })
    },
    async logout () {
      await axios.get(LOGOUT_URL).then(res => {
        console.log(res)
        this.username = ''
      })
    },
    async getUsername () {
      let logincode = ''
      if (this.$route.params.logincode) {
        logincode = '/login/' + this.$route.params.logincode
      }
      await axios.get(LOGIN_STATUS_URL + logincode).then(res => {
        if (res.data[0]) {
          this.username = res.data[0].username
          this.csrftoken = this.getCookie('csrftoken')
          console.log(['csrftoken=', this.csrftoken])
        } else {
          this.username = ''
        }
        // console.log(["username=",this.username])
      }).catch(err => {
        console.log(err)
        this.username = ''
      })
    }
  }
}
</script>

<style scorped>
label{
	font-weight: bold;
}
.sl-navi-kanban{
    width: 600px;
    height: 350px;
}
.osirase{
  color: #ffaa00;
}
h4{
  color: #ffaa00;
  border-bottom: dashed 2px #ffb03f;
}
dt{
  float: left;
}

dd{
  margin-left: 80px;
}

</style>

<template>
  <div>
    <h4 v-if="eid==0">
      施設登録/更新画面
    </h4>
    <h4 v-else>
      施設登録/更新画面
    </h4>

    <div class="card-body">
      <form>
        <div class="col-md-8 order-md-1">
          <label>設置者：</label>
          <input
            id="name"
            class="form-control"
          >
          <img
            id="kanban_img"
            :src="loadImgUrl"
          >
          <br>

          <label for="id_title">施設の名前（必須）:</label>
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

          <label for="id_description">お店の紹介文（必須）（タグとか使えないです。単なるテキストでお願いします。）:</label>
          <textarea
            id="id_description"
            v-model="description"
            name="description"
            cols="20"
            rows="4"
            class="form-control"
            required
          />
          <p
            v-if="errors.description"
            class="alert alert-danger"
            v-html="errors.description"
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
          <label for="id_genre">タグ:</label>
          <input
            id="name"
            class="form-control"
          >
          <input
            id="name"
            class="form-control"
          >
          <input
            id="name"
            class="form-control"
          >
          <input
            id="name"
            class="form-control"
          >

          <label for="id_map_url">マップ（必須）:</label>
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
          <label for="id_map_url">スタッフ名</label>
          <input
            id="id_staff1"
            name="staff1"
            type="text"
            maxlength="200"
            class="form-control"
            required
          >
          <p
            v-if="errors.map_url"
            class="alert alert-danger"
            v-html="errors.map_url"
          />

          <label for="id_map_url">センサ範囲 水平距離(m):</label>
          <input
            id="id_map_url"
            v-model="SENSOR_RANGE_XY"
            name="map_url"
            type="text"
            maxlength="200"
            class="form-control"
            required
          >
          <p
            v-if="errors.map_url"
            class="alert alert-danger"
            v-html="errors.map_url"
          />

          <label for="id_map_url">センサ範囲 垂直距離(m):</label>
          <input
            id="id_map_url"
            v-model="SENSOR_RANGE_XY"
            name="map_url"
            type="text"
            maxlength="200"
            class="form-control"
            required
          >
          <p
            v-if="errors.map_url"
            class="alert alert-danger"
            v-html="errors.map_url"
          />

          <label for="id_genre">出勤中のスタッフ名をWebに表示する:</label>
          <select
            id="id_genre"
            v-model="genre"
            name="genre"
            class="form-control"
            required
          >
            <option value="on">
              する
            </option>
            <option value="off">
              しない
            </option>
          </select>
          <p
            v-if="errors.genre"
            class="alert alert-danger"
            v-html="errors.genre"
          />

          <label for="id_genre">訪問者数の性別内訳（女性○人/男性○人)を表示:</label>
          <select
            id="id_genre"
            v-model="genre"
            name="genre"
            class="form-control"
            required
          >
            <option value="on">
              する
            </option>
            <option value="off">
              しない
            </option>
          </select>

          <label for="id_genre">センサのカウント対象（よくわからない人は変更不要):</label>
          <select
            id="id_genre"
            v-model="genre"
            name="genre"
            class="form-control"
            required
          >
            <option value="on">
              同じ土地区画のみカウント
            </option>
            <option value="off">
              所有者の土地全部カウント
            </option>
          </select>

          <label for="id_shop_flag">ホームページ:</label>
          <input
            id="id_shop_flag"
            v-model="shopFlag"
            name="shop_flag"
            type="text"
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
            maxlength="37"
            class="form-control"
          >
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
        </div>
      </form>
    </div>
    <b-modal
      ref="my-modal"
      v-model="showModal"
      title="いべんさデータ取得"
      class="modal fade"
      hide-footer
    >
      http://sl-event.info/?id=xxx
      <div class="form-row">
        <div class="form-group col-sm-7">
          <input
            v-model="idEvensa"
            name="idEvensa"
            type="text"
            placeholder="xxx部分(数字)を入力してください"
            maxlength="200"
            class="form-control"
            required
          >
        </div>
        <div class="col-sm-5">
          <button
            type="button"
            class="form-control"
            @click="evensa"
          >
            読み込み
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import VueCtkDateTimePicker from 'vue-ctk-date-time-picker'
import 'vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css'
Vue.component('VueCtkDateTimePicker', VueCtkDateTimePicker)

const LOGIN_STATUS_URL = '//sl-navi.com/event/api/user'
const LOGOUT_URL = '//sl-navi.com/event/api/user/logout'
const EVENT_SOURCE = '//sl-navi.com/event/api/slevent'
const EVENSA_SOURCE = '//sl-navi.com/event/api/slevent/evensa'

const BLANK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
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
      eid: 0,
      idEvensa: ''
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
        tmpUrl = 'https://secondlife.com/app/image/' + this.imgUrl + '/2'
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
      const headers = {};
      if (this.csrftoken && this.csrftoken !== 'null') {
        headers['X-CSRFTOKEN'] = this.csrftoken;
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
        for (const key in err.response.data) {
          this.$set(this.errors, key, err.response.data[key].join('<br>'))
        }
        if (err.response.status === 403) {
          alert('投稿に失敗しました。認証情報が確認できないか画面遷移がおかしい可能性があります。画面を更新してから投稿してください。')
        } else {
          alert('投稿に失敗しました。投稿内容を確認してください。')
        }
      })
    },
    async evensa () {
      if (this.idEvensa) {
        await axios.get(EVENSA_SOURCE + '/' + this.idEvensa).then(res => {
          const ee = res.data
          this.title = ee.title
          this.imgUrl = ee.img_url
          this.loadImgUrl = ee.img_url
          this.mode = ee.mode
          this.mapUrl = ee.map_url
          this.startTime = ee.start_time
          this.endTime = ee.end_time
          this.description = ee.description
          this.shopFlag = ee.shop_flag
          this.genre = ee.genre
        })
      }
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

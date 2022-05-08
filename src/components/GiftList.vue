<template>
  <div
    id="gifts"
    class="col gifts"
  >
    <div class="gift_top">
      ギフト探し(Twitter抽出)
    </div>
    <div
      v-for="z in gifts"
      :id="z.tid"
      :key="z.tid"
      class="f"
      tabindex="0"
    >
      <img
        class="flag"
        :src="z.img_url"
      >
      <b-popover
        triggers="click blur"
        placement="right"
        style="display:none"
        :target="String(z.tid)"
      >
        <dl>
          <dt>Tweeted at</dt>
          <dd>
            <!--
            <a
              target="_blank"
              :href="'https://twitter.com/'+z.username+'/status/'+String(z.tid)"
            >
            </a>
            -->
            {{ nitiji2(z.created_at) }}
            <span @click="deleteGift(z.tid)">
              .
            </span>
          </dd>
          <dt>Created By</dt>
          <dd>
            <a
              target="_blank"
              :href="'https://twitter.com/'+z.username"
            >
              @{{ z.username }}
            </a>
          </dd>
          <dt>
            Map URL
          </dt>
          <dd>
            <a
              :href="z.map_url"
              target="_blank"
            >
              {{ z.map_url }}
            </a>
          </dd>
          <dt>
            Message
          </dt>
          <dd>
            <div v-html="text2html(z.text)" />
          </dd>
          <dt>
            情報元
          </dt>
          <dd>
            <a
              target="_blank"
              :href="'https://twitter.com/'+z.username+'/status/'+z.tid"
            >
              <img
                class="sns_icon"
                src="https://sl-navi.com/static/twitter.png"
              >
              {{ 'https://twitter.com/'+z.username+'/status/'+z.tid }}
            </a>
          </dd>
        </dl>
        <img
          :src="z.img_url"
          class="gift_img"
        >
        <img
          v-if="z.img_url2"
          :src="z.img_url2"
          class="gift_img"
        >
        <img
          v-if="z.img_url2"
          :src="z.img_url3"
          class="gift_img"
        >
      </b-popover>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const GIFT_SOURCE = '//sl-navi.com/event/api/gift'
const LOGIN_STATUS_URL = '//sl-navi.com/event/api/user'

export default {
  name: 'GiftsList',
  data: function () {
    return {
      gifts: []
    }
  },
  mounted () {
    this.getUsername()
    this.csrftoken = this.getCookie('csrftoken')
    this.getGifts()
  },
  methods: {
    _formatDate: function (date, format) {
      format = format.replace(/YYYY/g, date.getFullYear())
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2))
      format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2))
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
      format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
      return format
    },
    existBlog (z) {
      return (z.blog !== 'http://www.google.com' && z.blog.indexOf('http') === 0)
    },
    async getGifts () {
      await axios.get(GIFT_SOURCE).then(res => {
        this.gifts = res.data
      })
    },
    deleteGift: function (tid) {
      const headers = {
        'X-CSRFTOKEN': this.csrftoken
      }
      axios.delete(GIFT_SOURCE + '/' + tid, { headers: headers }).then(
        res => {
          alert('削除しました')
        }).catch(err => {
        if (err.response.status === 401) {
          alert('削除に失敗しました。認証情報が確認できないのでログインしてから再実行してください')
        } else if (err.response.status === 403) {
          alert('削除に失敗しました。投稿者した記事しか削除できません')
        } else {
          alert(err.response.status)
        }
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

<style scoped>
  .flag {
    width: 150px;
    height: 150px;
  }
  .f{
    margin: 3px;
    position: relative;
    display: inline-block;
    width: 150px;
    height: 150px;
    cursor: pointer;
  }
  .memo{
    align-items: flex-end;
    position: absolute;
    left: 0px;
    bottom: 0px;
    display: flex;
  }
  .popover_title_right{
    align-items: flex-start;
    position: absolute;
    right: 0px;
    top: 3px;
  }
  .popover-header{
    background: #fdf0e0;
    border-bottom: dashed 2px #ffb03f;
    padding: 0.3em 0.5em 0.3em 0.5em;
  }

  .popover {
    max-width: 700px;
    border: outset 1px #ffb03f;
    border-radius: 9px;
  }
.gifts{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 0;
    margin-left: 15px;
    margin-bottom: 15px;
  }
  .gift_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  .sns_icon{
    width:15px;
    height:15px;
    margin: 0px;
  }
  .event_info{
    font-size: 75%;
    font-weight: 700;
  }
  .gift_img{
    width: 270px;
  }

  hr{
    border:none;
    border-bottom: dashed 2px #ffb03f;
  }
  h4{
    color: #ffaa00;
    border-bottom: dashed 2px #ffb03f;
  }
  .counter{
    text-align: right;
    font-size: 85%;
  }
  .counter_ele{
    margin-right:10px;
  }
</style>

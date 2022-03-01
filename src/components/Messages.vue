// INTERVAL_GET_MESSAGE(30秒)毎にMESSAGE_SOURCEを取得
// INTERVAL_RELOAD_MESSAGE(7秒)毎に切り替え

<template>
  <div
    v-if="messages"
    id="messages"
    class="col messages ticker box"
  >
    <article class="media">
      <!--
        <span class="message-header">News</span>
      -->
      <div class="media-content">
        <transition
          name="fade"
          tag="div"
          mode="out-in"
        >
          <template v-for="z in messages">
            <div
              v-if="z[0]"
              :key="z[1].shop.flag+z[1].time"
              class="msg"
            >
              <b>{{ z[1].time|time_only }} {{ z[1].shop.h==1 ? "アダルト施設":"一般施設" }}
                [<a
                  :href="'/search/'+z[1].shop.flag"
                  v-html="z[1].shop.name"
                />
              </b>]
              <img
                class="miniflag"
                :src="'https://secondlife.com/app/image/'+z[1].shop.flag+'/1'"
              >
              {{ z[1].message }}
              <span v-if="z[1].name">
                (by <a
                  target="_blank"
                  :href="'http://world.secondlife.com/resident/'+z[1].uuid"
                >
                  {{ z[1].name }}
                </a>)
              </span>
            </div>
          </template>
        </transition>
      </div>
    </article>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

const MESSAGE_SOURCE = '//sl-navi.com/api/message'
const INTERVAL_GET_MESSAGE = 17
const INTERVAL_RELOAD_MESSAGE = 8
export default {
  name: 'Messages',
  filters: {
    'time_only': function (z) {
      return z.replace(/.+T/g, '').replace(/:..$/, '')
    }
  },
  data: function () {
    return {
      lastMessageId: 0,
      firstGet: 1,
      messages: [],
      messagesAdult: [],
      modeCache: 0
    }
  },
  created: function () {
    // 低負荷なので画面を見て無くても流す
    setInterval(this.updateTicker, 1000 * INTERVAL_RELOAD_MESSAGE)
  },
  mounted () {
    const that = this
    this.$setInterval(() => {
      that.getMessages(that.modeCache)
    }, 1000 * INTERVAL_GET_MESSAGE)
  },
  methods: {
    updateTicker: function () {
      // messages[z][true|false]のtrueを１つずつ後ろにずらす
      // ただし、messages[最後]がtrueの場合はtrueのままとする
      let next = 0
      let z
      for (z in this.messages) {
        if (next) {
          next = 0
          this.$set(this.messages[z], 0, true)
        } else if (this.messages[z][0]) {
          next = 1
          this.messages[z][0] = false
        }
      }
      if (next) {
        this.messages[z][0] = true
      }
    },
    async getMessages (mode) {
      // console.log("call getMessages:"+mode)
      this.modeCache = mode
      // メニューアダルト(mode=e)はアダルト施設のメッセージキューがあるならマージ
      if (mode === 'e' && this.messagesAdult[0]) {
        this.messages = this.messages.concat(this.messagesAdult)
        this.messagesAdult = []
      }
      // console.log(MESSAGE_SOURCE+'/newer/'+this.lastMessageId)
      await axios.get(MESSAGE_SOURCE + '/newer/' + this.lastMessageId).then(res => {
        for (const z of res.data) {
          if (mode !== 'e' && z.shop.h === 1) { // メニューエロ(mode=e)以外でアダルト施設のメッセージ
            this.messagesAdult.push([false, z])
          } else {
            this.messages.push([false, z])
            this.lastMessageId = z.id
          }
        }
        // 初めてデータが追加された時は先頭を表示対象にする
        if (this.firstGet === 1 && this.messages[0]) {
          this.messages[0][0] = true
          this.firstGet = 0
        }
        // console.log(["message_data=",this.messages])
      })
    }
  }

}
</script>

<style scorped>
  .messages{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 0;
    margin-left: 15px;
    margin-bottom: 5px;
  }
  .media-content {
    padding: 0px;
    font-size: small;
  }

  .message-header {
    font-size: small;
    background-color: #ffc107;
    color: #666666;
    border-radius: 5px 0px 5px 5px;
    padding: 0px 2px 3px 2px;
    margin-right: 5px;
  }

  .msg {
    color: #666666;
    margin-left: 5px;
  }

  .miniflag{
    width: 20px;
    height: 20px;
    margin: 0px 0px 0px 0px;
    padding: 0px 0px 0px 0px;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s
  }
  .fade-enter, .fade-leave-to {
    opacity: 0
  }
</style>

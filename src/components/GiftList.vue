<template>
  <div
    id="gifts"
    class="col gifts"
  >
    <div class="gift_top">
      ギフト探し(Twitter抽出)・・てすとちゅう
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
        placement="bottom"
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
export default {
  name: 'GiftsList',
  data: function () {
    return {
      gifts: []
    }
  },
  mounted () {
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
        this.gifts.forEach(dog => {
          console.log(['mi', dog])
        })
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
  .new_shop{
    align-items: flex-start;
    position: absolute;
    left: 0px;
    top: 0px;
    display: flex;
  }
  .event_shop{
    align-items: flex-start;
    position: absolute;
    right: 0px;
    top: 0px;
    display: flex;
  }
  .popover_title_right{
    align-items: flex-start;
    position: absolute;
    right: 0px;
    top: 3px;
  }
  .guest_num_circle {
    width: 25px;
    height: 25px;
    color: #ffffff;
    background-color: #2779bd;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
  }
  .staff_num_circle{
    width: 25px;
    height: 25px;
    color: #ffffff;
    background-color: #ffaa00;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
  }
  .male{
    height: fit-content;
    font-size: 100%;
    color: #ffffff;
    border-radius: 25%;
    cursor: pointer;
    background-color: #00aaaa;
  }
  .female{
    height: fit-content;
    font-size: 100%;
    color: #ffffff;
    border-radius: 25%;
    cursor: pointer;
    background-color: #ff8070;
  }
  .staff_and_guest_title{
    font-size: 85%;
    font-weight: 700;
  }
  .guest_num_circle_in_popover{
    width: 25px;
    height: 25px;
    padding: 0px 4px;
    color: #ffffff;
    background-color: #2779bd;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
  .staff_num_circle_in_popover{
    width: 25px;
    height: 25px;
    padding: 0px 4px;
    color: #ffffff;
    background-color: #ffaa00;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
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
  .now_event{
    border: solid 3px #ff0000;
  }
  .heatmap {
    /* 360: 140 */
    /* 18 :  7  */
    width: 360px;
    height: 140px;
    /*
    width: 400px;
    height: 155px;
    */
    float: left;
    margin-bottom: 5px;
  }
  .shop_residentlog_count {
    font-family: 'tatenaga';
    font-size: 105px;
    margin-left: 10px;
    line-height: 1;
    white-space: nowrap;
  }
  .shop_residentlog {
    margin-left: 5px;
  }
  /*
  .popoverCountSize{
    min-width: 500px;
  }
  */
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

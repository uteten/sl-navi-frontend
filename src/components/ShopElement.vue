// INTERVAL_RELOAD_SHOP(秒)毎に SHOP_SOURCE を取得

<template>
  <div
    :id="z.flag"
    :key="z.flag"
    class="f"
    tabindex="0"
  >
    <!-- 看板と人数 -->
    <!-- 
      :src="'https://sl-navi.azureedge.net/static/flag/' + z.flag"
      :src="'https://secondlife.com/app/image/' + z.flag + '/1'"
    -->
    <img
      class="flag"
      :class="z.event ? 'ow_event':''"
      :src="'/static/flag/' + z.flag"

>
    <span
      v-if="isNewShop(z)"
      class="new_shop badge badge-primary"
    >新施設</span>
    <span
      v-if="nowOpen(z)=='short'"
      class="event_shop badge badge-danger"
    >イベント中</span>
    <span
      v-if="nowOpen(z)=='before'"
      class="event_shop badge badge-success"
    >イベント予定</span>
    <span
      v-if="nowOpen(z)=='long'"
      class="event_shop badge badge-info"
    >長期イベント</span>
    <div class="memo">
      <span
        v-if="z.sn > 0"
        class="staff_num_circle"
      >{{ z.sn }}</span>
      <span
        v-if="z.cn > 0"
        class="guest_num_circle"
      >{{ z.cn }}</span>
      <!--
      <span
        v-if="z.female>0"
        class="female"
      >♀×{{ z.female }}</span>
      <span
        v-if="z.male>0"
        class="male"
      >♂×{{ z.male }}</span>
      -->
      <span
        v-if="z.status===0"
        class="badge badge-secondary"
      >閉店中</span>
    </div>
    <!-- ポップアップの中身 -->
    <b-popover
      triggers="click blur"
      placement="bottom"
      style="display:none"
      :target="z.flag"
    >
      <!-- :show="shops.length===1" -->
      <template #title>
        <a
          :href="'/search/'+z.flag.substring(0, z.flag.indexOf('-'))"
          v-html="z.name"
        />
        <b-badge
          v-if="nowOpen(z)=='short'"
          variant="danger"
        >
          イベント中
        </b-badge>
        <b-badge
          v-if="nowOpen(z)=='long'"
          variant="info"
        >
          長期イベント中
        </b-badge>
        <span class="popover_title_right">
          <b-icon-trash scale="1" class="trash_icon" @click="$emit('addBadShop',z)"/>

          <ShareNetwork
            network="Twitter"
            :url="'https://sl-navi.com/search/'+z.flag"
            :title="z.name "
            :description="z.description"
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
            :url="'https://sl-navi.com/search/'+z.flag"
            :title="z.name "
            :description="z.description"
            hashtags="secondlife,sljp"
            sns_twitter_user="SL_uten"
          >
            <img
              class="sns_icon"
              src="https://sl-navi.com/static/facebook.png"
            >
          </ShareNetwork>

        </span>
      </template>
      <span v-html="shopDescription(z)" /><br>
      <span
        v-if="z.event"
        class="event_info"
      >
        <span class="badge badge-success">直近のイベント</span>
        <a :href="'/event/'+z.event.id"><b-icon-calendar2-week scale="0.8" />{{ nitiji(z.event.start)+" 〜 "+nitiji(z.event.end) }}  {{ z.event.title }}</a><br>
      </span>
      <span
        v-if="z.h===1"
        class="badge badge-danger"
      >アダルト施設</span>
      <span
        v-if="z.h===2"
        class="badge badge-primary"
      >一般施設</span>
      <template
        v-for="tag in z.tags"
      >
        <span
          v-if="tag!='チップ任意'"
          :key="tag.id"
          class="badge badge-light"
        >
          {{ tag }}<br>
        </span>
      </template>
      <br>
      <span class="staff_and_guest_title">
        スタッフ<span class="staff_num_circle_in_popover">{{ z.sn }}</span>人
        <span v-if="z.staffs.length!=0">
          (<span
            v-for="staff in z.staffs"
            :key="staff[0]"
          >
            <a
              :href="staff|staff_url"
              target="_blank"
              :class="staff|staff_sex"
            >
              <template v-if="staff!=''">{{ staff|staff_name }}</template>
            </a>
            <span v-if="staff[0] != z.staffs[z.staffs.length-1][0]">,</span>
          </span>)
        </span>
        / 訪問者<span class="guest_num_circle_in_popover">{{ z.cn }}</span>人
        <template v-if="z.female+z.male>0">
          / 男女内訳
          <span v-if="z.female>0">
            ♀{{ z.female }}人
          </span>
          <span v-if="z.male>0">
            ♂{{ z.male }}人
          </span>
        </template>
      </span><br>
      <!--
        <span
          v-if="z.owner_key != z.parcel_owner_key"
          class="n2"
        >
          センサ設置者:
          <a
            :href= "&quot;http://world.secondlife.com/resident/&quot;+z.owner_key"
            target="_blank"
          >
            {{ z.owner_name }}
          </a><br>
        </span>
      -->
      <a
        target="_blank"
        :href="'https://maps.secondlife.com/secondlife/' + z.sim + '/' + z.x + '/' + z.y + '/' + z.z"
      >
        <b-icon-map scale="0.8" />ここに移動({{ z.sim }})
      </a>
      <span v-if="existBlog(z)">
        / <a
          target="_blank"
          :href="z.blog"
        >
          <b-icon-link scale="0.8" />Web( {{ z.blog.replace(/^http(|s):\/\//, '') }} )
        </a>
      </span>
      <br>
      <a
        v-if="z.radio!=''"
        target="_blank"
        :href="'http://uten.jp/radio.cgi?'+z.radio"
        @click="playRadio(z.radio)"
      >
        <b-icon-music-player-fill scale="0.8" />土地設定のラジオを聞く<br>
      </a>
      <div
        v-if="z.residentlog>9"
        class="popoverCountSize"
      >
        <img
          class="heatmap"
          :src="'https://sl-navi.com/static/heatmap2/' + z.flag + '.png?'+Math.random()"
        >
        <span class="shop_residentlog d-none d-lg-block">
          今日の訪問者<br>
          <span class="shop_residentlog_count">{{ z.residentlog }}</span>人
        </span>
      </div>
      <div
        v-else
      >
        <img
          class="heatmap"
          :src="'https://sl-navi.com/static/heatmap2/' + z.flag + '.png?'+Math.random()"
        >
      </div>
    </b-popover>
  </div>
</template>
<script>


export default {
  name: 'ShopElement',
  filters: {
    'staff_url': function (value) {
      return '/d2p/' + value[0].replace(' ', '%20') + '?'
    },
    'staff_name': function (value) {
      return value[0]
    },
    'staff_sex': function (value) {
      if (value[1] === 0) {
        return 'female'
      } else if (value[1] === 1) {
        return 'male'
      } else {
        return
      }
    }
  },
  props: {
    'z': {
      default: ''
    }
  },
  data: function () {
    return {
      playFlag: 0,
      playUrl: '',
      adindex: 0
    }
  },
  methods: {
    nowOpen: function (z) {
      if (!z.event) {
        return 0
      }
      // test
      let start = z.event.start
      let end = z.event.end
      // let now=this._formatDate(new Date(),'YYYY-MM-DDThh:mm:ss')
      const now = new Date()
      start = new Date(start)
      end = new Date(end)
      if (start < now && now < end) {
        if (end - start < 60 * 60 * 24 * 3 * 1000) { // ３日以上をlong
          console.log(end - start)
          return 'short'
        } else {
          return 'long'
        }
      } else if (now < start) {
        return 'before'
      } else {
        return ''
      }
    },
    playRadio (url) {
      if (url === this.playUrl && this.playFlag === 1) {
        // 同じurlをクリックすると止まる
        this.playFlag = 0
        this.playUrl = ''
      } else {
        // 異なるurlは再生
        this.playFlag = 1
        this.playUrl = url
      }
      this.$emit('radio', this.playUrl)
    },
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
    isNewShop (z) {
      const now = new Date()
      now.setDate(now.getDate() - 7)
      const oneWeek = this._formatDate(now, 'YYYY-MM-DDThh:mm:ss')
      // console.log([z.created_at,one_week])
      if (z.created_at > oneWeek) {
        return 1
      } else {
        return 0
      }
    },
    shopDescription (z) {
      const text = z.info
      const urlPattern = /(https?:\/\/[^ \r\n]+)/g
      return text.replace(urlPattern, '<a target="_blank" href="$1">$1</a>').replace(/\n/g, '<br>')
    },
    existBlog (z) {
      return (z.blog !== 'http://www.google.com' && z.blog.indexOf('http') === 0)
    }
  }
}
</script>

<style scoped>
  .flag {
    width: 160px;
    height: 160px;
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
  .now_event{
    border: solid 3px #ff0000;
  }
  .heatmap {
    /* 360: 140 */
    /* 18 :  7  */
    width: 320px;
    height: 124px;
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
    white-space: nowrap;
  }
  .trash_icon {
    color: crimson;
    vertical-align: -4px;
    padding-right: 3px;
  }
  .sns_icon{
    width:20px;
    height:20px;
    margin: 5px;
  }
  .event_info{
    font-size: 75%;
    font-weight: 700;
  }
  .bi-x-octagon-fill{
    color: crimson;
      vertical-align: -4px;
      padding-right: 3px;
  }

</style>

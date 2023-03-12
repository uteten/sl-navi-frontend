<template>
  <div
    id="tag_menu_group"
    class="leftmenu"
  >
    <div
      id="tag_special_group"
      class="menu_group"
    >
      <div class="menu_top">
        メニュー
      </div>
      <ul
        id="specialTags"
        class="tag_menu"
      >
        <li
          v-for="tag in specialTags"
          :key="tag.id"
          :value="tag.id"
          :class="tag.selected"
          @click="changeStatus('', tag.id, 'active')"
        >
          {{ tag.n }}({{ tag.count }})
        </li>
      </ul>
    </div>
    <!--
    <div
      v-if="nowT % 3==1"
      class="ad_tag"
    >
      <Adsense
        data-ad-client="ca-pub-7267369281211974"
        data-ad-slot="3044016459"
        ins-style="display:inline-block;width:160px;height:400px;"
        data-ad-format=""
        data-full-width-responsive="no">
      </Adsense>
    </div>
    -->

    <div
      id="tag_normal_group"
      class="menu_group"
    >
      <div class="menu_top">
        タグ
      </div>
      <ul
        id="normal_tags"
        class="tag_menu"
      >
        <template v-for="tag in tags">
          <li
            v-if="tag.count>=2"
            :key="tag.id"
            :value="tag.id"
            :class="tag.selected"
            @click="changeStatus('', tag.id, 'active')"
          >
            {{ tag.n }}({{ tag.count }})
          </li>
        </template>
      </ul>
    </div>
    <!--
    <div class="ad_tag">
      <Adsense
        data-ad-client="ca-pub-7267369281211974"
        data-ad-slot="3044016459"
            ins-style="display:inline-block;width:150px;height:600px"
            data-ad-format=""
            data-full-width-responsive="">
      </Adsense>
    </div>
    -->
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

const TAG_SOURCE = '//sl-navi.com/api/tag'
export default {
  name: 'TagList',
  props: {
    'mode': {
      type: String,
      default: 'k'
    }
  },
  data: function () {
    return {
      tags: [],
      specialTags: [],
      nowT: 0
    }
  },
  mounted () {
    const date = new Date()
    this.nowT = date.getTime()
  },
  methods: {
    _sortBy: function (field, reverse, primer) {
      reverse = (reverse) ? -1 : 1
      // ボイスOK/NGだけ上位に持ってくる
      return function (a, b) {
        let aa = a[field]
        let bb = b[field]
        if (a.n === 'ボイスOK' || a.n === 'ボイスNG') aa = 60
        if (b.n === 'ボイスOK' || b.n === 'ボイスNG') bb = 60
        if (typeof (primer) !== 'undefined') {
          aa = primer(aa)
          bb = primer(bb)
        }
        if (aa < bb) return reverse * -1
        if (aa > bb) return reverse * 1
        return 0
      }
    },
    async getTags (tagid) {
      await axios.get(TAG_SOURCE).then(res => {
        const m = this.mode // k=健全 e=アダルト c=全部
        for (const z of res.data) {
          z.count = z[m]
          if (z.id > 0) {
            if (z.n !== 'チップ任意') {
              this.tags.push(z)
            }
          } else {
            this.specialTags.push(z)
          }
        }
        this.tags.sort(this._sortBy(m, true, parseInt))
        if (tagid) {
          this.changeStatus('', tagid)
        }
      })
    },
    changeStatus (m, tagid, active) {
      if (m) {
        // console.log(['TagList:changeStatus', m, tagid])
        for (const z of this.tags) {
          this.$set(z, 'count', z[m])
        }
        for (const z of this.specialTags) {
          this.$set(z, 'count', z[m])
        }
        this.tags.sort(this._sortBy(m, true, parseInt))
      }
      if (tagid) {
        scrollTo(0, 0)
        for (const z of this.tags) {
          this.$set(z, 'selected', (z.id === tagid) ? 'selected' : '')
          if (z.id === tagid) { document.title = 'SL-Navi | セカンドライフの' + z.n }
        }
        for (const z of this.specialTags) {
          this.$set(z, 'selected', (z.id === tagid) ? 'selected' : '')
        }
      }
      if (active) {
        // コンポーネント内のタグをクリックしたステータス変化は親に伝えて、親で何か処理(shopの再読込など)をする
        if (this.mode === 'k') {
          this.$router.push('/kenzen/' + tagid)
        } else if (this.mode === 'e') {
          this.$router.push('/adult/' + tagid)
        } else {
          this.$router.push('/all/' + tagid)
        }
        // this.$emit('selected-tag', tagid)
      }
    }
  }
}
</script>
<style scoped>
#tag_menu_group {
  max-width: 250px;
}

.tag_menu {
  padding: 0.2em 0 0.2em 0;
  margin: 0;
}
.ad_tag{
  text-align:center;
}

.tag_menu li {
  color:#333333;
  font-size: small;
  line-height: 1.0;
  padding: 0.5em 0 0.5em 0.7em;
  list-style: none;
  cursor: pointer;
}

.tag_menu li:hover {
  background-color: #ffcc77;
  color:#333333;
  cursor: pointer;
}
.selected{
  background-color: #ffe3b3;
  color: #666666;
  font-weight: bold;
  cursor: pointer;
}
.menu_top{
  font-size: medium;
  background: #ffc107;
  color:#666666;
  font-weight: bold;
  padding: 0 0 0.2em 0.7em;
  list-style-type: none!important;
  position: relative;
}

.menu_group{
  background: #fdfcec;
  border: 1px solid #ffb03f;
  border-radius: 5px;
  margin-bottom: 15px;
}

</style>

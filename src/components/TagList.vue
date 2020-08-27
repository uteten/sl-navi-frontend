<template>
  <div id="tag_menu_group" class="col col-lg-2 leftmenu">
    <div id="tag_special_group" class="menu_group">
      <div class="menu_top">メニュー</div>
      <ul id="special_tags" class="tag_menu">
          <li v-for = "tag in special_tags"
              :key ="tag.id"
              :value = "tag.id" v-on:click="changeStatus('', tag.id, 'active')" :class = "tag.selected">
              {{ tag.n }}({{ tag.count }})
          </li>
      </ul>
    </div>
    <div id="tag_normal_group" class="menu_group">
      <div class="menu_top">タグ</div>
      <ul id="normal_tags" class="tag_menu">
        <template v-for="tag in tags">
          <li v-if ="tag.count>=2" :key="tag.id"
              :value="tag.id" v-on:click = "changeStatus('', tag.id, 'active')" :class = "tag.selected">
              {{ tag.n }}({{ tag.count }})
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>


<script>
import Vue from 'vue'
import axios from 'axios'

Vue.prototype.$axios = axios

const TAG_SOURCE = '//sl-navi.com/api/tag'
export default{
  name: 'TagList',
  props: ['mode'],
  data: function () {
    return {
      tags: [],
      special_tags: []
    }
  },
  methods: {
    _sort_by: function (field, reverse, primer) {
      reverse = (reverse) ? -1 : 1
      return function (a, b) {
        a = a[field]
        b = b[field]
        if (typeof (primer) !== 'undefined') {
          a = primer(a)
          b = primer(b)
        }
        if (a < b) return reverse * -1
        if (a > b) return reverse * 1
        return 0
      }
    },
    async getTags (tagid) {
      await axios.get(TAG_SOURCE).then(res => {
        let m = this.mode // k=健全 e=アダルト c=全部
        for (var z of res.data) {
          z.count = z[m]
          if (z.id > 0) {
            this.tags.push(z)
          } else {
            this.special_tags.push(z)
          }
        }
        this.tags.sort(this._sort_by(m, true, parseInt))
        if (tagid) {
          this.changeStatus('', tagid)
        }
      })
    },
    changeStatus (m, tagid, active) {
      if (m) {
        // console.log(['TagList:changeStatus', m, tagid])
        for (let z of this.tags) {
          this.$set(z, 'count', z[m])
        }
        for (let z of this.special_tags) {
          this.$set(z, 'count', z[m])
        }
        this.tags.sort(this._sort_by(m, true, parseInt))
      }
      if (tagid) {
        scrollTo(0, 0)
        for (let z of this.tags) {
          this.$set(z, 'selected', (z.id === tagid) ? 'selected' : '')
        }
        for (let z of this.special_tags) {
          this.$set(z, 'selected', (z.id === tagid) ? 'selected' : '')
        }
      }
      if (active) {
        // コンポーネント内のタグをクリックしたステータス変化は親に伝えて、親で何か処理(shopの再読込など)をする
        this.$emit('selected_tag', tagid)
      }
    }
  }
}
</script>
<style scoped>
.tag_menu {
  padding: 0.2em 0 0.2em 0;
  margin: 0;
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
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 15px;
}

</style>

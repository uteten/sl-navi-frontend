<template>
  <div
    id="tag_menu_group"
    class="col col-lg-2 leftmenu"
  >
    <div
      id="tag_normal_group"
      class="menu_group"
    >
      <div class="menu_top">
        職種
      </div>
      <ul
        id="normal_tags"
        class="tag_menu"
      >
        <template v-for="x in genres">
          <li
            :key="x.id"
            :value="x.id"
          >
            {{ x.name }}
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

const TAG_SOURCE = '//sl-navi.com/event/api/jobgenre'
export default {
  name: 'JobGenre',
  data: function () {
    return {
      genres: []
    }
  },
  methods: {
    async getList () {
      await axios.get(TAG_SOURCE).then(res => {
        for (const z of res.data) {
          this.genres.push(z)
          console.log(z)
        }
      })
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
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 15px;
}

</style>

<template>
  <div
    id="tag_menu_group"
    class="col col-lg-2 leftmenu"
  >
    <template v-for="x in jobs">
      <div
        :key="x.id"
        :value="x.id"
        class="job_group"
      >
        <div class="job_top">
          {{ x.title }}
        </div>
        {{ x.genre.name }}<br>
        {{ x.description }}<br>
        期限 {{ x.deadline }}<br>
        投稿者 {{ x.created_by.name }}
      </div>
    </template>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.prototype.$axios = axios

const TAG_SOURCE = '//sl-navi.com/event/api/job'
export default {
  name: 'JobList',
  data: function () {
    return {
      jobs: []
    }
  },
  methods: {
    async getList () {
      await axios.get(TAG_SOURCE).then(res => {
        for (const z of res.data) {
          this.jobs.push(z)
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

.job_top{
  font-size: medium;
  background: #ffc107;
  color:#666666;
  font-weight: bold;
  padding: 0 0 0.2em 0.7em;
  list-style-type: none!important;
  position: relative;
}

.job_group{
  width: 500px;
  background: #fdfcec;
  border: 1px solid #ffb03f;
  border-radius: 5px;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 15px;
}

</style>

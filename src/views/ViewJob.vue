<template>
  <div class="view row">
    <job-genre ref="appJobGenre" />
    <div class="view col">
      <job-list ref="appJobList" />
      <form>
        <label for="id_title">タイトル:</label>
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
        <label for="id_genre">ジャンル（必須）:</label>
        <select
          id="id_genre"
          v-model="genre"
          name="genre"
          class="form-control"
          required
        />
      </form>
    </div>
  </div>
</template>

<script>
import JobGenre from '@/components/JobGenre'
import JobList from '@/components/JobList'

export default {
  name: 'ViewJob',
  components: {
    JobList,
    JobGenre
  },
  data: function () {
    return {
      jobgenreid: 1,
      lastT: 1
    }
  },
  mounted () {
    this.$refs.appJobGenre.getList()
    this.$refs.appJobList.getList()
  }
}
</script>
<style>
table {
  margin-left:auto;margin-right:auto;
  width:80%;
}
td{
  width:50%;
}
.ad{
  text-align: center;
  /*
  max-height: 200px;
  background: #fdfcec;
  border: 1px solid #ffb03f;
  border-radius: 5px;
  */
  padding: 0;
  margin-left: 15px;
  margin-bottom: 15px;

}
.event_info_image{
  width: 100%;
}
h5{
    color: #ffaa00;
    font-weight: bold;
}
.modal-header{
	background: #fdf0e0;
}
.modal-content{
	border-radius: 10px;
	border: solid 2px #ffb03f;
}
#google-center-div {
  vertical-align: middle;
}
</style>

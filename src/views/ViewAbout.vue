<template>
<div class="view">
  <img class="sl-navi-kanban" src="/static/sl-navi-kanban.png">
  <br><br>

  <h4>■このサイトの目的</h4>
  <ol>
      <li>アダルト、一般施設問わず、<a href="https://www.secondlife.com/?lang=ja">セカンドライフ</a>内の日本人がいる施設や遊び場を見つけやすくします</li>
      <li>施設オーナーはセンサを置くだけで利用できます(申請不要)</li>
  </ol>
 
  <h4>■センサ配布場所</h4>
  <ul>
    <li><a @click="$ga.event('about', 'click_mapurl', 'センサ配布場所')" target=_blank href="http://maps.secondlife.com/secondlife/japan%20canvas/102/172/2002">http://maps.secondlife.com/secondlife/japan%20canvas/102/172/2002</a></li>
    <li style="list-style: none;">設置時のエラーや不明点は<a href="secondlife:///app/agent/7bc5bae0-bf2d-44da-a79f-66cdef64c321/about">uten resident</a> か <a href="https://twitter.com/sl_uten">@sl_uten</a>へ</li>
</ul>
  
  <h4>■FAQ</h4>
  <table class="table table-striped">
      <tr>
          <th>質問</th>
          <th>回答</th>
      </tr>
      <tr>
          <td>登録した施設をWebから撤去したい</td>
          <td>センサを撤去すると12時間後に消えます</td>
      </tr>
      <tr>
          <td>TOP(人がいる施設)に表示される施設の条件は？</td>
          <td>
              以下のいずれかを満たす施設(2020/08/21時点）<br>
              ・開店中でスタッフがいる<br>
              ・開店中でSENSOR_RANGE_XY=150以下で誰かいる<br>
          </td>
      </tr>
      <tr>
          <td>お店がWebに表示されなくなった/更新されなくなった</td>
          <td>
              8/21にほぼ全センサの同期が切れる障害が発生しました。新しいセンサに置き換えるか、<br>
              「センサを編集⇒スクリプトリセット」を実施して復旧させてください。すみません。<br>
          </td>
      </tr>
      <tr>
          <td>センサ更新時などに同じ看板を使い回せるか？</td>
          <td>センサ設置者が同じであれば使い回せます。<br>
          異なる場合はセンサを撤去して12時間後(施設情報がWebから消えた後)に、設置してください。</td>
      </tr>
      <tr>
          <td>1SIMに複数センサを置いているが、人がカウントされないセンサがある</td>
          <td>複数のセンサの範囲がかぶっている場合、センサ範囲(RANGE_XY)が小さいセンサにカウントされます</td>
      </tr>
      <tr>
          <td>土地管理者じゃないがセンサを置くことは可能か？（土地レンタルなど）</td>
          <td>Rez権限があれば可能。ただし土地管理者と揉めないように気をつけてください。</td>
      </tr>
  </table>
  <hr/>
</div>
</template>
<script>
import Vue from 'vue'
import VueSocialSharing from 'vue-social-sharing'
Vue.use(VueSocialSharing)
export default {
  data: function () {
    return {
      sns_url : "https://sl-navi.com",
      sns_title: "// SL-Navi",
      sns_description: "セカンドライフ内で日本人がいるお店や遊び場、新施設を見つけよう",
      sns_hashtags:"secondlife,sljp",
      sns_twitter_user:"SL_Uten"
}
  }
}
</script>
<style scorped>
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
.sns_icon{
  width:20px;
  height:20px;
  margin: 5px;
}
</style>

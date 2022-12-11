<template>
  <div>
    <img
      class="sl-navi-kanban"
      src="/static/sl-navi-kanban.png"
    >
    <br><br>

    <h4>■このサイトの目的</h4>
    <ol>
      <li>2022年 現在の<a href="https://www.secondlife.com/?lang=ja">セカンドライフ</a>内の日本人カフェやイベントを紹介(施設オーナーはセンサを置くだけでOK。申請不要)</li>
      <li>ギフト配布場所情報も試験追加中</li>
      <li>イベントのSLT⇨JST日本時間変換/計算は<a href="/event">こちら</a></li>
    </ol>

    <h4>■センサ配布場所</h4>
    <ul>
      <li>
        <a
          target="_blank"
          href="http://maps.secondlife.com/secondlife/japan%20canvas/102/172/2002"
          @click="$ga.event('about', 'click_mapurl', 'センサ配布場所')"
        >http://maps.secondlife.com/secondlife/japan%20canvas/102/172/2002</a>
      </li>
      <li style="list-style: none;">
        設置時のエラーや不明点は<a href="secondlife:///app/agent/7bc5bae0-bf2d-44da-a79f-66cdef64c321/about">uten resident</a> か <a href="https://twitter.com/sl_uten">@sl_uten</a>へ
      </li>
    </ul>

    <h4>■FAQ</h4>
    <table class="table table-striped">
      <tr>
        <th>質問</th>
        <th>回答</th>
      </tr>
      <tr>
        <td>登録した施設をWebから撤去したい</td>
        <td>センサを撤去すると72時間後に消えます</td>
      </tr>
      <tr>
        <td>Webにお店が表示されなくなった</td>
        <td>センサのバグか不具合でサーバと同期が取れていない可能性があります。新しいセンサと置き換えてください。</td>
      </tr>
      <tr>
        <td>土地管理者/所有者じゃないがセンサを置くことは可能か？（土地レンタルなど）</td>
        <td>Rez権限があれば可能。ただし土地管理者と揉めないように気をつけてください。</td>
      </tr>
      <tr>
        <td>TOP(人がいる施設)に表示される施設の条件は？</td>
        <td>
          以下のいずれかを満たす施設(2020/12/13時点）<br>
          ・開店中で人がいる<br>
          <s>・開店中でスタッフがいる</s><br>
          <s>・開店中でSENSOR_RANGE_XY=150以下で誰かいる</s><br>
        </td>
      </tr>
      <tr>
        <td>センサをon/offしてもすぐにWebに反映されない？</td>
        <td>Webに結果が反映されるのに最大30秒時間差があります</td>
      </tr>
      <tr>
        <td>センサ更新時などに同じ看板を使い回せるか？</td>
        <td>
          センサ設置者が同じであれば使い回せます。<br>
          設置者が異なる場合は古いセンサを撤去して72時間後(施設情報がWebから消えた後)に、設置してください。
        </td>
      </tr>
      <tr>
        <td>1SIMに複数センサを置いているが、人がカウントされないセンサがある</td>
        <td>複数のセンサがあり、範囲がかぶっている場所に人がいる場合、センサ範囲が小さいセンサにカウントされます</td>
      </tr>
      <tr>
        <td>男女判定の仕組みは？</td>
        <td>
          センサのバージョンによって違うのですが最新版は以下の通り<br>
          <s>
            装着物にmale,(m),genitalを含むと男、female,(f),heel,skirt,boobを含むと女、<br>
            両方ある場合は多い方、装着物で判断できない場合は
          </s>
          シェイプの♂♀で判定します。
        </td>
      </tr>
    </table>
    <hr>
  </div>
</template>
<script>
import Vue from 'vue'
import VueSocialSharing from 'vue-social-sharing'
Vue.use(VueSocialSharing)
export default {
  data: function () {
    return {
      'sns_url': 'https://sl-navi.com',
      'sns_title': '// SL-Navi',
      'sns_description': 'セカンドライフ内で日本人がいるお店や遊び場、新施設を見つけよう',
      'sns_hashtags': 'secondlife,sljp',
      'sns_twitter_user': 'SL_Uten'
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

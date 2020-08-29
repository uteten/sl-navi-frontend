<template>
<div class="view">
  <img class="sl-navi-kanban" src="/static/sl-navi-kanban.png">
  <br><br>

  <h4>■このサイトの目的</h4>
  <ol>
      <li>アダルト、一般施設問わず、<a href="https://www.secondlife.com/?lang=ja">セカンドライフ</a>内の日本人がいる施設や遊び場を見つけやすくします</li>
      <li>施設オーナー・運営者は、登録申請不要でセンサを置くだけで気軽に利用できます</li>
  </ol>
 
  <h4>■センサ配布場所</h4>
  <ul>
    <li><a href="https://maps.secondlife.com/secondlife/Andretti/28/24/27">https://maps.secondlife.com/secondlife/Andretti/28/24/27</a></li>
  </ul>

  <h4>■FAQ</h4>
  <p>
    その他質問は<a href="secondlife:///app/agent/7bc5bae0-bf2d-44da-a79f-66cdef64c321/about">uten resident</a> か <a href="https://twitter.com/sl_uten">@sl_uten</a>へ
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
            <td>お店がWebに表示されなくなった/更新されなくなった</td>
            <td>
                8/21にほぼ全センサの同期が切れる障害が発生しました。新しいセンサに置き換えるか、<br>
                「センサを編集⇒スクリプトリセット」を実施して復旧させてください。すみません。<br>
                ※utenが店舗情報を意図的に消すことはこれまで一度もないです。
            </td>
        </tr>
        <tr>
            <td>1SIMに複数センサを置いているが、人がカウントされないセンサがある</td>
            <td>複数のセンサの範囲がかぶっている場合、センサ範囲(RANGE_XY)が小さいセンサにカウントされます（二重カウントされません）。</td>
        </tr>
        <tr>
            <td>センサが古いと表示された</td>
            <td>新しいセンサを配布場所から入手して、古いセンサは捨ててください。</td>
        </tr>
        <tr>
            <td>TOP(人がいる施設)に表示される施設の条件は？</td>
            <td>
                以下のいずれかを満たす施設(2020/08/21時点.変更する可能性あり）<br>
                ・開店中でスタッフがいる<br>
                ・開店中でSENSOR_RANGE_XY=150以下(RANGE_Zは特に制限なし)で誰かいる<br>
            </td>
        </tr>
        <tr>
            <td>変な人が来たんですがutenさんのサブアカですか？</td>
            <td>違います。変な人は適時BANしてください</td>
        </tr>
        <tr>
            <td>スタッフのいないたまり場なので、スタッフがいなくても人がいたらTOPに表示して欲しい</td>
            <td>新しいセンサにして、SENSOR_RANGE_XYを150m以下にしてください</td>
        </tr>
        <tr>
            <td>センサを同じ土地内で高さの違う場所にもう一つ置くことは可能か？</td>
            <td>可能</td>
        </tr>
        <tr>
            <td>土地管理者じゃないがセンサを置くことは可能か？（土地レンタルなど）</td>
            <td>Rez権限があれば可能。ただし土地管理者と揉めないように気をつけてください。</td>
        </tr>
    </table>
  </p>
  <h4>■作った人</h4>
    <dl>
      <dt>開発</dt><dd><a href="https://twitter.com/Sl_Uten">@SL_Uten</a></dd>
      <dt>改変</dt><dd><a href="https://twitter.com/Vanilla_Non">@Vanilla_Non</a></dd>
    </dl>
  <hr/>
</div>
</template>

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

</style>

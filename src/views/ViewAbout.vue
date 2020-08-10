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

  <h4>■最近のおしらせ</h4>
  <ul>
    <li>2020/08/10 特にないです</li>
  </ul>

  <h4>■FAQ</h4>
  よくあるご質問（他の質問やご要望はSL内のuten residentへ）
  <p>
      <table class="table table-striped">
          <tr>
              <th>質問</th>
              <th>回答</th>
          </tr>
          <tr>
              <td>お店がWebに表示されなくなった</td>
              <td>
                  センサが古いか。何かのバグでサーバの同期が切れています(同期が切れると12時間でWebから消えます)。<br>
                  一度IMでご連絡いただくか、新しいセンサを配布場所から入手して試してください<br>
                  ※管理者が店舗情報を意図的に消すことは、これまで一度もないです。
              </td>
          </tr>
          <tr>
              <td>configを変更してもお店情報が更新できなくなった</td>
              <td>センサのバージョンが古いと更新できないことがあります。新しいセンサを配布場所から入手して試してください。</td>
          </tr>
          <tr>
              <td>センサが古いと表示された</td>
              <td>新しいセンサを配布場所から入手して、古いセンサは捨ててください。</td>
          </tr>
          <tr>
              <td>変な人が来たんですがutenさんのサブアカですか？</td>
              <td>違います。変な人は適時BANしてください</td>
          </tr>
          <tr>
              <td>TOP(人がいる施設)に表示される施設の条件は？</td>
              <td>
                  以下のいずれかを満たす施設(3/15時点.変更する可能性あり）<br>
                  ・開店中でスタッフがいる<br>
                  ・開店中でSENSOR_RANGE_XY=100以下(RANGE_Zは特に制限なし)で誰かいる<br>
              </td>
          </tr>
          <tr>
              <td>スタッフのいないたまり場なので、スタッフがいなくても人がいたらTOPに表示して欲しい</td>
              <td>新しいセンサにして、SENSOR_RANGE_XYを100m以下にしてください</td>
          </tr>
          <tr>
              <td>登録した施設をWebから撤去したい</td>
              <td>センサを撤去すると12時間後に消えます</td>
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

  <hr>
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
</style>

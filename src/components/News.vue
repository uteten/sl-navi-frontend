<template>
  <div id="news" class="col news">
    <div class="news_top">最近のおしらせ</div>
    <ul class="news_menu">
      <li class="news_item">2020/08/21 <span class="badge badge-danger">障害</span>ほぼ全センサの同期が切れる障害が発生しました。センサ設置者は「センサを編集⇒スクリプトリセット」を実施して復旧させてください。すみません。</li>
    </ul>
    <ul class="news_menu">
      <li class="news_item">2020/08/28 <span class="badge badge-primary">新規施設</span>(新しい施設順で5個出したい)</li>
      <li class="news_item">2020/08/27 <span class="badge badge-primary">新規施設</span>(クリックで施設情報が見れるともっといいと思います)</li>
      <li class="news_item">2020/08/26 <span class="badge badge-primary">新規施設</span>〇〇カフェを追加</li>
      <li class="news_item">2020/08/25 <span class="badge badge-primary">新規施設</span>バー〇〇を追加</li>
      <li class="news_item">2020/08/24 <span class="badge badge-primary">新規施設</span>バー〇〇を追加</li>
    </ul>
  </div>
</template>

<style scorped>
  /* ====  News.vue ==== */
  .news_menu {
    padding: 0.2em 0 0.2em 0;
    margin: 0;
  }

  .news_item {
    color:black;
    font-size: small;
    line-height: 1.0;
    padding: 0.5em 0 0.5em 0.7em;
    list-style: none;
  }
  .news{
    background: #fdfcec;
    border: 1px solid #ffb03f;
    border-radius: 5px;
    padding: 0;
    margin-left: 15px;
    margin-bottom: 15px;
  }
  .news_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  .news_item .badge{
    margin-right: 0.8em;
  }
</style>
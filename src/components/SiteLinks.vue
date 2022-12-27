<template>
  <div
    id="links"
    class="col news"
  >
    <div class="links_top">
      リンク集
    </div>
    <h6>■ニュース/ブログ</h6>
    <dl class="links_menu">
      <blog-articles
        title="Secondlife公式 特別ニュース(英語)"
        url="https://community.secondlife.com/blogs/blog/4-featured-news/"
        json="blog-secondlife"
      />
      <blog-articles
        title="INARA PEY: LIVING IN A MODEMWORLD(英語)"
        url="https://modemworld.me/"
        json="blog-modemworld"
      />
      <blog-articles
        title="New World Notes(英語)"
        url="https://nwn.blogs.com/nwn/"
        json="blog-nwn"
      />
      <blog-articles
        title="DANIEL VOYAGER(英語)"
        url="https://danielvoyager.wordpress.com/"
        json="blog-danielvoyager"
      />
    </dl>
    <h6>■初心者向け/総合</h6>
    <dl class="links_menu">
      <blog-articles
        title="Second Life 美少女アバター wiki"
        url="https://aniava.net/"
        json="blog-aniava"
      />
      <blog-articles
        title="Second Lifeメタバースガイド(Yuu)"
        url="https://www.sl-guide.com/"
        json="blog-sl-guide"
      />
      <blog-articles
        title="SecondLife Furry's Habitat Wiki(ケモアバのレビュなど)"
        url="https://seesaawiki.jp/furrys_habitat/"
        json="blog-furrys_habitat"
      />
      <dt class="links_item left">
        <a
          target="_blank"
          href="https://sljpstartguide.wordpress.com/"
        >
          Secondlife スタートガイド(Lokia)
        </a>
      </dt>
      <dd class="links_item">
        :初心者総合
      </dd>
    </dl>
    <h6>■買い物/イベント</h6>
    <dl class="links_menu">
      <dt class="links_item left">
        <a
          target="_blank"
          href="https://www.seraphimsl.com/"
        >
          Seraphimsl(英語)
        </a>
      </dt>
      <dd class="links_item">
        :イベント/セール情報
      </dd>

      <dt class="links_item left">
        <a
          target="_blank"
          href="https://slbloodlines.com/haunts/browse/clubs"
        >
          Bloodline-Clubs(英語)
        </a>
      </dt>
      <dd class="links_item">
        :今人がいるクラブの一覧
      </dd>
    </dl>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import BlogArticles from './BlogArticles.vue'

Vue.prototype.$axios = axios

export default {
  name: 'SiteLinks',
  components: {
    BlogArticles
  }
}
</script>

<style scorped>
  .none{
    float: none;
  }
  dt.left{
    float: left;
  }
  dt.right{
    margin-left: 20px;
    float: none;
    font-weight: normal;
  }
  .links_menu {
    padding: 0.1em 0 0.1em 0;
    margin: 0;
  }

  .links_item {
    color:black;
    font-size: small;
    line-height: 1.0;
    padding: 0.1em 0 0.1em 0.7em;
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
  .links_top{
    font-size: medium;
    background: #ffc107;
    color:#666666;
    font-weight: bold;
    padding: 0 0 0.2em 0.7em;
    list-style-type: none!important;
  }
  .links_item .badge{
    margin-right: 0.8em;
  }
  h6{
    margin-top: 10px;
    margin-left: 5px;
    margin-right: 20px;
    color: #906000;
    border-bottom: dashed 2px #ffb03f;
  }

</style>

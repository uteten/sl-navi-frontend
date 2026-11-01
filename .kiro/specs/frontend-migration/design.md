# 設計: sl-navi フロントエンド移行

状態: 確定 (2026-11-01、ユーザー了承)。実装済み (#2、#3)。要件は [requirements.md](requirements.md)。

## D1 進め方: PR を 2 つに分ける

master へのマージがそのまま本番の切り替えになる (R6.3)。一度に変えると、壊れたときに
原因 (削除か移行か) を切り分けにくい。そこで 2 段に分ける。

| PR | 中身 | Vue |
|---|---|---|
| PR 1 | 消すもの (R4)、CSRF の処理 (R3.5)、workflow (R5) | Vue 2 のまま |
| PR 2 | Vue 3 + Vite への移行 (R1、R2) | Vue 3 |

- PR 1 で画面とライブラリが減るので、PR 2 で移す量が減る
  (`highcharts-vue`、`vue-ctk-date-time-picker`、`vuex2`、Job 系の画面が消える)。
- PR 1 を本番に出したあと、バックエンドに `SPA_PATHS` から `/analytics/{keyword}` を外すよう依頼する (R2.3)。

## D2 Vue 3 への書き換え方

- Options API のまま移す。Composition API や `<script setup>` への書き換えはしない
  (差分を小さくし、移行の誤りを見つけやすくするため)。
- Vue 3 で消えた機能の置き換え:

  | Vue 2 | Vue 3 |
  |---|---|
  | `new Vue({...}).$mount` | `createApp(App).use(...).mount('#app')` |
  | `Vue.filter` / `filters:` (`capitalize`、`twitter_or_sl`) | `methods` の関数 |
  | `Vue.prototype.$setInterval` (plugins/SetInterval) | `app.config.globalProperties.$setInterval` |
  | `Vue.component(...)` (各ファイル内) | `components:` に書く |
  | `beforeDestroy` / `destroyed` | `beforeUnmount` / `unmounted` |
  | `$listeners`、`.native`、`v-model` の `value`/`input` | Vue 3 の書き方に直す (該当箇所は移行時に検出) |

- 移行中の検出には `eslint-plugin-vue` の `vue3-essential` ルールを使う
  (Vue 2 の書き方が残っていればエラーになる)。

## D3 ライブラリの置き換え

| 今 | 移行後 | 理由 |
|---|---|---|
| `vue` 2.6 | `vue` 3.5 | |
| `@vue/cli-service` (webpack)、`babel` | `vite`、`@vitejs/plugin-vue` | Vue 公式の推奨 |
| `vue-router` 2 | `vue-router` 4 系 (`createWebHistory`) | Vue 3 対応 |
| `vuex2` | なし | 状態は radio 用だけだった (PR 1 で消える) |
| `bootstrap-vue` + Bootstrap 4 | `bootstrap-vue-next` + Bootstrap 5 + `bootstrap-icons` | bootstrap-vue の Vue 3 後継。使っている部品 (modal、popover、collapse、navbar、badge、アイコン) はすべてある → D4 |
| `vue-head` | `@unhead/vue` | Vue 3 で標準的な head 管理 |
| `@gtm-support/vue2-gtm` | `@gtm-support/vue-gtm` | 同じ作者の Vue 3 版。設定 (`GTM-TGJQ98FP`、`vueRouter`) は同じ |
| `vue-social-sharing` 3 | なし (共有用 URL への `<a>`) | Vue 3 版 (v4) は alpha のまま止まっている。使っているのは X と Facebook の共有だけで、共有 URL (`https://twitter.com/intent/tweet?...`、`https://www.facebook.com/sharer/sharer.php?u=...`) へのリンクで同じことができる |
| `vue-google-adsense` + `vue-script2` | 自前の `<AdsenseUnit>` (`<ins class="adsbygoogle">` を描いて `adsbygoogle.push({})`) | Vue 3 版のライブラリは個人の小さなもので、中身は Google の公式の貼り付けコードを包むだけ。公式のコードをそのまま使うほうが依存が減る。広告 ID と枠の属性は今のまま |
| `@fullcalendar/vue` 5 | `@fullcalendar/vue3` 6 系 | options の形は v5 とほぼ同じ。v7 (2026 年公開) は Temporal polyfill が要り変更が大きいので見送る |
| `vue-cookies` | `vue-cookies` (そのまま) | Vue 3 にも対応している |
| `axios` 0.27 | `axios` 1 系 | 古い版の脆弱性対応。呼び方は同じ |
| `vue-analytics` | なし | コメントアウトされていて使っていない (GA は GTM 経由) |
| ESLint 7 (`.eslintrc` 相当を package.json に) | ESLint 9 + `eslint-plugin-vue` (flat config、`eslint.config.js`) | |

- バージョンは公開から 2 週間以上たったものを選び、`package.json` は `^` で範囲を書き、
  `package-lock.json` をコミットする。
- `package.json` の `engines` に `"node": ">=22"` を書く (Vite の要件、R1.5)。

## D4 Bootstrap 4 → 5

bootstrap-vue-next は Bootstrap 5 前提。Bootstrap 4 のクラス名で 5 で変わったものを直す。
今のコードで見つかったもの:

| Bootstrap 4 | Bootstrap 5 | 箇所の数 |
|---|---|---|
| `badge-danger` などの `badge-*` (色) | `text-bg-danger` など | 23 |
| `form-group` | `mb-3` | 3 |
| `media` | `d-flex` + `flex-shrink-0` / `flex-grow-1` | 3 |
| `mr-sm-2` | `me-sm-2` | 1 |

- `<b-*>` 部品は bootstrap-vue-next の `<BModal>` などに書き換える。props の名前が変わったもの
  (`v-model` で開閉する modal、popover の `target` など) は移行時に一つずつ合わせる。
- アイコン (`<b-icon-*>`) は `bootstrap-icons` の `<i class="bi bi-*">` にする。
- popover は `lazy` と `unmount-lazy` を付ける。bootstrap-vue は開いたときだけ中身を描いていたが、
  bootstrap-vue-next は既定で全件を描くため、ヒートマップ画像を一覧の件数ぶん先に読んでしまう。
- bootstrap-vue-next は popover を施設の枠の中に置くので、`.popover { width: max-content }` で幅を中身に合わせる。
- Bootstrap 5 はリンクに常に下線を引くので、Bootstrap 4 と同じくホバー時だけにする。
- 見た目の差 (余白、フォント、色) は D6 の確認で比べ、気になるものだけ CSS で戻す。

## D5 ビルドと配信

- `vite.config.js`:
  - `base: 'https://static.sl-navi.com/'` (`npm run build` のとき。dev では `/`)。R1.3
  - `build.outDir: 'dist'`。R1.2
  - dev server の proxy: `/api` `/event/api` `/user` `/static` → `https://sl-navi.com`
    (`changeOrigin: true`、`cookieDomainRewrite: 'localhost'`)。R6.1
- `public/index.html` は repo 直下の `index.html` に移し、`<script type="module" src="/src/main.js">` を書く。
  favicon、`SixCaps.woff`、`ads.txt`、ロゴは `public/` に残す (dist のルートにコピーされる)。
- `staticwebapp.config.json` は今のまま。R1.4 は D6 の段階 3 で確かめ、足りなければ
  `Access-Control-Allow-Origin` の扱いを直す。
- コード中の `//sl-navi.com/api/...` などの絶対 URL は、相対パス (`/api/...`) にそろえる
  (同一オリジンなので本番の動きは同じ。ローカルでは proxy を通る)。ローカルの確認に要るので PR 1 で行う。

## D6 確かめ方 (本番に出す前にローカルで)

PR ごとに、次の段階を順に通す。

| 段階 | どこで | 何を | 本番の API |
|---|---|---|---|
| 1 | ローカル `npm run dev` | 画面と操作をチェックリストで一通り | proxy で使う |
| 2 | ローカルで本番の形を再現 (下記、PR 2 のみ) | 別オリジンのアセットで起動すること、1 と同じチェック | proxy で使う |
| 3 | SWA の PR プレビュー | ビルドが通ること。アセットに `Origin: https://sl-navi.com` を付けて取ると `Access-Control-Allow-Origin` が返ること (`curl -I`) | 使わない |
| 4 | 本番 (マージ後) | チェックリストを一通り。おかしければ revert | |

段階 2 の組み方 (`npm run preview:split`、Vite の preview だけで組む):

```
ブラウザ ─ http://localhost:4173/<SPA のパス> ─▶ vite preview (ページの口)
              │ dist/index.html を返す。/api /event/api /user /static は https://sl-navi.com へ proxy
              └ index.html の <script type="module" crossorigin> は http://localhost:4174/ を指す
ブラウザ ─ http://localhost:4174/assets/... ─▶ vite preview (アセットの口、CORS で :4173 を許可)
```

- ビルドは `vite build --base http://localhost:4174/`。本番の `base: https://static.sl-navi.com/` と
  同じく、ページとアセットのオリジンが分かれる。
- 本番のバックエンドで検証用の環境を分けることは見送った (ユーザー判断 2026-11-01)。

- 書き込み (イベントの登録・削除、ギフトの削除) は本番の DB に書く。確かめるときは
  テスト用のイベントを作って、確かめたらすぐ消す。
- ログイン: X ログインは戻り先が `sl-navi.com` なのでローカルでは完了しない。
  ローカルでは SL 認証コード (`/createEvent/<code>`) でログインを確かめ、X ログインは段階 4 で確かめる。
- マージの直後、バックエンドの index.html のキャッシュ (最大 60 秒) が切れるまでは、
  古い index.html が新しいアセットを探して読めない時間がありうる。アクセスの少ない時間にマージする。

### チェックリスト (段階 1、2、4)

- [ ] `/` 店の一覧が出る、10 秒ごとの更新、検索、タグ (`/kenzen/:tagid` `/adult` `/all`)
- [ ] `/search/:word` 検索結果
- [ ] 店のカード: 旗画像、ヒートマップ、共有ボタン (X、Facebook)、popover、非表示 (`badShops` Cookie)
- [ ] お知らせ (News)、メッセージのティッカー、カウンタ (counter2.json)
- [ ] `/event` カレンダー (月・週・日の切り替え)、`/event/:eid` 詳細と共有ボタン、削除
- [ ] `/createEvent` ログイン状態の表示、SL 認証、登録、evensa の取り込み、ログアウト
- [ ] `/updateEvent/:eid` 既存イベントの読み込みと更新
- [ ] `/gift` 一覧、削除
- [ ] `/about`
- [ ] 広告枠が出る (段階 4 のみ。AdSense はローカルでは出ない。広告ドメインを DNS で遮断していない回線で見る)
- [ ] GTM の page_view (段階 4。GTM のプレビューモードで。GA も DNS で遮断していない回線で見る)
- [ ] タイトル (`document.title`) と meta が今と同じ
- [ ] スマホ幅でナビゲーションの開閉 (collapse)

## D7 PR 1 の中身 (Vue 2 のまま)

- 消すファイル: `src/views/ViewAnalytics.vue`、`ViewJob.vue`、`ViewEditShop.vue`、
  `src/components/JobList.vue`、`JobGenre.vue`、`src/store/`、`src/router/index.js.org`、
  `memo.txt`、`serve.log`、`.github/workflows/deploy-AzVM.yml.disabled`
- 直すファイル:
  - `src/router/index.js`: `/analytics/:flag` `/job` `/editShop` を消す
  - `src/main.js`: store を外す
  - `src/components/ShopElement.vue`: radio のリンク、`playRadio`、`playUrl`、`playFlag` を消す
  - `GiftList.vue`、`ViewEvent.vue`、`ViewCreateEvent.vue`: `csrftoken` と `X-CSRFTOKEN` を消す
  - workflow: 「Copy to AzVM」ステップを消す
  - `package.json`: `highcharts-vue`、`vue-ctk-date-time-picker`、`vuex2` を消す
- 確かめ方: `npm run build`、`npm run lint`、D6 の段階 1 と 4。
- マージ後: secret の削除をユーザーに案内 (R5.3)、バックエンドに `/analytics/{keyword}` の削除を依頼 (R2.3)。

## 未決

なし。

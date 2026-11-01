# タスク: sl-navi フロントエンド移行

状態: ドラフト (2026-11-01)。レビュー待ち。要件は [requirements.md](requirements.md)、設計は [design.md](design.md)。

- 作業は PR ごとに `origin/master` から切ったブランチで行う。spec (この 3 ファイル) は PR 1 に含める。
- 確かめるときは design D6 のチェックリストを使う。書き込みはテスト用のイベントで行い、すぐ消す。

## PR 1: 削除と workflow の整理 (Vue 2 のまま、design D7)

- [ ] 1.1 radio を消す: `src/store/`、`main.js` の store、`ShopElement.vue` の radio リンクと
      `playRadio` / `playUrl` / `playFlag`、`vuex2` (R4.2)
- [ ] 1.2 `ViewAnalytics.vue` とルート `/analytics/:flag`、`highcharts-vue` を消す (R4.1)
- [ ] 1.3 Job 系を消す: `ViewJob.vue`、`JobList.vue`、`JobGenre.vue`、ルート `/job` (R4.3)
- [ ] 1.4 `ViewEditShop.vue` とルート `/editShop`、`vue-ctk-date-time-picker` を消す (R4.4)
- [ ] 1.5 `csrftoken` の読み取りと `X-CSRFTOKEN` ヘッダを消す
      (`GiftList.vue`、`ViewEvent.vue`、`ViewCreateEvent.vue`、`mixins/globalValiables.js` の `getCookie` は
      ほかで使っていなければ消す) (R3.5)
- [ ] 1.6 `src/router/index.js.org`、`memo.txt`、`serve.log` を消す (R4.5)
- [ ] 1.7 workflow の「Copy to AzVM」ステップと `deploy-AzVM.yml.disabled` を消す (R5.1)
- [ ] 1.8 `npm install` で lock を更新し、`npm run build` と `npm run lint` を通す
- [ ] 1.9 段階 1: `npm run serve` で本番の API につないで、チェックリストを一通り
      (Vue CLI の dev server の proxy を `vue.config-serve.js` に書く。PR 2 で消す)
- [ ] 1.10 PR を出す。SWA のプレビューでビルドが通ることを見る。マージは確認できる時間帯に行う
- [ ] 1.11 段階 4: 本番でチェックリストを一通り。おかしければ revert
- [ ] 1.12 ユーザーに GitHub の secret (`ID_RSA` `USERNAME` `PORT` `HOST` `PATH_WEBROOT`) の削除を案内する (R5.3)
- [ ] 1.13 バックエンドに、`SPA_PATHS` から `/analytics/{keyword}` を外すよう依頼する (R2.3)

## PR 2: Vue 3 + Vite (design D2〜D6)

### 土台

- [ ] 2.1 Vite に置き換える: `vite.config.js` (base、outDir、dev の proxy)、ルート直下の `index.html`、
      `package.json` の scripts と `engines` (`node >=22`)。`vue.config*.js`、`babel.config.js`、
      `jsconfig.json`、`@vue/cli-*` を消す (R1.2、R1.3、R1.5、R4.5、design D5)
- [ ] 2.2 ESLint 9 の flat config (`eslint.config.js`) と `eslint-plugin-vue` の `vue3-essential` を入れる
      (Vue 2 の書き方の検出に使う。design D2)
- [ ] 2.3 `vue` 3、`vue-router` 4 (`createWebHistory`、ルートは `SPA_PATHS` の範囲のまま)、
      `main.js` を `createApp` に。`$setInterval` を `globalProperties` に、`Vue.filter` を関数に (R2.1、R2.2)
- [ ] 2.4 `axios` 1 系へ。`//sl-navi.com/...` の絶対 URL を相対パスにそろえる (R3.1、R3.4)

### ライブラリ (design D3、D4)

- [ ] 2.5 `bootstrap-vue-next` + Bootstrap 5 + `bootstrap-icons`。`<b-*>` 部品とアイコンを書き換え、
      Bootstrap 4 のクラス (`badge-*`、`form-group`、`media`、`mr-sm-2`) を直す
- [ ] 2.6 `@unhead/vue` で title / meta (App.vue と router の `afterEach`)
- [ ] 2.7 `@gtm-support/vue-gtm` (`GTM-TGJQ98FP`、`vueRouter`) (R1.7)
- [ ] 2.8 `<AdsenseUnit>` を作り、`vue-google-adsense` / `vue-script2` の 5 箇所を置き換える。
      広告 ID と枠の属性は今のまま (R1.7)
- [ ] 2.9 共有ボタンを共有 URL への `<a>` にし、`vue-social-sharing` を消す
- [ ] 2.10 `@fullcalendar/vue3` 6 系 (ViewEvent のカレンダー)
- [ ] 2.11 `vue-cookies` を Vue 3 の登録方法に直す
- [ ] 2.12 lint のエラー (Vue 2 の書き方の残り) を 0 にする。`npm run build` を通す

### 確かめる

- [ ] 2.13 段階 1: `npm run dev` でチェックリストを一通り。Bootstrap 5 の見た目の差は今の本番と並べて比べ、
      気になるものだけ CSS で戻す
- [ ] 2.14 段階 2: `npm run preview:split` (design D6) で、別オリジンのアセットで起動することと、チェックリスト
- [ ] 2.15 PR を出す。段階 3: プレビューのビルドと、アセットの CORS ヘッダ (`curl -I -H 'Origin: https://sl-navi.com'`)
- [ ] 2.16 マージは確認できる時間帯に。段階 4: 本番でチェックリストを一通り (広告、GTM、X ログインを含む)。
      おかしければ revert

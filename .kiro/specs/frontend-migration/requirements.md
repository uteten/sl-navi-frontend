# 要件: sl-navi フロントエンド移行 (Vue 2 + Vue CLI → Vue 3 + Vite)

状態: ドラフト (2026-11-01)。レビュー待ち。未確定の点は末尾の「確認したいこと」。

## 背景

- フロントは Vue 2.6 + Vue CLI 5 (webpack) の SPA で、約 5,300 行。
  Azure Static Web Apps (SWA、`static.sl-navi.com`) にデプロイしている。
- Vue 2 は 2023-12-31 に EOL。Vue CLI はメンテナンスモード。
- バックエンドは 2026-11-01 に新しい実装へ切り替え済み (別 repo、非公開)。
  API のパス・クエリ・JSON の形は旧環境と同じ。
- radio.sl-navi.com は廃止済み (ユーザー判断 2026-10-31)。
- 根拠: バックエンド担当からの申し送り (2026-11-01)。

## 決定済み

| 項目 | 決定 | 出典 |
|---|---|---|
| フレームワーク | Vue 3 | ユーザー判断 2026-11-01 |
| ビルド | Vite (Vue CLI をやめる) | ユーザー判断 2026-11-01 |
| デプロイ先 | Azure Static Web Apps のまま | ユーザー判断 2026-11-01 |
| radio 再生 | やめる | ユーザー判断 |
| API の呼び先 | `sl-navi.com` (同一オリジン) のまま。`api.sl-navi.com` には移さない | バックエンド担当からの申し送り、ユーザー了承 2026-11-01 |

API の呼び先を変えない理由: `sl-navi.com` は引き続きバックエンドが受け、API も返す。`api.sl-navi.com` に移すと CORS と
Cookie の考慮が増えるだけで得が無い。

## 配信のしくみ (前提、変えない)

```
ブラウザ ─ https://sl-navi.com/<SPA のパス> ─▶ バックエンド
              │ index.html は static.sl-navi.com/index.html を取ってキャッシュして返す
              ├─ /api/*, /event/api/*, /user/*  ─▶ API
              └─ /static/*                       ─▶ 静的ファイル (counter2.json、flag、heatmap2 など)
ブラウザ ─ https://static.sl-navi.com/<JS / CSS / フォント> ─▶ SWA
```

- バックエンドが `index.html` を返すのは `SPA_PATHS` に列挙したパスだけ。catch-all ではない。
  それ以外のパスは 404 (JSON)。今の一覧:
  `/` `/kenzen/{tagid}` `/adult` `/adult/{tagid}` `/all` `/all/{tagid}` `/event`
  `/createEvent` `/createEvent/{rest}` `/updateEvent/{rest}` `/about` `/gift`
  `/search/{keyword}` `/event/{eid:int}` `/analytics/{keyword}`
- `/event/{id}` と `/search/{flag}` は、ボットには OGP 用の `og.html` を返す。
- バックエンドは `index.html` の中身を書き換えない。

## 範囲

### やること

1. Vue 3 + Vite に移す。画面の見た目と動きは今と同じにする。
2. radio 再生機能を消す。
3. 動かない画面と、使われていないコードを消す。
4. GitHub Actions の workflow から旧 VM 向けの手順を消す。

### やらないこと

- 画面のデザインや機能の追加・変更 (移行に伴って避けられないものを除く)
- TypeScript 化、テストの全面整備
- バックエンドの変更 (必要なものはバックエンド側に依頼する。R2.3)
- 配信先の変更 (SWA のまま)

## 要件

### R1 Vue 3 + Vite への移行

- R1.1 Vue 3 と Vite で、今と同じ画面・同じ動きを再現すること。
- R1.2 `npm run build` の出力先は `dist` のままにすること (SWA の `output_location`)。
- R1.3 `dist/index.html` は SWA のルート (`/index.html`) に置かれ、JS / CSS / フォントは
  `https://static.sl-navi.com/` からの絶対 URL で参照されること
  (今の `publicPath: 'https://static.sl-navi.com/'` と同じ。バックエンドがこの index.html を
  sl-navi.com で返すため)。
- R1.4 `sl-navi.com` のページが `static.sl-navi.com` の JS / CSS を読めること
  (Vite は `<script type="module" crossorigin>` を出すので CORS が要る。
  `staticwebapp.config.json` の `Access-Control-Allow-Origin` で足りるかを確かめる)。
- R1.5 SWA のビルドで動く Node のバージョンを `package.json` の `engines` で指定すること。
- R1.6 Vue 2 専用のライブラリは、Vue 3 で動くものに置き換えるか、自前の小さな実装にするか、
  使っていなければ消すこと。対象:

  | ライブラリ | 使っている所 |
  |---|---|
  | `bootstrap-vue` | modal、popover、collapse、navbar、badge、アイコン |
  | `vue-google-adsense` (+ `vue-script2`) | 広告枠 (ShopList、EventList、TagList、ViewGift、ViewSlnavi) |
  | `vue-head` | App.vue の title / meta |
  | `@gtm-support/vue2-gtm` | router の GTM 連携 |
  | `vue-social-sharing` v3 | 共有ボタン (ShopElement、EventList、ViewEvent) |
  | `@fullcalendar/vue` v5 | ViewEvent のカレンダー |
  | `vue-cookies` | `badShops`、`t`、`dev` の Cookie |
  | `vue-router` 2、`vuex2` | ルーティング、radio の状態 |
  | `vue-analytics` | 使っているかを design で確かめる |

- R1.7 広告 (AdSense) と GTM は、今と同じ枠・同じ ID で動くこと。

### R2 ルーティング

- R2.1 Vue Router は history モードのまま、URL のパスを変えないこと。
- R2.2 フロントのルートは、バックエンドの `SPA_PATHS` に含まれるものだけにすること
  (含まれないパスは直接開くと 404 になるため)。
- R2.3 ルートを消す・足すときは、バックエンドの `SPA_PATHS` の変更をバックエンド側に依頼すること。
  今回の依頼: `/analytics/{keyword}` を外す (R4.1)。

### R3 API と静的ファイル

- R3.1 API は今と同じパスを `sl-navi.com` (同一オリジン) で呼ぶこと。
  今使っているもののうち、廃止済みの `/api/analytics` と Job 系 (R4) 以外はそのまま使える。
- R3.2 応答の解析は変えないこと (応答は旧 DRF と同じ形)。
  未ログイン時の `/event/api/user` は 204 で本文なし。
- R3.3 X ログインの入口は `sl-navi.com/user/login/twitter/?next=...` のままにすること
  (X の callback 登録がこのドメインのため)。
- R3.4 静的ファイル (`https://sl-navi.com/static/...`) は今のまま使うこと。
- R3.5 `csrftoken` Cookie の読み取りと `X-CSRFTOKEN` ヘッダの送信を消すこと
  (新しいバックエンドはこの Cookie を発行しないので、今は常に空になっている)。

### R4 消すもの

- R4.1 `ViewAnalytics` とルート `/analytics/:flag`、`highcharts-vue`
  (`/api/analytics` が廃止されたため)。
- R4.2 radio 再生機能: `src/store/` (Vuex の状態はすべて radio 用)、`ShopElement` の
  radio リンク (`radio.sl-navi.com/radio.cgi`) と `playRadio`、`radiomv.org` の取得。
  API の応答に残る `radio` 項目は無視する。
- R4.3 Job 系: `ViewJob`、`JobList`、`JobGenre`、ルート `/job`
  (`/event/api/job`、`/event/api/jobgenre` は廃止済み。`/job` は `SPA_PATHS` にも無い)。
- R4.4 `ViewEditShop` とルート `/editShop` (どこからもリンクされておらず、`SPA_PATHS` にも無い。
  `vue-ctk-date-time-picker` はここでしか使っていない)。→ 確認したいこと 1
- R4.5 旧ファイル: `src/router/index.js.org`、`vue.config-serve.js`、`babel.config.js`、
  `jsconfig.json` (Vite で要らなくなるもの)。→ 確認したいこと 2

### R5 デプロイ (GitHub Actions)

- R5.1 workflow の「Copy to AzVM」ステップと `.github/workflows/deploy-AzVM.yml.disabled` を消すこと。
  radio 削除と同じ変更 (同じ PR) で行う (ユーザー判断)。
- R5.2 SWA へのデプロイ手順はそのまま使うこと。
- R5.3 マージのあと、GitHub の secret `ID_RSA` `USERNAME` `PORT` `HOST` `PATH_WEBROOT` を
  消すようユーザーに案内すること。

### R6 確かめ方と切り戻し

- R6.1 ローカルでは Vite の dev server の proxy で `/api` `/event/api` `/user` `/static` を
  `https://sl-navi.com` に向けて、本番の API で動かせること。
- R6.2 本番での最終確認は `sl-navi.com` で行うこと。sl-navi.com の index.html は常に
  SWA 本番の `/index.html` を取るので、SWA の PR プレビューは sl-navi.com 経由では見られない
  (プレビュー URL を直接開くと API が別オリジンになり動かない)。
  PR プレビューで確かめられるのは、ビルドが通ることと、静的な見た目まで。
- R6.3 master へのマージがそのまま本番の切り替えになる。切り戻しは revert して再デプロイで行えること。
- R6.4 確かめる画面と操作の一覧 (チェックリスト) を design で作り、マージの後に本番で一通り確かめること。

## 確認したいこと

1. `ViewEditShop` (`/editShop`、「施設登録/更新画面」) は消してよいか。
   どこからもリンクされておらず、バックエンドの `SPA_PATHS` にも無いので、本番では直接開けない。
2. repo 直下の `memo.txt` と `serve.log` (追跡されている) も消してよいか。

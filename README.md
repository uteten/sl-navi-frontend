# sl-navi

https://sl-navi.com のフロントエンドのコード (Vue 3 + Vite)。
Azure Static Web Apps (static.sl-navi.com) にデプロイし、index.html は sl-navi.com から返る。

Node 22 以上が要る。

## セットアップ

```
npm install
```

## 開発 (http://localhost:5173)

API と `/static` は本番 (https://sl-navi.com) へ中継する。書き込みは本番の DB に入る。

```
npm run dev
```

## 本番と同じ形で確認 (http://localhost:4173)

ページ (4173) とアセット (4174) を別のオリジンから配る。

```
npm run preview:split
```

## ビルドと lint

```
npm run build
npm run lint
```

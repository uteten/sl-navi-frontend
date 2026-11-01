// ローカル確認用 (npm run serve)。API と静的ファイルは本番 (https://sl-navi.com) へ中継する。
// セッション Cookie は Domain=sl-navi.com で返るので、localhost で使えるよう Domain を外す。
const { defineConfig } = require('@vue/cli-service')
const target = 'https://sl-navi.com'
const proxy = { target, changeOrigin: true, cookieDomainRewrite: { '*': '' } }
module.exports = defineConfig({
  publicPath: '/',
  transpileDependencies: true,
  devServer: {
    proxy: {
      '^/api/': proxy,
      '^/event/api/': proxy,
      '^/user/': proxy,
      '^/static/': proxy
    }
  }
})

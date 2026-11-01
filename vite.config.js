import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// ローカル確認用: API と静的ファイルは本番 (https://sl-navi.com) へ中継する (design D5、D6)。
// セッション Cookie は Domain=sl-navi.com で返るので、localhost で使えるよう Domain を外す。
const upstream = { target: 'https://sl-navi.com', changeOrigin: true, cookieDomainRewrite: { '*': '' } }
const proxy = { '/api/': upstream, '/event/api/': upstream, '/user/': upstream, '/static/': upstream }

// 本番: index.html は sl-navi.com が返し、JS / CSS は static.sl-navi.com (SWA) から読む (R1.3)。
// split: その形をローカルで再現する (npm run preview:split、design D6 の段階 2)。
export const SPLIT_PAGE_PORT = 4173
export const SPLIT_ASSET_PORT = 4174

export default defineConfig(({ command, mode }) => ({
  // /static/... などの絶対パスは sl-navi.com の静的ファイルなので、ビルドに取り込まない
  plugins: [vue({ template: { transformAssetUrls: { includeAbsolute: false } } })],
  base: command === 'build'
    ? (mode === 'split' ? `http://localhost:${SPLIT_ASSET_PORT}/` : 'https://static.sl-navi.com/')
    : '/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) }
  },
  build: {
    outDir: mode === 'split' ? 'dist-split' : 'dist'
  },
  server: { proxy },
  preview: { proxy }
}))

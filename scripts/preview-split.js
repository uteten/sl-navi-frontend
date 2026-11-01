// 本番と同じく、ページとアセットを別のオリジンから配る (design D6 の段階 2)。
//   http://localhost:4173  ページの口。index.html を返し、API は https://sl-navi.com へ中継
//   http://localhost:4174  アセットの口。CORS で 4173 を許可
import { preview } from 'vite'
import { SPLIT_ASSET_PORT, SPLIT_PAGE_PORT } from '../vite.config.js'

const page = `http://localhost:${SPLIT_PAGE_PORT}`
const common = { mode: 'split', build: { outDir: 'dist-split' } }
const pageServer = await preview({ ...common, preview: { port: SPLIT_PAGE_PORT, strictPort: true } })
const assetServer = await preview({
  ...common,
  preview: { port: SPLIT_ASSET_PORT, strictPort: true, cors: { origin: page } }
})
pageServer.printUrls()
assetServer.printUrls()
console.log(`\n${page} を開く`)

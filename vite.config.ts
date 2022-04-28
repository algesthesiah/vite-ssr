// https://vitejs.dev/config/
import { omitBy } from 'lodash'
import { defineConfig, loadEnv, UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import legacy from '@vitejs/plugin-legacy'
import ssr from 'vite-plugin-ssr/plugin'

// Packages we want in the vendor aka the deps needed in the entire app.
const globalVendorPackages = [
  'react',
  'react-dom',
  'react-router-dom',
  '@arco-design/web-react',
]

function renderChunks(deps: Record<string, string>) {
  let chunks = {}
  Object.keys(deps).forEach((key) => {
    if (globalVendorPackages.includes(key)) return
    chunks[key] = [key]
  })
  return chunks
}
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...omitBy(loadEnv(mode, process.cwd()), Boolean),
  }
  return defineConfig({
    plugins: [
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      createStyleImportPlugin({
        libs: [
          // 如果没有你需要的 resolve，可以在 lib 内直接写，也可以给我们提供 PR
          {
            libraryName: '@arco-design/web-react',
            esModule: true,
            resolveStyle: (name) => {
              return `@arco-design/web-react/es/${name}/style/css.js`
            },
          },
        ],
      }),
      react(),
      ssr(),
      tsconfigPaths(),
    ],
    build: {
      outDir: './dist',
      sourcemap: true,
      // rollupOptions: {
      //   output: {
      //     manualChunks: {
      //       vendor: globalVendorPackages,
      //       ...renderChunks(dependencies),
      //     },
      //   },
      // },
    },
    define: {
      __DEV__: process.env.NODE_ENV !== 'production',
    },
    css: {
      modules: {
        generateScopedName: '[local]-[hash:base64:5]',
      },
    },
    // ssr: {
    //   external: ['@arco-design/web-react'],
    // },
    // resolve: {
    //   alias: {},
    // },
  } as UserConfig)
}

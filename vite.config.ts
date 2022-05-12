// https://vitejs.dev/config/
import { omitBy } from 'lodash'
import { defineConfig, loadEnv, UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
// import { createStyleImportPlugin } from 'vite-plugin-style-import'
import legacy from '@vitejs/plugin-legacy'
import ssr from 'vite-plugin-ssr/plugin'
import macrosPlugin from 'vite-plugin-babel-macros'

// Packages we want in the vendor aka the deps needed in the entire app.
// const globalVendorPackages = ['react', 'react-dom', 'react-router-dom', '@arco-design/web-react']

// function renderChunks(deps: Record<string, string>) {
//   let chunks = {}
//   Object.keys(deps).forEach(key => {
//     if (globalVendorPackages.includes(key)) return
//     chunks[key] = [key]
//   })
//   return chunks
// }
export default ({ mode }) => {
  process.env = {
    ...process.env,
    ...omitBy(loadEnv(mode, process.cwd()), Boolean),
  }
  return defineConfig({
    plugins: [
      macrosPlugin(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      react(),
      // createStyleImportPlugin({
      //   libs: [
      //     // TODO: 带改 arco 源码适配完美的按需加载
      //     {
      //       libraryName: '@arco-design/web-react',
      //       esModule: true,
      //       resolveStyle: name => {
      //         return `@arco-design/web-react/es/${name}/style/css.js`
      //       },
      //     },
      //   ],
      // }),
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
  } as UserConfig)
}

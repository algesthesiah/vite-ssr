// https://vitejs.dev/config/
import { defineConfig, loadEnv, UserConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'
// import { createStyleImportPlugin } from 'vite-plugin-style-import'
import legacy from '@vitejs/plugin-legacy'
import ssr from 'vite-plugin-ssr/plugin'
import macrosPlugin from 'vite-plugin-babel-macros'
import { createStyleImportPlugin } from 'vite-plugin-style-import'

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
  loadEnv(mode, process.cwd())
  return defineConfig({
    plugins: [
      macrosPlugin(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      react(),
      createStyleImportPlugin({
        libs: [
          {
            // libraryNameChangeCase: 'camelCase',
            libraryName: 'react-vant',
            resolveStyle: name => {
              if (['area', 'config-provider', 'datetime-picker', 'hooks'].includes(name)) {
                return ''
              }
              return `react-vant/es/${name}/style/index.css`
            },
          },
        ],
      }),
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
    base: '/',
    baseAsset: '/',
  } as UserConfig)
}

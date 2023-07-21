import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import Pages from 'vite-plugin-pages';
import Markdown from 'vite-plugin-vue-markdown'
import AutoImport from 'unplugin-auto-import/vite'
import Component from 'unplugin-vue-components/vite'
import IconResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'
import Inspect from 'vite-plugin-inspect'
import SVG from 'vite-svg-loader'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '~/',
        replacement: `${new URL('src', import.meta.url)}`
      }
    ]
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      '@vueuse/core',
      'dayjs',
      'dayjs/plugin/localizedFormat'
    ]
  },

  plugins: [
    Unocss(),

    vue({
      include: [/\.vue$/, /\.md$/],
      script: {
        defineModel: true,
      }
    }),

    Pages({
      extensions: ['vue', 'md'],
      dirs: 'pages',
      // extendRoute(route) {
      //   const path = new URL(route.components.slice(1), import.meta.url).pathname;
      //   return route;
      // }
    }),

    Markdown(),

    AutoImport({
      include: [
        'vue',
        'vue-router',
        '@vueuse/core',
        '@unhead/vue',
      ]
    }),

    Component({
      extensions: ['vue', 'md'],
      dts: true,
      include: [/\.vue$/, /\.vue\/?vue/, /\.md$/],
      resolvers: [
        IconResolver({
          prefix: '',
        })
      ]
    }),

    Inspect(),

    Icons({
      defaultClass: 'inline',
      defaultStyle: 'vertical-align:sub;'
    }),

    SVG({
      svgo: false,
      defaultImport: 'url',
    }),
  ],

  build: {
    rollupOptions: {
      onwarn(warning, next) {
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') {
          next(warning);
        }
      }
    }
  },
})

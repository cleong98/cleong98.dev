import '@unocss/reset/tailwind.css'
import 'uno.css'
import Nprogress from 'nprogress'
import FloatingVue from 'floating-vue'
import autoRoutes from 'pages-generated'
import { setupRouterScroller } from 'vue-router-better-scroller'
import { ViteSSG } from 'vite-ssg'
import dayjs from 'dayjs'
import LocalizedFormat from 'dayjs/plugin/localizedFormat'

// import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

const routes = autoRoutes.map((i) => {
  return {
    ...i,
    alias: i.path.endsWith('/')
      ? `${i.path}index.html`
      : `${i.path}.html`
  }
})

// createApp(App).mount('#app')

export const createApp = ViteSSG(App, {
  routes,
}, ({ router, app, isClient }) => {
  dayjs.extend(LocalizedFormat)
  app.use(FloatingVue)
  if (isClient) {
    const html = document.querySelector('html')!
    setupRouterScroller(router, {
      selectors: {
        body(ctx) {
          // only do the sliding transition when the scroll position is not 0
          if (ctx.savedPosition?.top)
            html.classList.add('no-sliding')
          else
            html.classList.remove('no-sliding')
          return true
        }
      },
      behavior: 'auto',
    })

    router.beforeEach(() => {
      Nprogress.start()
    })

    router.afterEach(() => {
      Nprogress.done()
    })
  }
}) 

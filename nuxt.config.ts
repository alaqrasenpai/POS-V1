
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,

  modules: [
    'nuxtjs-naive-ui'
  ],

  build: {
    transpile: [
      'naive-ui',
      'vueuc',
      '@css-render/vue3-ssr',
      '@vicons/ionicons5'
    ]
  },

  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/pOS-V1/' : '/',
    buildAssetsDir: '_nuxt'
  },

  router: {
    options: {
      hashMode: process.env.NODE_ENV === 'production'
    }
  },

  compatibilityDate: '2024-11-11',
})
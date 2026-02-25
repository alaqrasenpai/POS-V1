
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false,

  modules: [
    'nuxtjs-naive-ui'
  ],

  build: {
    transpile:
      process.env.NODE_ENV === 'production'
        ? [
          'naive-ui',
          'vueuc',
          '@css-render/vue3-ssr',
          '@vicons/ionicons5'
        ]
        : ['@vicons/ionicons5']
  },

  compatibilityDate: '2024-11-11',
})
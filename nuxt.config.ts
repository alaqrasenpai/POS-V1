import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

export default defineNuxtConfig({
  vite: {
    plugins: [
      AutoImport({
        imports: [
          'vue',
          'vue-router',
        ],
        dts: 'types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [NaiveUiResolver()],
        dts: 'types/components.d.ts',
      }),
    ],
  },
  
})

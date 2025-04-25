import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: false },
    css: ['~/assets/css/main.css'],

    autoImports: {
        dirs: ['utils']
    },

    vite: {
        plugins: [
            tailwindcss(),
        ],
    },

    colorMode: {
        classSuffix: '',
        preference: 'system',
        fallback: 'light',
        classPrefix: '',
        componentName: 'ColorScheme',
        storageKey: 'nuxt-color-mode'
    },

    modules: ['nuxt-echarts', '@nuxt/icon', '@nuxtjs/color-mode'],
})

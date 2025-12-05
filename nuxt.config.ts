// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  devServer: {
    port: 3322,
  },
  // GitHub Pages deployment
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/vulpes-theme-lab/' : '/',
  },
  // Enable static site generation
  ssr: false,
  modules: ['@nuxtjs/tailwindcss'],
  css: ['~/assets/css/main.css'],
  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY || '',
    },
  },
})

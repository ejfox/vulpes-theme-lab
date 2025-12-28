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
    head: {
      link: [
        // Monaspace font family - all variants
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-argon@5.0.1/400.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-argon@5.0.1/700.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-krypton@5.0.1/400.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-krypton@5.0.1/700.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-neon@5.0.1/400.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-neon@5.0.1/700.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-xenon@5.0.1/400.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-xenon@5.0.1/400-italic.css' },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@fontsource/monaspace-radon@5.0.1/400.css' },
      ],
    },
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

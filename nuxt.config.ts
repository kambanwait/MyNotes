// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/fonts',
    '@nuxt/eslint',
    'nuxt-auth-utils',
    '@pinia/nuxt',
  ],

  build: {
    // transpile: ['~/prisma/client'],
  },
})
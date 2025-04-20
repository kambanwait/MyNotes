// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "url";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  alias: {
    '@': fileURLToPath(new URL('./', import.meta.url)),
  },

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

  // runtimeConfig: {
  //   session: {
  //     name: 'nuxt-session',
  //     password: process.env.NUXT_SESSION_PASSWORD || '',
  //     cookie: {
  //       sameSite: 'lax',
  //       secure: process.env.NODE_ENV === 'production',
  //     },
  //   },
  // },
})
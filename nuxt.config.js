import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    version: '1.0',
    storage: 'attachments',
    container: 'masakinaja',
    cdn: 'https://masakinaja.sgp1.cdn.digitaloceanspaces.com'
  },
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: 'member-masakinaja',
    title: 'member-masakinaja',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', type: 'image/x-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/npm/@mdi/font@6.9.96/css/materialdesignicons.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Mulish&display=swap'
      }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/main.scss'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: '@/plugins/vuex-persist', ssr: false },
    '@/plugins/axios',
    '@/plugins/filter',
    '@/plugins/v-money',
    '@/plugins/cypress'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/dayjs',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
    ['nuxt-supabase', {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY
    }]
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://api.masakinaja.com/api'
        : process.env.NODE_ENV === 'staging'
          ? 'https://api.masakinaja.id/api'
          : 'http://localhost:3000/api',
    https: process.env.NODE_ENV === 'production'
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: false,
    treeShake: true,
    theme: {
      dark: false,
      themes: {
        light: {
          primary: '#d23f57',
          accent: colors.grey.darken3,
          secondary: '#fc6758',
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: '#2CAE66',
          greylight: '#E7ECF5'
        },
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    transpile: ['lodash.clonedeep', 'lodash.debounce']
  }
}

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: 'universal',
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  /** Environment variables **/
  env: {
    BASE_IMAGE_URL:
      process.env.BASE_IMAGE_URL ||
      'https://s3-us-west-2.amazonaws.com/prima-pictures',
    GRAPHQL_URL:
      process.env.GRAPHQL_URL ||
      'https://graph-staging.primafacieapp.com/graphql',
  },
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: 'Admin Panel',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        href:
          'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        rel: 'stylesheet',
        integrity:
          'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN',
        crossorigin: 'anonymous',
      },
      { rel: 'stylesheet', href: 'css/ubold/bootstrap-creative.min.css' },
      { rel: 'stylesheet', href: 'css/ubold/app-creative.min.css' },
      {
        href:
          'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
        rel: 'stylesheet',
      },
      { rel: 'stylesheet', href: 'css/main.css' },
      { rel: 'stylesheet', href: 'css/vue-datatable.css' },
    ],
    script: [
      {
        src: 'https://kit.fontawesome.com/2d17bb5b4e.js',
        crossorigin: 'anonymous',
      },
      {
        src:
          'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
        integrity:
          'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo',
        crossorigin: 'anonymous',
      },
      { src: 'https://js.stripe.com/v3/' },
      { src: 'https://cdn.jsdelivr.net/npm/sweetalert2@9' },
      { src: 'https://cdn.jsdelivr.net/npm/promise-polyfill' },
      { src: 'js/vendor.min.js' },
    ],
  },

  loading: {
    height: '5px',
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/axios',
    { src: '@/plugins/filters.js' },
    { src: '@/plugins/jquery.js', ssr: false },
    { src: '@/plugins/bootstrap-table.js', ssr: false },
    { src: '@/plugins/vue-good-table', ssr: false },
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/apollo', '@nuxtjs/axios'],

  apollo: {
    clientConfigs: {
      default: '~/plugins/apollo-config.js',
    },
  },

  // Axios module configuration
  axios: {
    baseURL: process.env.API_URL,
  },

  router: {
    linkExactActiveClass: 'active',
    middleware: ['authenticated'],
  },

  pageTransition: 'page',
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
};

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
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: process.env.npm_package_name || '',
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
        rel: 'stylesheet',
        href:
          'https://gitcdn.github.io/bootstrap-toggle/2.2.2/css/bootstrap-toggle.min.css',
      },
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
    ],
    script: [
      {
        src: 'https://kit.fontawesome.com/2d17bb5b4e.js',
        crossorigin: 'anonymous',
      },
      {
        src: 'https://code.jquery.com/jquery-3.5.1.slim.min.js',
        integrity:
          'sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj',
        crossorigin: 'anonymous',
      },
      {
        src:
          'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
        integrity:
          'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo',
        crossorigin: 'anonymous',
      },
      {
        src:
          'https://gitcdn.github.io/bootstrap-toggle/2.2.2/js/bootstrap-toggle.min.js',
      },
      { src: 'https://js.stripe.com/v3/' },
      { src: 'https://cdn.jsdelivr.net/npm/sweetalert2@9' },
      { src: 'https://cdn.jsdelivr.net/npm/promise-polyfill' },
      { src: 'js/vendor.min.js' }
    ],
  },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [],
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
  modules: ['@nuxtjs/axios'],

  // apollo: {
  //   clientConfigs: {
  //     default: {
  //       httpEndpoint:
  //         'https://graph-staging.primafacieapp.com/graphql?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRJZCI6OTYsInRlbmFudENvZGUiOiJCNkdMVTIxNjA0MTk4MTciLCJlbWFpbCI6ImphbWVzQGJldHpvbGRsYXcuY29tIiwidXNlcklkIjoxLCJzZXNzaW9uSWQiOiI5OWJlODllMy0xMzBkLTQ3N2YtOGNhNi05YTg3YTgxNmM3ZmEiLCJpYXQiOjE1OTc5NDIxNjksImV4cCI6MTU5ODU0Njk2OX0.F7Y_qxHMjBHJf3EAJ_T9HemTXCgj98JASFbowmv6GIs',
  //     },
  //   },
  // },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
};

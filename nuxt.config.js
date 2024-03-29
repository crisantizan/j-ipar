import path from 'path';
import fs from 'fs';

const generateServerConfig = () => {
  const config = {
    port: 8090, // default: 3000
    host: '0.0.0.0', // default: localhost,
  };

  if (process.env.NODE_ENV !== 'production') {
    config.https = {
      key: fs.readFileSync(path.resolve(__dirname, 'server/https-certificates/localhost.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'server/https-certificates/localhost.crt')),
    };
  }

  return config;
};

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
  /** server config **/
  server: generateServerConfig(),
  /** Environment variables **/
  env: {
    BASE_IMAGE_URL:
      process.env.BASE_IMAGE_URL || 'https://s3-us-west-2.amazonaws.com/prima-pictures',
    GRAPHQL_URL: process.env.GRAPHQL_URL || 'https://graph-staging.primafacieapp.com/graphql/',
    PRIMA_URL: process.env.PRIMA_URL || 'https://staging.primafacieapp.com/',
    STRIPE_PUBLISHABLE_KEY:
      process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_2AcUtig3rQa3DK0LTJQIGTrm',
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
      { rel: 'icon', type: 'image/x-icon', href: '/prima.ico' },
      {
        href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
        rel: 'stylesheet',
        integrity: 'sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN',
        crossorigin: 'anonymous',
      },

      { rel: 'stylesheet', href: '/css/ubold/bootstrap-creative.min.css' },
      { rel: 'stylesheet', href: '/css/ubold/app-creative.min.css' },

      {
        href:
          'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
        rel: 'stylesheet',
      },
      { rel: 'stylesheet', href: '/css/main.css' },
      { rel: 'stylesheet', href: '/css/dropdown.css' },
      { rel: 'stylesheet', href: '/css/vue-datatable.css' },
    ],
    script: [
      {
        src: 'https://kit.fontawesome.com/2d17bb5b4e.js',
        crossorigin: 'anonymous',
      },
      {
        src: 'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
        integrity: 'sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo',
        crossorigin: 'anonymous',
      },
      { src: 'https://js.stripe.com/v3/' },
      { src: 'https://cdn.jsdelivr.net/npm/sweetalert2@9' },
      // { src: 'https://cdn.jsdelivr.net/npm/promise-polyfill' },
      { src: '/js/vendor.min.js' },
    ],
  },
  loading: false,
  // loading: {
  //   height: '5px',
  //   color: '#3283f6',
  // },
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
    '~/plugins/filters.js',
    '~/plugins/jquery.client.js',
    '~/plugins/bootstrap-table.client.js',
    '~/plugins/vue-good-table.client.js',
    '~/plugins/v-mask.client.js',
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
  modules: ['@nuxtjs/axios', '@nuxtjs/toast'],

  // Axios module configuration
  axios: {
    baseURL: process.env.API_URL,
  },

  toast: {
    iconPack: 'fontawesome',
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

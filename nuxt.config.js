module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],

    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],

  },
  /*
  ** Customize the progress-bar color
  */
loading: { color: '#FFEB3B' },
  /*
  ** Global CSS
  */
css: [
  "~/assets/main.css",
  "~/assets/pdf.css"
],

build: {
  publicPath: '/dist/'
},

server: {
  port: 5000
},

pageTransition: {
  name: "fade",
  mode: "out-in"
},
/*
** Plugins to load before mounting the App
*/
plugins: [
  { src: '~/plugins/Excel.js', ssr: false }
],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa'
  ],

  // pwa: {
  //   manifest: {
  //     name: 'POS',
  //     background_color: '#0F4345',
  //     theme_color: '#0F4345'
  //   }
  // },
  /*
  ** Nuxt.js modules
  */

 modules: [
  // Doc: https://axios.nuxtjs.org/usage
  '@nuxtjs/axios',
  '@nuxtjs/auth',
  '@nuxtjs/toast'
],

env: {
  WS_URL: process.env.WS_URL || 'https://tanager.posquick.com'
  // WS_URL: process.env.WS_URL || 'http://127.0.0.1:5000'
},

/*
** Axios module configuration
** See https://axios.nuxtjs.org/options
*/

axios: {
  baseURL: 'https://api-tanager.posquick.com/api'
  // baseURL: 'http://127.0.0.1:8000/api'
},

auth: {
  strategies: {
    local: {
      endpoints: {
        register: { url: '/auth/register', method: 'post', propertyName: 'token' },
        login: { url: '/auth/login', method: 'post', propertyName: 'token' },
        logout: { url: '/auth/logout', method: 'post' },
        user: { url: '/user', method: 'get', propertyName: '' }
      },
    }
  }
},
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],

    theme:{
      themes:{
        light:{
          primary: "#006064",
          accent: "#424242",
          secondary: "#ff8f00",
          info: "#26a69a",
          warning: "#ffc107",
          error: "#dd2c00",
          success: "#00e676"
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}

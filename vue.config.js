module.exports = {
  lintOnSave: false,
  chainWebpack: (config) => {
    //忽略的打包文件
    config.externals({
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT',
    })
  },
  publicPath: process.env.NODE_ENV === 'production'
    ?'/admin/'
    :'/',
    devServer: {
      // host: '127.0.0.1',
      disableHostCheck: true,
      proxy: {
        '/api': {
          target: 'http://172.19.10.14:8015',
          changeOrigin: true,
          // pathRewrite: {
          //   '^/api': ''
          // },
        }
      }
    }
}
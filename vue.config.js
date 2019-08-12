const output = {
  globalObject: 'this'
}

module.exports = {
  css: {
    extract: false
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/VDocViewer/'
    : '/',
  configureWebpack: {
    devServer: {
      watchOptions: {
        poll: true
      }
    },
    output
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('vue-svg-loader')
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: Infinity }))
  }
}

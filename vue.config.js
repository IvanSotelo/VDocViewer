const output = {
  globalObject: 'this'
}

module.exports = {
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
  }
}

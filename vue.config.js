const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true
})

module.exports = {
  devServer: {
    port: 3000
  },
  // outputDir: 'dist',
  // publicPath: process.env.NODE_ENV === 'production' ? '/testTask/' : '/'
  publicPath: '/testTask'
};
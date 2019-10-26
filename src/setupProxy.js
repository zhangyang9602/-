const proxy = require('http-proxy-middleware')

module.exports = function(app) {
  // api 代表代理路径
  // target 目标服务器的地址
  app.use(
    proxy('/api', {
      target: 'http://localhost:8080/', 
      changeOrigin: true, // 跨域时一般都设置该值 为 true
      pathRewrite: { // 重写接口路由
        '^/api': '' // 这样处理后，最终得到的接口路径为： http://localhost:8080/xxx
      }
    })
  )
}

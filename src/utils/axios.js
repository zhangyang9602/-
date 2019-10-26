import React from 'react'
import axios from 'axios'

// 导入token
import { removeToken, getToken } from './index.js'

// 加载开发阶段配置文件

// 设置基地址
axios.defaults.baseURL = process.env.REACT_APP_URL

// 通过拦截器设置请求头
axios.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers.Authorization = getToken()
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(response => {
  // token 过期啦
  if (response.data.status === 400) {
    removeToken()
  }

  return response
})

React.Component.prototype.$axios = axios

export { axios }

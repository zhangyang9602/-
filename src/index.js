import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// 导入字体文件
import './assets/fonts/iconfont.css'

// 导入react-virtualized样式文件
import 'react-virtualized/styles.css'

// 全局样式
import './index.css'

// 执行axios
import './utils/axios'

ReactDOM.render(<App />, document.getElementById('root'))

import React from 'react'

import { NavBar } from 'antd-mobile'

import { withRouter } from 'react-router-dom'

// 参数校验
import PropTypes from 'prop-types'

// 导入样式
// import './index.scss'
import styled from './index.module.scss'

function NavHeader({ children, history, className, rightContent }) {
  return (
    <NavBar
      className={[styled.navBar, className].join(' ')}
      mode="light"
      icon={<i className="iconfont icon-back" />}
      onLeftClick={() => history.goBack()}
      rightContent={rightContent}
    >
      {children}
    </NavBar>
  )
}

NavHeader.propTypes = {
  children: PropTypes.string.isRequired
}

export default withRouter(NavHeader)

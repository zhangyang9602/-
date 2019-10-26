import React from 'react'
import { withRouter } from 'react-router-dom'

import { Flex } from 'antd-mobile'

// 导入样式
import styled from './index.module.scss'

import PropTypes from 'prop-types'

function SearchHeader({ cityName, className, history }) {
  return (
    <Flex className={[styled.root, className].join(' ')}>
      <Flex className={styled.searchLeft}>
        <div
          className={styled.location}
          onClick={() => {
            history.push('/citylist')
          }}
        >
          <span>{cityName}</span>
          <i className="iconfont icon-arrow" />
        </div>
        <div className={styled.searchForm}>
          <i className="iconfont icon-search" />
          <span>请输入小区或地址</span>
        </div>
      </Flex>
      <i className="iconfont icon-map" onClick={() => history.push('/map')} />
    </Flex>
  )
}

// 默认值
SearchHeader.defaultProps = {
  className: ''
}

// 类型检查
SearchHeader.propTypes = {
  cityName: PropTypes.string.isRequired,
  className: PropTypes.string
}

export default withRouter(SearchHeader)

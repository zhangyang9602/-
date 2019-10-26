import React, { Component, createRef } from 'react'

import styles from './index.module.scss'

import PropTypes from 'prop-types'

class Sticky extends Component {
  // 占位符Ref
  placeholderRef = createRef()
  // 内容区域Ref
  contentRef = createRef()

  // 处理滚动
  handleScroll = () => {
    // 获取到占位及内容区域的dom
    const placeholderEl = this.placeholderRef.current
    const contentEl = this.contentRef.current

    // 获取到滚动出去的距离
    const { top } = placeholderEl.getBoundingClientRect()

    if (top < 0) {
      // 内容区域不可见
      placeholderEl.style.height = `${this.props.height}px`
      contentEl.classList.add(styles.fixed)
    } else {
      placeholderEl.style.height = `0px`
      contentEl.classList.remove(styles.fixed)
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  render() {
    return (
      <div>
        {/* 占位符 */}
        <div ref={this.placeholderRef} />
        {/* 内容区域 */}
        <div ref={this.contentRef}>{this.props.children}</div>
      </div>
    )
  }
}

Sticky.propTypes = {
  height: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired
}

export default Sticky

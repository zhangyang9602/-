import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter/index.jsx'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  onChange = id => {
    let { selectedValues } = this.state

    if (selectedValues.includes(id)) {
      selectedValues = selectedValues.filter(item => item !== id)
    } else {
      selectedValues.push(id)
    }

    this.setState({
      selectedValues
    })
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    return data.map(item => {
      const isSelected = this.state.selectedValues.includes(item.value)
      return (
        <span
          key={item.value}
          onClick={() => {
            this.onChange(item.value)
          }}
          className={[styles.tag, isSelected ? styles.tagActive : ''].join(' ')}
        >
          {item.label}
        </span>
      )
    })
  }

  render() {
    const {
      data: { characteristic, floor, oriented, roomType },
      type,
      onSave,
      onCancel
    } = this.props

    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div
          className={styles.mask}
          onClick={() => {
            onCancel(type)
          }}
        />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          cancelText="清除"
          className={styles.footer}
          onSave={() => {
            onSave(type, this.state.selectedValues)
          }}
          onCancel={() => {
            this.setState({ selectedValues: [] })
          }}
        />
      </div>
    )
  }
}

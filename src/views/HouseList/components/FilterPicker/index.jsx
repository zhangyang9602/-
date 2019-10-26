import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter/index.jsx'

export default class FilterPicker extends Component {
  state = {
    value: this.props.defaultValue
  }

  // 更改了选中的值
  onChange = value => {
    this.setState({
      value
    })
  }

  // componentDidUpdate(preProps){
  //   if (preProps.defaultValue !== this.props.defaultValue){
  //     this.setState({
  //       value: this.props.defaultValue
  //     })
  //   }
  // }

  render() {
    const { onCancel, onSave, data, cols, type } = this.props
    const { value } = this.state
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={data}
          onChange={this.onChange}
          cols={cols}
          value={value}
        />

        {/* 底部按钮 */}
        <FilterFooter
          onCancel={onCancel}
          onSave={() => {
            onSave(type, value)
          }}
        />
      </>
    )
  }
}

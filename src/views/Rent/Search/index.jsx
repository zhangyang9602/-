import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import styles from './index.module.scss'

import _ from 'lodash'

import { getCity } from '../../../utils/'

const { value } = getCity()

export default class RentSearch extends Component {
  state = {
    searchText: '',
    tipsList: []
  }

  search = _.debounce(async val => {
    const result = await this.$axios.get('area/community', {
      params: {
        id: value,
        name: val
      }
    })

    if (result.data.status === 200) {
      this.setState({
        tipsList: result.data.body.map(item => ({
          community: item.community,
          communityName: item.communityName
        }))
      })
    }
  }, 500)

  // 处理关键字搜索
  handleSearchText = val => {
    if (val.trim() === '') {
      return this.setState({
        searchText: '',
        tipsList: []
      })
    }

    this.setState({
      searchText: val
    })

    // 发送网络请求
    this.search(val)
  }

  // 选中处理
  toggleSelect = ({ community, communityName }) => {
    this.props.history.replace('/rent/add', {
      id: community,
      name: communityName
    })
  }

  // 渲染搜索出来的建议列表
  renderTips = tipsList => {
    return (
      <ul className={styles.tips}>
        {tipsList.map(item => {
          return (
            <li
              onClick={this.toggleSelect.bind(this, item)}
              key={item.community}
              className={styles.tip}
            >
              {item.communityName}
            </li>
          )
        })}
      </ul>
    )
  }

  render() {
    const { searchText, tipsList } = this.state

    return (
      <div className={styles.root}>
        <SearchBar
          value={searchText}
          onCancel={() => {
            this.setState({ searchText: '' })
            this.props.history.replace('/rent/add')
          }}
          onChange={this.handleSearchText}
          placeholder="请输入小区或地址"
        />

        {/* 搜索建议列表 */}
        {tipsList.length > 0 && this.renderTips(tipsList)}
      </div>
    )
  }
}

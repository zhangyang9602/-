import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { Toast } from 'antd-mobile'

// 导入子组件
import NavHeader from '../../components/NavHeader'
import NoHouse from '../../components/NoHouse'
import HouseItem from '../../components/HouseItem'

// 导入样式
import styles from './index.module.scss'

export default class Rent extends Component {
  state = {
    list: [] //我的房屋出租列表
  }

  componentDidMount() {
    this.getRentHouseList()
  }

  async getRentHouseList() {
    Toast.loading('数据加载中...')

    const result = await this.$axios.get('/user/houses')

    Toast.hide()
    const { status, body } = result.data
    if (status === 200) {
      this.setState({
        list: body
      })
    } else {
      // token 失效或是已过期
      const { history, location } = this.props

      history.replace('/login', {
        from: location
      })
    }
  }

  /**
   * 渲染出租房屋列表
   */
  renderRentList = () => {
    const { list } = this.state
    const { history } = this.props

    const hasHouses = list.length > 0

    if (!hasHouses) {
      return (
        <NoHouse>
          <>
            您还没有发布房源,
            <Link to="/rent/add" className={styles.link}>
              去发布房源
            </Link>
          </>
        </NoHouse>
      )
    } else {
      return (
        <div className={styles.houses}>
          {list.map(item => {
            return (
              <HouseItem
                key={item.houseCode}
                {...item}
                onClick={() => {
                  history.push(`/detail/${item.houseCode}`)
                }}
              />
            )
          })}
        </div>
      )
    }
  }

  render() {
    const { list } = this.state
    return (
      <div className={styles.root}>
        <NavHeader className={styles.rentHeader}>我的出租列表</NavHeader>

        {list.length > 0 && this.renderRentList()}
      </div>
    )
  }
}

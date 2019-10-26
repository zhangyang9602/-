import React, { Component } from 'react'

import { Flex, Toast } from 'antd-mobile'

import styled from './index.module.scss'

// 导入子组件
import SearchHeader from '../../components/SearchHeader'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import Sticky from '../../components/Sticky'
import NoHouse from '../../components/NoHouse'

import { getCurrentCity } from '../../utils'

// 导入循环使用的列表组件
import {
  InfiniteLoader,
  WindowScroller,
  AutoSizer,
  List
} from 'react-virtualized'

export default class index extends Component {
  state = {
    list: null,
    count: 0
  }

  // 筛选条件
  filters = {}
  // 城市label名称
  label = ''
  // 城市value的值
  value = ''
  // 是否加载完毕
  isLoaded = false

  onFilter = filters => {
    this.filters = filters

    // 发送请求，获取数据
    this.searchHouseList()

    // 滚动到顶部
    window.scrollTo(0,0)
  }

  async componentWillMount() {
    // 获取当前定位城市
    const { label, value } = await getCurrentCity()
    this.label = label
    this.value = value

    this.searchHouseList()
  }

  searchHouseList = async () => {
    Toast.loading('数据加载中...')

    const result = await this.$axios.get('houses', {
      params: {
        ...this.filters,
        cityId: this.value,
        start: 1,
        count: 20
      }
    })

    const { list, count } = result.data.body

    Toast.hide()
    if (count > 0) {
      Toast.info(`共查询到 ${count} 套房源`, 1.5, null, false)
    }

    this.isLoaded = true //数据加载完毕

    this.setState({
      list,
      count
    })
  }

  // 渲染每一行
  rowRenderer = ({ key, index, style }) => {
    const { list } = this.state
    const item = list[index]

    if (!item) {
      return (
        <div key={key} style={style}>
          <p className={styled.loading} />
        </div>
      )
    }

    return (
      <HouseItem
        key={key}
        {...item}
        style={style}
        onClick={() => {
          this.props.history.push(`/detail/${item.houseCode}`)
        }}
      />
    )
  }

  // 判断某一行是否加载完毕
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 加载更多行数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return new Promise(async resolve => {
      Toast.loading('数据加载中...')

      const result = await this.$axios.get('houses', {
        params: {
          ...this.filters,
          cityId: this.value,
          start: startIndex,
          end: stopIndex
        }
      })

      const { list, count } = result.data.body

      Toast.hide()
      if (count > 0) {
        Toast.info(`共查询到 ${count} 套房源`, 1.5, null, false)
      }

      this.isLoaded = true //数据加载完毕

      this.setState({
        list: [...this.state.list, ...list],
        count
      })

      resolve()
    })
  }

  /* 房屋列表渲染 */
  renderHouseList = () => {
    const { count } = this.state

    if (this.isLoaded && count <= 0) {
      return <NoHouse>没有找到房源，请您换个搜索条件吧~</NoHouse>
    }

    return (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={count}
        minimumBatchSize={21}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling, scrollTop }) => {
              return (
                <AutoSizer>
                  {({ width }) => (
                    <List
                      autoHeight
                      isScrolling={isScrolling}
                      scrollTop={scrollTop}
                      height={height}
                      width={width}
                      rowCount={count}
                      rowHeight={120}
                      rowRenderer={this.rowRenderer}
                      onRowsRendered={onRowsRendered}
                      ref={registerChild}
                    />
                  )}
                </AutoSizer>
              )
            }}
          </WindowScroller>
        )}
      </InfiniteLoader>
    )
  }

  render() {
    return (
      <div className={styled.root}>
        {/* 搜索框 */}
        <Flex className={styled.listHeader}>
          <i
            className="iconfont icon-back"
            onClick={() => {
              this.props.history.go(-1)
            }}
          />
          <SearchHeader className={styled.listSearch} cityName={this.label} />
        </Flex>

        {/* 条件筛选栏组件 */}
        <Sticky height={40}>
          <Filter onFilter={this.onFilter} />
        </Sticky>

        {/* 渲染房屋列表 */}
        <div className={styled.houseList}>
          {this.renderHouseList()}
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react'

import { Toast } from 'antd-mobile'

import { getCurrentCity, setCity } from '../../utils'

import { AutoSizer, List } from 'react-virtualized'

// 导入自定义NavHeader
import NavHeader from '../../components/NavHeader'

// 导入样式
import './index.scss'

// 索引的高度
const INDEX_HEIGHT = 36
// 城市名的高度
const CITY_NAME_HEIGHT = 50
// 有房源城市的数据
const CITYS = ['北京', '上海', '广州', '深圳']

const formatCityList = list => {
  // 城市列表对象
  const cityList = {}
  // 遍历旧数组，进行处理
  list.forEach(item => {
    // 获取首字母
    const firstLetter = item.short.substr(0, 1)

    // 判断首字母对应的数据是否存在
    if (firstLetter in cityList) {
      cityList[firstLetter].push(item)
    } else {
      cityList[firstLetter] = [item]
    }
  })

  // 索引列表
  const cityIndex = Object.keys(cityList).sort()

  return {
    cityList,
    cityIndex
  }
}

// 格式化城市标题
const formatCityIndexTitle = letter => {
  switch (letter) {
    case '#':
      return '定位城市'

    case 'hot':
      return '热门城市'

    default:
      return letter.toUpperCase()
  }
}

export default class Index extends Component {
  state = {
    cityList: null, // 城市列表
    cityIndex: null, // 城市索引
    activeIndex: 0 // 激活的索引
  }

  listRef = React.createRef()

  componentDidMount() {
    // 获取城市列表数据并且处理
    this.fetchCityList()
  }

  async fetchCityList() {
    const res = await this.$axios.get('area/city?level=1')

    // 获取处理之后的城市列表数据
    const { cityList, cityIndex } = formatCityList(res.data.body)

    // 获取热门数据
    const hotRes = await this.$axios.get('area/hot')
    cityList['hot'] = hotRes.data.body
    cityIndex.unshift('hot')

    // 获取定位城市信息
    const city = await getCurrentCity()
    cityIndex.unshift('#')
    cityList['#'] = [city]

    this.setState(
      {
        cityList,
        cityIndex
      },
      () => {
        // 预先测量列表中的所有行，确保能正确滚动到索引的位置
        this.listRef.current.measureAllRows()
      }
    )
  }

  /**
   * 改变城市
   */
  changeCity = ({ label, value }) => {
    // 判断下，是否是 北、上、广、深，如果不是则给出提示，如果是则更新本地存储并且返回
    if (CITYS.includes(label)) {
      setCity({ label, value })

      this.props.history.goBack()
    } else {
      Toast.info('该城市暂无房源哦~', 1)
    }
  }

  /**
   * 渲染每一行
   */
  renderCityList = ({ key, index, style }) => {
    const { cityIndex, cityList } = this.state
    // 索引字母
    const letter = cityIndex[index]
    // 索引字母对应的数组
    const list = cityList[letter]
    return (
      <div key={key} style={style} className="city">
        <div className="title">{formatCityIndexTitle(letter)}</div>
        <div>
          {list.map(item => (
            <div
              onClick={() => {
                this.changeCity(item)
              }}
              key={item.value}
              className="name"
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    )
  }

  /**
   * 计算每一行的高度
   */
  calcRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state

    const letter = cityIndex[index]
    const list = cityList[letter]

    return INDEX_HEIGHT + CITY_NAME_HEIGHT * list.length
  }

  /**
   * 城市索引被点击了
   */
  cityIndexClick = index => {
    this.listRef.current.scrollToRow(index)
  }

  /**
   * 渲染城市索引
   */
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state

    return (
      <div className="city-index">
        {cityIndex.map((item, index) => (
          <div
            onClick={() => {
              this.cityIndexClick(index)
            }}
            key={item}
            className="city-index-item"
          >
            <span className={`${index === activeIndex ? 'index-active' : ''}`}>
              {item === 'hot' ? '热' : item.toUpperCase()}
            </span>
          </div>
        ))}
      </div>
    )
  }

  /**
   * 列表滚动
   */
  onRowsRendered = ({ startIndex }) => {
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  render() {
    const { cityIndex } = this.state
    return (
      <div className="citylist">
        {/* <NavBar
          className="navbar"
          mode="light"
          icon={<i className="iconfont icon-back" />}
          onLeftClick={() => {
            this.props.history.goBack()
          }}
        >
          城市选择
        </NavBar> */}
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        {cityIndex && (
          <AutoSizer>
            {/* 注意：父元素的高度一定要是100%，否则不会调用rowRenderer中的方法 */}
            {({ height, width }) => (
              <List
                ref={this.listRef}
                width={width}
                height={height}
                rowCount={this.state.cityIndex.length}
                rowHeight={this.calcRowHeight}
                rowRenderer={this.renderCityList}
                onRowsRendered={this.onRowsRendered}
                scrollToAlignment="start"
              />
            )}
          </AutoSizer>
        )}
        {/* 城市列表索引 */}
        {cityIndex && this.renderCityIndex()}
      </div>
    )
  }
}

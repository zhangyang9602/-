import React, { Component } from 'react'

// 导入样式
import './index.scss'

// 导入自定义组件
import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'

import { getCurrentCity } from '../../utils'

import { Toast } from 'antd-mobile'

// 导入样式
import styles from './index.module.scss'

// 导入classNames
import classNames from 'classnames'

const BMap = window.BMap

// label 样式：
const labelStyle = {
  cursor: 'pointer',
  border: '0px solid rgb(255, 0, 0)',
  padding: '0px',
  whiteSpace: 'nowrap',
  fontSize: '12px',
  color: 'rgb(255, 255, 255)',
  textAlign: 'center'
}

class Index extends Component {
  state = {
    isShowHouseList: false, // 是否显示房屋列表
    houseList: []
  }

  componentDidMount() {
    this.initMap()
  }

  componentWillUnmount() {
    Toast.hide()
  }

  initMap = async () => {
    // 获取定位城市
    const { label, value } = await getCurrentCity()

    // 创建地图
    const map = new BMap.Map('container')

    // 保存地图实例
    this.map = map
    // 添加touchmove事件
    this.map.addEventListener('touchmove', () => {
      this.setState({
        isShowHouseList: false
      })
    })

    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder()
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          map.centerAndZoom(point, 11)
        }
      },
      label
    )

    // 添加其它控件
    map.addControl(new BMap.ScaleControl())
    map.addControl(new BMap.NavigationControl())

    // 渲染覆盖物
    this.renderOverlays(value)

    // 根据城市名称获取经纬度，反地理编码
    // http://lbsyun.baidu.com/index.php?title=jspopular3.0/guide/geocoding

    /**
    // 创建地址解析器实例
    const myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上，并调整地图视野
    myGeo.getPoint(
      label,
      point => {
        if (point) {
          map.centerAndZoom(point, 11)

          // 绘制覆盖物
          var opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-35, -35) //设置文本偏移量
          }

          // 添加文字标签
          var label = new BMap.Label('', opts) // 创建文本标注对象

          // 设置显示内容
          label.setContent(`
            <div class="${styles.bubble}">
              <p class="${styles.name}">浦东新区</p>
              <p>388套</p>
            </div>
          `)

          // 设置样式
          label.setStyle(labelStyle)

          // 添加点击事件
          label.addEventListener('click', () => {
            console.log('click...')
          })

          // 把覆盖物添加到地图上
          map.addOverlay(label)
        }
      },
      label
    )
     */
  }

  getTypeAndZoom() {
    // 获取地图的缩放级别
    const zoom = this.map.getZoom()
    let nextZoom, type
    if (zoom >= 10 && zoom < 12) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom >= 12 && zoom < 14) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
    }

    return { nextZoom, type }
  }

  // 渲染地图覆盖物
  async renderOverlays(id) {
    // 提示
    Toast.loading('加载中...', 0, null, false)
    // 根据id获取区、镇及小区的数据
    const houses = await this.$axios.get(`area/map`, {
      params: {
        id
      }
    })

    Toast.hide()

    // 渲染创建地图覆盖物
    const { nextZoom, type } = this.getTypeAndZoom()

    // 循环渲染地图覆盖物
    houses.data.body.map(item => {
      if (type === 'circle') {
        // 创建区、镇覆盖物
        this.createCircle(nextZoom, item)
      } else {
        // 创建小区覆盖物
        this.createRect(item)
      }

      return ''
    })
  }

  /**
   * 创建区、镇地图覆盖物
   * @param {*} nextZoom 下一个缩放级别
   * @param {*} item 每一项
   */
  createCircle(nextZoom, item) {
    // 解构赋值所需要的数据
    const {
      label: name,
      count,
      value: id,
      coord: { longitude, latitude }
    } = item

    var point = new BMap.Point(longitude, latitude)
    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(35, -35) //设置文本偏移量
    }
    var label = new BMap.Label('', opts)
    // 设置文字内容
    label.setContent(`
      <div class=${styles.bubble}>
        <p class=${styles.name}>${name}</p>
        <p class=${styles.name}>${count}套</p>
      </div>
    `)

    // 设置文字样式
    label.setStyle(labelStyle)

    // 添加点击事件
    label.addEventListener('click', () => {
      // 获取下一级的数据
      this.renderOverlays(id)

      // 清除已有的覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      }, 0)

      // 重置中心点与缩放级别
      this.map.centerAndZoom(point, nextZoom)
    })

    this.map.addOverlay(label)
  }

  /**
   * 创建小区覆盖物
   * @param {*} item 每一项
   */
  createRect(item) {
    // 结构出需要的值
    const {
      label: name,
      value: id,
      count,
      coord: { longitude, latitude }
    } = item
    const point = new BMap.Point(longitude, latitude)

    var opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -20) //设置文本偏移量
    }

    var label = new BMap.Label('', opts) // 创建文本标注对象
    // 设置内容
    label.setContent(`<div class=${styles.rect}>
        <span class=${styles.housename}>${name}</span>
        <span class=${styles.housenum}>${count}套</span>
        <i class=${styles.arrow}/>
    <div>`)

    // 设置样式
    label.setStyle(labelStyle)

    // 设置点击事件
    label.addEventListener('click', e => {
      // 将当前小区设置在地图中间
      const { clientX, clientY } = e.changedTouches[0]
      const moveX = window.innerWidth / 2 - clientX
      const moveY = (window.innerHeight - 330 + 45) / 2 - clientY
      // 移动到地图可视区域的中心点位置
      this.map.panBy(moveX, moveY)

      this.setState({
        isShowHouseList: true
      })
      // 获取小区房源信息
      this.getCommunityHouses(id)
    })
    this.map.addOverlay(label)
  }

  /**
   * 获取小区房屋数据
   */
  async getCommunityHouses(id) {
    // 提示
    Toast.loading('加载中...', 0, null, false)

    const result = await this.$axios.get(`houses`, {
      params: {
        cityId: id
      }
    })

    Toast.hide()

    this.setState({
      isShowHouseList: true,
      houseList: result.data.body.list
    })
  }

  /**
   * 渲染房屋列表
   */
  renderHouseList = () => {
    return (
      <div
        className={classNames(styles.houseList, {
          [styles.show]: this.state.isShowHouseList
        })}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/house/list">
            更多房源
          </a>
        </div>
        <div className={styles.houseItems}>
          {this.state.houseList.map(item => (
            <HouseItem
              key={item.houseCode}
              {...item}
              onClick={() => {
                this.props.history.push(`/detail/${item.houseCode}`)
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="map">
        <NavHeader>地图找房</NavHeader>
        <div id="container" />
        {/* 渲染房屋列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Index

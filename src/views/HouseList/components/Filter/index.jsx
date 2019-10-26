import React, { Component } from 'react'

import FilterTitle from '../FilterTitle/index.jsx'
import FilterPicker from '../FilterPicker/index.jsx'
import FilterMore from '../FilterMore/index.jsx'

import styles from './index.module.css'

// 导入动画库
import { Spring } from 'react-spring/renderprops'

// 获取当前定位城市
import { getCity } from '../../../../utils'

// false 表示不亮；true 表示高亮
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false
}

const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {
  state = {
    titleSelectedStatus, // 选中的标题状态
    openType: '',
    filtersData: {}, // 过滤出来的数据
    selectedValues // 选中的值
  }

  componentWillMount() {
    this.getFiltersData()
  }

  async getFiltersData() {
    const { value } = getCity()

    const result = await this.$axios.get(`houses/condition?id=${value}`)

    this.setState({
      filtersData: result.data.body
    })
  }

  componentDidMount() {
    // 拿到 body 这个 dom 节点
    this.bodyHTML = document.body
  }

  // 更改标题的选中状态
  changeTitleSelected = type => {
    /**
    this.setState({
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        [type]: true
      },
      openType: type
    })
    */
    // 给body设置样式
    this.bodyHTML.className = 'hidden'

    // 选中的值
    const { selectedValues } = this.state

    const newTitleSelectedStatus = this.getTitleSelectedStatus(
      type,
      selectedValues
    )

    this.setState({
      openType: type,
      titleSelectedStatus: {
        ...this.state.titleSelectedStatus,
        ...newTitleSelectedStatus
      }
    })
  }

  // 渲染选中或是选择的类型
  getTitleSelectedStatus(type, selectedValues) {
    // 获取4种不同类型的筛选方式
    const { titleSelectedStatus } = this.state

    const newTitleSelectedStatus = {}

    Object.keys(titleSelectedStatus).forEach(key => {
      const selected = selectedValues[key]

      if (key === type) {
        newTitleSelectedStatus[key] = true
      } else if (
        key === 'area' &&
        (selected.length === 3 || selected[0] === 'subway')
      ) {
        newTitleSelectedStatus[key] = true
      } else if (key === 'mode' && selected[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'price' && selected[0] !== 'null') {
        newTitleSelectedStatus[key] = true
      } else if (key === 'more' && selected.length > 0) {
        newTitleSelectedStatus[key] = true
      } else {
        newTitleSelectedStatus[key] = false
      }
    })

    return newTitleSelectedStatus
  }

  onCancel = () => {
    this.bodyHTML.className = ''

    this.setState(
      {
        openType: ''
      },
      () => {
        const { openType, selectedValues } = this.state
        const newTitleSelectedStatus = this.getTitleSelectedStatus(
          openType,
          selectedValues
        )

        this.setState({
          titleSelectedStatus: {
            ...this.state.titleSelectedStatus,
            ...newTitleSelectedStatus
          }
        })
      }
    )
  }

  onSave = (type, value) => {
    this.bodyHTML.className = ''

    this.setState(
      {
        openType: '',
        selectedValues: {
          ...this.state.selectedValues,
          [type]: value
        }
      },
      () => {
        const { openType, selectedValues } = this.state
        const newTitleSelectedStatus = this.getTitleSelectedStatus(
          openType,
          selectedValues
        )

        this.setState({
          titleSelectedStatus: {
            ...this.state.titleSelectedStatus,
            ...newTitleSelectedStatus
          }
        })

        // 拿到选中的值，作为刷选条件传递给父组件
        const filters = {}
        const areaKey = selectedValues.area[0]
        let areaValue = null
        if (selectedValues.area.length === 2) {
          areaValue = null
        } else if (selectedValues.area.length === 3) {
          areaValue =
            selectedValues.area[2] === 'null'
              ? selectedValues.area[1]
              : selectedValues.area[2]
        }
        filters[areaKey] = areaValue

        filters['rentType'] = selectedValues.mode[0]

        filters['price'] = selectedValues.price[0]

        filters['more'] = selectedValues.more.join(',')

        this.props.onFilter && this.props.onFilter(filters)
      }
    )
  }

  // 渲染FilterPicker
  renderFilterPicker() {
    const {
      openType,
      filtersData: { area, price, rentType, subway },
      selectedValues
    } = this.state

    // 传递给子组件的数据
    let data = null

    // 显示多少列
    let cols = 1
    // 选中的值
    const defaultValue = selectedValues[openType]
    switch (openType) {
      case 'area':
        data = [area, subway]
        cols = 3
        break

      case 'mode':
        data = rentType
        break

      case 'price':
        data = price
        break

      default:
        break
    }

    if (openType === 'area' || openType === 'mode' || openType === 'price') {
      return (
        <FilterPicker
          key={openType}
          data={data}
          cols={cols}
          type={openType}
          defaultValue={defaultValue}
          onCancel={this.onCancel}
          onSave={this.onSave}
        />
      )
    } else {
      return null
    }
  }

  // 渲染更多
  renderFilterMore = () => {
    if (this.state.openType !== 'more') return null

    // 取出值
    const {
      filtersData: { characteristic, floor, oriented, roomType },
      openType,
      selectedValues
    } = this.state

    // 取出传递给子组件的数据
    const data = { characteristic, floor, oriented, roomType }
    const defaultValue = selectedValues.more

    return (
      <FilterMore
        data={data}
        defaultValue={defaultValue}
        type={openType}
        onSave={this.onSave}
        onCancel={this.onCancel}
      />
    )
  }

  /**
   * 渲染Mask
   */
  renderMask = () => {
    const { openType } = this.state

    // 是否隐藏
    const isHide = openType === 'more' || openType === ''

    /* 前三个菜单的遮罩层 */
    return (
      // 如果想要动画效果，Spring必须存在
      <Spring to={{ opacity: isHide ? 0 : 1 }}>
        {props => {
          if (props.opacity === 0) {
            return null
          }

          return (
            <div style={props}>
              <div
                style={props}
                className={styles.mask}
                onClick={this.onCancel}
              />
            </div>
          )
        }}
      </Spring>
    )
  }

  render() {
    const { titleSelectedStatus } = this.state
    return (
      <div className={styles.root}>
        {/* 渲染遮罩层 */}
        {this.renderMask()}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onClick={this.changeTitleSelected}
          />

          {/* 渲染前三个菜单 */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}

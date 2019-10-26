import React, { Component } from 'react'
import { Carousel, Grid, Flex, WingBlank } from 'antd-mobile'

import { getCurrentCity } from '../../utils'

// 导入样式
import './index.scss'

// 加载图片资源
import image1 from '../../assets/images/nav-1.png'
import image2 from '../../assets/images/nav-2.png'
import image3 from '../../assets/images/nav-3.png'
import image4 from '../../assets/images/nav-4.png'

import { Link } from 'react-router-dom'

// 导入子组件
import SearchHeader from '../../components/SearchHeader'

export default class index extends Component {
  state = {
    swipers: [], // 轮播图数据
    isLoadingSwiper: true, // 正在加载轮播图数据
    imgHeight: 212,
    navs: [
      { icon: image1, text: '整租', path: '/home/list' },
      { icon: image2, text: '合租', path: '/home/list' },
      { icon: image3, text: '地图找房', path: '/map' },
      { icon: image4, text: '去出租', path: '/rent/add' }
    ],
    groups: [],
    news: [], // 咨询列表
    cityName: '深圳'
  }

  async componentWillMount() {
    // 获取轮播图数据
    this.getSwipersData()

    // 获取租房小组数据
    this.getGroupsData()

    // 获取新闻列表数据
    this.getNewsData()

    // 获取当前定位城市
    const { label } = await getCurrentCity()
    this.setState({
      cityName: label
    })
  }

  async getSwipersData() {
    const res = await this.$axios.get('home/swiper')
    // 以api开头的则会被代理
    // const res = await this.$axios.get('http://localhost:3000/api/home/swiper')

    this.setState({
      isLoadingSwiper: false,
      swipers: res.data.body
    })
  }

  async getGroupsData() {
    const res = await this.$axios.get(
      'home/groups?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      groups: res.data.body
    })
  }

  async getNewsData() {
    const res = await this.$axios.get(
      'home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )

    this.setState({
      news: res.data.body
    })
  }

  // 渲染搜索框
  renderSearchBox = () => {
    return (
      <Flex className="search-box">
        <Flex className="search-left">
          <div
            className="location"
            onClick={() => {
              this.props.history.push('/citylist')
            }}
          >
            <span>{this.state.cityName}</span>
            <i className="iconfont icon-arrow" />
          </div>
          <div className="search-form">
            <i className="iconfont icon-search" />
            <span>请输入小区或地址</span>
          </div>
        </Flex>
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }

  // 渲染轮播图
  renderSwiper() {
    return (
      <Carousel autoplay infinite>
        {this.state.swipers.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`http://localhost:8080${item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
            />
          </a>
        ))}
      </Carousel>
    )
  }

  // 渲染导航
  renderNav() {
    return (
      // <Grid
      //   hasLine={false}
      //   activeStyle={false}
      //   data={this.state.navs}
      //   renderItem={dataItem => (
      //     <Link to={dataItem.path} className="nav-item">
      //       <img src={dataItem.icon} alt="" />
      //       <span>{dataItem.text}</span>
      //     </Link>
      //   )}
      // />
      <Flex className="nav">
        {this.state.navs.map(item => {
          return (
            <Flex.Item key={item.text}>
              <Link to={item.path}>
                <img src={item.icon} alt="" />
                <p>{item.text}</p>
              </Link>
            </Flex.Item>
          )
        })}
      </Flex>
    )
  }

  // 渲染租房小组数据
  renderGroups() {
    return (
      <div className="groups">
        <Flex justify="between">
          <Flex.Item style={{ fontSize: 18, fontWeight: 'bold' }}>
            租房小组
          </Flex.Item>
          <Flex.Item align="end">更多</Flex.Item>
        </Flex>
        <Grid
          className="group-grid"
          hasLine={false}
          activeStyle={false}
          columnNum={2}
          data={this.state.groups}
          square={false}
          renderItem={dataItem => (
            <div className="nav-item">
              <div className="left">
                <p>{dataItem.title}</p>
                <p>{dataItem.desc}</p>
              </div>
              <div className="right">
                <img src={`http://localhost:8080${dataItem.imgSrc}`} alt="" />
              </div>
            </div>
          )}
        />
      </div>
    )
  }

  // 渲染资源
  renderNews = () => {
    const { news } = this.state
    return (
      <div className="news">
        <h3 className="group-title">最新咨询</h3>
        <WingBlank size="md">
          {news.map(item => {
            return (
              <div className="news-item" key={item.id}>
                <div className="imgwrap">
                  <img
                    className="img"
                    src={`http://localhost:8080${item.imgSrc}`}
                    alt=""
                  />
                </div>
                <Flex className="content" direction="column" justify="between">
                  <h3 className="title">{item.title}</h3>
                  <Flex className="info" justify="between">
                    <span>{item.from}</span>
                    <span>{item.date}</span>
                  </Flex>
                </Flex>
              </div>
            )
          })}
        </WingBlank>
      </div>
    )
  }

  render() {
    return (
      <div className="index">
        {/* 搜索框 */}
        {/* {this.renderSearchBox()} */}
        <SearchHeader cityName={this.state.cityName} />
        {/* 轮播图 */}
        <div className="swiper">
          {!this.state.isLoadingSwiper && this.renderSwiper()}
        </div>
        {/* 导航菜单 */}
        {this.renderNav()}
        {/* 租房小组 */}
        {this.renderGroups()}
        {/* 最新咨询 */}
        {this.renderNews()}
      </div>
    )
  }
}

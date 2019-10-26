import React, { Component,lazy } from 'react'

import { Route } from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import Index from '../Index'

// 导入样式
import './index.css'

// import News from '../News'
// import HouseList from '../HouseList'
// import Profile from '../Profile'

// 懒加载
const News = lazy(() => import('../News'))
const HouseList = lazy(() => import('../HouseList'))
const Profile = lazy(() => import('../Profile'))

export default class index extends Component {
  state = {
    selectedTab: this.props.location.pathname
  }

  // tabs数组
  TABS = [
    {
      title: '首页',
      icon: 'icon-index',
      path: '/home'
    },
    {
      title: '找房',
      icon: 'icon-findHouse',
      path: '/home/list'
    },
    {
      title: '资讯',
      icon: 'icon-info',
      path: '/home/news'
    },
    {
      title: '我的',
      icon: 'icon-my',
      path: '/home/profile'
    }
  ]

  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }

  renderTabBar = () => {
    return (
      <div className="tabbar">
        <TabBar tintColor="#21B97A" noRenderContent={true}>
          {this.TABS.map(item => (
            <TabBar.Item
              icon={<i className={`iconfont ${item.icon}`} />}
              selectedIcon={<i className={`iconfont ${item.icon}`} />}
              title={item.title}
              key={item.path}
              selected={this.state.selectedTab === item.path}
              onPress={() => {
                // 通过编程时导航切换路由
                this.props.history.push(item.path)

                // 重新设置选中的tabbar
                // this.setState({
                //   selectedTab: item.path
                // })
              }}
            />
          ))}
        </TabBar>
      </div>
    )
  }
  render() {
    return (
      <div className="home">
        <Route path="/home" exact component={Index} />
        <Route path="/home/news" component={News} />
        <Route path="/home/list" component={HouseList} />
        <Route path="/home/profile" component={Profile} />
        {/* 渲染底部TabBar */}
        {this.renderTabBar()}
      </div>
    )
  }
}

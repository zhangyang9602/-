import React,{lazy,Suspense} from 'react'

// import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

import { HashRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入AuthRoute
import AuthRoute from './components/AuthRoute'

// 导入子组件
import Home from './views/Home'
/**
import CityList from './views/CityList'
import Map from './views/Map'
import HouseDetail from './views/HouseDetail'
import Login from './views/Login'
import Rent from './views/Rent'
import RentAdd from './views/Rent/Add'
import RentSearch from './views/Rent/Search'
 */

// 以下为测试组件
import Provider from './test/Provider'
import RenderProps from './test/RenderProps/Index'
import HOC from './test/HOC/Index'

// 懒加载
const CityList = lazy(() => import('./views/CityList'))
const Map = lazy(() => import('./views/Map'))
const HouseDetail = lazy(() => import('./views/HouseDetail'))
const Login = lazy(() => import('./views/Login'))
const Rent = lazy(() => import('./views/Rent'))
const RentAdd = lazy(() => import('./views/Rent/Add'))
const RentSearch = lazy(() => import('./views/Rent/Search'))

export default () => {
  return (
    <Suspense fallback={<div className="loading">loading...</div>}>
      <div id="app">
        <Router>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route path="/home" component={Home} />
          <Route path="/citylist" component={CityList} />
          <Route path="/map" component={Map} />
          <Route path="/detail/:id" component={HouseDetail} />
          <Route path="/login" component={Login} />

          {/* 以下是需要登录才能访问的页面 */}
          <AuthRoute exact path="/rent" component={Rent}/>
          <AuthRoute path="/rent/add" component={RentAdd}/>
          <AuthRoute path="/rent/search" component={RentSearch}/>

          {/* 以下为测试路由 */}
          <Route path="/testProvider" component={Provider} />
          <Route path="/testRenderProps" component={RenderProps} />
          <Route path="/testHOC" component={HOC} />
        </Router>
      </div>
    </Suspense>
  )
}

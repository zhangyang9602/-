import React from 'react'

import {Route,Redirect} from 'react-router-dom'

import {isAuth} from '../../utils'

/**
 * Component 重命名，因为组件名要大写
 * rest 剩余参数
 */
const AuthRoute = ({component:Component,...rest}) => {
    return <Route {...rest} render = {props => {
        if (isAuth()){ // 登录了
            // 把 props 传递到 Component 组件中去
            return <Component {...props}/>
        } else {
            return <Redirect to={{
                pathname:'/login',
                state: {from:props.location} // 携带额外参数到登录页面中去
            }}/>
        }
    }}/>
}

export default AuthRoute
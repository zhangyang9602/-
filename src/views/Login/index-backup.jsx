import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { WhiteSpace, WingBlank, Flex, Toast } from 'antd-mobile'

import styles from './index.module.scss'

import { axios } from '../../utils/axios'

// 导入子组件
import NavHeader from '../../components/NavHeader'

// 导入 yup 去验证表单项
import * as Yup from 'yup'

import { withFormik } from 'formik'

import { setToken } from '../../utils'

class Login extends Component {
  render() {
    const { values, handleChange, handleSubmit ,handleBlur, errors, touched } = this.props
    
    return (
      <div className={styles.root}>
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>

        <WhiteSpace size="xl" />
        <WingBlank>
          <form onSubmit={handleSubmit}>
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="请输入账号"
                name="username"
              />
            </div>
            { touched.username && errors.username && (
              <div className={styles.error}>{errors.username}</div>
            )}
            <div className={styles.formItem}>
              <input
                className={styles.input}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                type="password"
                placeholder="请输入密码"
                name="password"
              />
            </div>
            { touched.password && errors.password && (
              <div className={styles.error}>{errors.password}</div>
            )}
            <div className={styles.formSubmit}>
              <input className={styles.submit} type="submit" value="登录" />
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

// 校验正则
const REG_USERNAME = /^[a-zA-Z_\d]{5,8}/
const REG_PASSWORD = /^[a-zA-Z_\d]{5,12}/

Login = withFormik({
  mapPropsToValues: () => ({ username: 'test2', password: 'test2' }),

  // 验证表单项目
  validationSchema:Yup.object().shape({
    username:Yup.string().required('账号为必填项').matches(REG_USERNAME,'长度为5到8位，只能出现数字、字母、下划线'),
    password:Yup.string().required('密码为必填项').matches(REG_PASSWORD,'长度为5到12位，只能出现数字、字母、下划线')
  }),

  handleSubmit: async (values, { props }) => {
    const { username, password } = values

    const result = await axios.post('user/login', { username, password })

    const { status, description, body } = result.data

    if (status === 200) {
      // 登录成功
      // 保存token
      setToken(body.token)

      // 跳转到上一个路由
      props.history.go(-1)
    } else {
      // 登录失败
      Toast.info(description, 1.5, null, false)
    }
  }
})(Login)

export default Login

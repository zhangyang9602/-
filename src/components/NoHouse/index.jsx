import React from 'react'

import styles from './index.module.scss'

import { BASE_URL } from '../../utils/url'

import PropTypes from 'prop-types'

const NoHouse = ({ children }) => {
  return (
    <div className={styles.root}>
      <img className={styles.img} src={`${BASE_URL}img/not-found.png`} alt="" />
      <p className={styles.msg}>{children}</p>
    </div>
  )
}

NoHouse.propTypes = {
  // children: PropTypes.string.isRequired
  children: PropTypes.node.isRequired
}

export default NoHouse

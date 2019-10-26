import React from 'react'

import styles from './index.module.scss'

// 导入校验框架
import PropTypes from 'prop-types'

function HouseItem({ houseImg, title, desc, tags, price, onClick,style }) {
  return (
    <div className={styles.house} style={style} onClick={onClick}>
      <div className={styles.imgWrap}>
        <img
          className={styles.img}
          src={`http://localhost:8080${houseImg}`}
          alt=""
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.desc}>{desc}</div>
        <div>
          {tags.map((tag, index) => {
            const tagClass = `tag${index > 2 ? '3' : index + 1}` // tag1 or tag2 or tag3
            return (
              <span
                key={index}
                className={[styles.tag, styles[tagClass]].join(' ')}
              >
                {tag}
              </span>
            )
          })}
        </div>
        <div className={styles.price}>
          <span className={styles.priceNum}>{price}</span> 元/月
        </div>
      </div>
    </div>
  )
}

HouseItem.propTypes = {
  houseImg: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
  tags: PropTypes.array.isRequired,
  price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onClick: PropTypes.func.isRequired,
  style:PropTypes.object
}

export default HouseItem

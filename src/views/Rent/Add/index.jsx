import React, { Component } from 'react'

import styles from './index.module.scss'

import {
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Flex,
  Toast,
  Modal
} from 'antd-mobile'

// 导入子组件
import NavHeader from '../../../components/NavHeader'
import HousePackage from '../../../components/HousePackage'

const Item = List.Item

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

class RentAdd extends Component {
  constructor(props) {
    super(props)

    const community = {}
    const { state } = props.location

    if (state) {
      community.id = state.id
      community.name = state.name
    }

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community,
      // 价格
      price: '',
      // 面积
      size: 0,
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  // 获取 InputItem、Picker、TextareaItem的值
  getValue = (name, value) => {
    this.setState({
      [name]: value
    })
  }

  // 处理头像
  handleImage = files => {
    this.setState({
      tempSlides: files
    })
  }

  // 取消编辑
  onCancel = () => {
    Modal.alert('提示', '放弃发布房源?', [
      { text: '放弃', onPress: () => this.props.history.go(-1) },
      { text: '继续编辑' }
    ])
  }

  // 发布房源
  addHouse = async () => {
    let {
      tempSlides,
      houseImg,
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community
    } = this.state
    if (tempSlides.length <= 0) return Toast.info('请上传图片后，再发布~')

    const form = new FormData()
    tempSlides.forEach(item => {
      form.append('file', item.file)
    })

    // 首先上传图片
    const res1 = await this.$axios.post('/houses/image', form, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    if (res1.data.status === 200) {
      houseImg = res1.data.body.join('|')
    }

    // 发布房源
    const res2 = await this.$axios.post('/user/houses', {
      title,
      description,
      oriented,
      supporting,
      price,
      roomType,
      size,
      floor,
      community: community.id,
      houseImg
    })

    if (res2.data.status === 200) {
      Toast.info(
        '发布成功~',
        1,
        () => {
          this.props.history.push('/rent')
        },
        false
      )
    } else if (res2.data.status === 400) {
      Modal.alert('提示', '登录信息已过期，请重新登录~', [
        { text: '去登录', onPress: () => this.props.history.push('/login') }
      ])
    } else {
      Toast.info('服务器偷懒了，请稍后再试~')
    }
  }

  render() {
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      tempSlides,
      description
    } = this.state
    return (
      <div className={styles.root}>
        <NavHeader className={styles.addHeader}>发布房源</NavHeader>
        <List renderHeader={() => '房源信息'} className={styles.header}>
          {/* 选择所在小区 */}
          <Item
            onClick={() => {
              this.props.history.push('/rent/search')
            }}
            arrow="horizontal"
            extra={community.name || '请输入小区名称'}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            onChange={val => this.getValue('price', val)}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={val => this.getValue('size', val)}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            cols={1}
            onChange={val => this.getValue('roomType', val[0])}
            className="forss"
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>
          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
            onChange={val => this.getValue('floor', val[0])}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
            onChange={val => this.getValue('oriented', val[0])}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          className="my-list"
        >
          <InputItem
            value={title}
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            onChange={val => this.getValue('title', val)}
          ></InputItem>
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋头像'}
          className="my-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            onChange={this.handleImage}
            className={styles.imgpicker}
          ></ImagePicker>
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackage
            select
            onSelect={selectedValues => {
              this.setState({
                supporting: selectedValues.join('|')
              })
            }}
          />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            autoHeight
            labelNumber={5}
            value={description}
            onChange={val => this.getValue('description', val)}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}

export default RentAdd

import axios from 'axios'
import { setCity, getCity } from './city'
import { BASE_URL } from './url'
import { setToken, getToken, removeToken, isAuth } from './token'

const BMap = window.BMap
/**
 * 获取当前定位城市
 */
const getCurrentCity = () => {
  const city = getCity()

  // 本地没有city，则使用百度地图定位，然后调用后台接口获取定位城市信息及保存
  if (!city) {
    return new Promise((resolve, reject) => {
      const myCity = new BMap.LocalCity()
      myCity.get(async result => {
        console.log(result)
        try {
          const res = await axios.get('area/info', {
            params: {
              name: result.name
            }
          })

          const { label, value } = res.data.body

          resolve({ label, value })

          // 保存到本地
          setCity({ label, value })
        } catch (error) {
          reject(error)
        }
      })
    })
  } else {
    return Promise.resolve(city)
  }
}

export { getCurrentCity, setCity, getCity, setToken, getToken, removeToken, isAuth ,BASE_URL }

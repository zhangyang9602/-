const CITY_KEY = 'hkzf_city'

export const getCity = () => {
  return JSON.parse(localStorage.getItem(CITY_KEY))
}

export const setCity = city => {
  localStorage.setItem(CITY_KEY, JSON.stringify(city))
}

const TOKEN_KEY = 'hkzf_token'

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY)
}

export const setToken = token => {
  localStorage.setItem(TOKEN_KEY, token)
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * 是否登录
 */
export const isAuth = () => {
  return getToken()
}

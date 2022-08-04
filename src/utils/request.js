import { handleError } from './index'

function interceptor (fly) {
  fly.config.baseURL = 'https://t-app-gw.52zanyou.com'
  fly.interceptors.request.use(request => {
    return request
  })
  fly.interceptors.response.use(response => {
  }, (err) => {
    handleError(err.response)
  })
}

function createFly () {
  let fly = null
  if (mpvuePlatform === 'wx') {
    const Fly = require('flyio/dist/npm/wx')
    fly = new Fly()
  } else if (mpvuePlatform === 'my') {
    const Fly = require('flyio/dist/npm/ap')
    fly = new Fly()
  }
  interceptor(fly)
  return fly
}

/**
 * get 请求
 * @Author pengqiang
 * @Date 2021/10/19 13:58
 */
export function get (url, params = {}) {
  const fly = createFly()
  if (fly) {
    return new Promise((resolve, reject) => {
      fly.get(url, params).then(response => {
        resolve(response)
      }).catch((err) => {
        handleError(err)
        reject(err)
      })
    })
  }
}

/**
 * post 请求
 * @Author pengqiang
 * @Date 2021/10/19 13:58
 */
export function post (url, data = {}) {
  const fly = createFly()
  if (fly) {
    return new Promise((resolve, reject) => {
      fly.post(url, data).then(response => {
        resolve(response)
      }).catch((err) => {
        handleError(err)
        reject(err)
      })
    })
  }
}

/**
 * request 方式请求
 * @Author pengqiang
 * @Date 2021/10/20 14:48
*/
export function request (config) {
  const fly = createFly()
  if (fly) {
    return new Promise((resolve, reject) => {
      fly.request(config).then(response => {
        resolve(response)
      }).catch(err => {
        handleError(err)
        reject(err)
      })
    })
  }
}

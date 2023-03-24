// import { getOpenId, getAlipayOpenId } from './index'
// import { handleError } from '../utils'
import { setError } from '../utils/error'
import baseApi from '@/utils/baseApi'
// export function getUserOpenId(cb) {
//   const wx = () => {
//     mpvue.login({
//       success: function(res) {
//         console.log(res)
//         if (res.code) {
//           const appid = 'wx0fad7b50f723dc46'
//           getOpenId(appid, res.code).then(response => {
//             if (handleError(response)) {
//               const openId = response.data.data.openid
//               const sessionKey = response.data.data.session_key
//               setStorageSync('openId', openId)
//               setStorageSync('session_key', sessionKey)
//               cb && cb(openId)
//             }
//           })
//         } else {
//           console.log('获取用户登录态失败！' + res.errMsg)
//           setError('获取用户登录态失败！')
//         }
//       },
//       fail() {
//         setError('获取openId失败！')
//       }
//     })
//   }
//   const my = () => {
//     mpvue.getAuthCode({
//       scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
//       success: async (res) => {
//         console.log('getOpenId', res)
//         if (res.authCode) {
//           const code = res.authCode
//           const appId = '2019060665444521'
//           const response = await getAlipayOpenId(appId, code)
//           if (handleError(response)) {
//             const openId = response.data.data.openid
//             const sessionKey = response.data.data.session_key
//             setStorageSync('openId', openId)
//             setStorageSync('session_key', sessionKey)
//             cb && cb(openId)
//           }
//         } else {
//           setError('获取openId失败！')
//         }
//       },
//       fail: () => {
//         setError('获取openId失败！')
//       }
//     })
//   }
//   adapter({ wx, my })
// }

/**
 * 显示 loading
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function showLoading (params) {
  const wx = () => {
    const { title } = params
    mpvue.showLoading({ title })
  }
  const my = () => {
    const { title: content } = params
    mpvue.showLoading({ content })
  }
  adapter({ wx, my })
}

/**
 * 隐藏 loading
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function hideLoading() {
  mpvue.hideLoading()
}

/**
 * 查看用户是否授权操作
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function getSetting(authorize, onSuccess, onFail) {
  const wx = (res) => {
    if (res.authSetting[`scope.${authorize}`]) {
      onSuccess(res)
    } else {
      onFail(res)
    }
  }
  const my = (res) => {
    if (res.authSetting[authorize]) {
      onSuccess(res)
    } else {
      onFail(res)
    }
  }
  mpvue.getSetting({
    success: (res) => {
      adapter({ wx, my }, res)
    },
    fail: () => {
      setError('获取权限失败')
    }
  })
}

/**
 * 获取用户信息数据
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function getUserInfo (onSuccess, onFail) {
  const wx = () => {
    mpvue.getUserInfo({
      success (res) {
        const { userInfo } = res
        console.log('getUserInfo', userInfo)
        onSuccess(userInfo)
      },
      fail () {
        onFail ? onFail() : setError('获取用户信息失败')
      }
    })
  }
  const my = () => {
    mpvue.getAuthUserInfo({
      success (res) {
        console.log(res)
        res.avatarUrl = res.avatar || res.avatarUrl
        delete res.avatar
        console.log('getOpenUserInfo', res)
        onSuccess(res)
      },
      fail () {
        onFail ? onFail() : setError('获取用户信息失败')
      }
    })
  }
  adapter({ wx, my })
}

/**
 * 同步设置 storage 存储数据
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */

export function setStorageSync (key, data) {
  const wx = () => {
    console.log(key, data)
    mpvue.setStorageSync(key, data)
  }
  const my = () => {
    mpvue.setStorageSync({ key, data })
  }
  adapter({ wx, my })
}

/**
 * 同步获取 storage 存储数据
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */

export function getStorageSync (key) {
  const wx = () => {
    return mpvue.getStorageSync(key)
  }
  const my = () => {
    const result = mpvue.getStorageSync({ key })
    return (result && result.data) || null
  }
  const result = adapter({ wx, my })
  return result
}

/**
 * 同步移除 storage 存储数据
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function removeStorageSync (key) {
  const wx = () => {
    return mpvue.removeStorageSync(key)
  }
  const my = () => {
    return mpvue.removeStorageSync({ key })
  }
  adapter({ wx, my })
}

/**
 * 导航 bar
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function setNavigationBar({ title }) {
  const wx = () => {
    mpvue.setNavigationBarTitle({ title })
  }
  const my = () => {
    mpvue.setNavigationBar({ title })
  }
  adapter({ wx, my })
}

/**
 * toast 提示框
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function showToast(title, success = false) {
  adapter({
    wx() {
      success ? mpvue.showToast({ title })
        : mpvue.showToast({ title, icon: 'none' })
    },
    my() {
      mpvue.showToast({
        type: success ? 'success' : 'none',
        content: title
      })
    }
  })
}

/**
 * 模态框
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function showModal({ title, content, callback }) {
  adapter({
    wx() {
      mpvue.showModal({
        title,
        content,
        success(res) {
          if (res.confirm) {
            callback && callback()
          }
        }
      })
    },
    my() {
      mpvue.confirm({
        title,
        content,
        success: (result) => {
          if (result.confirm) {
            callback && callback()
          }
        }
      })
    }
  })
}

/**
 * alert 确认提示框
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
 export function showAlert({ title='', content='', callback }) {
  adapter({
    wx() {
      mpvue.showModal({
        title,
        content,
        showCancel: false,
        success() {
          callback && callback()
        }
      })
    },
    my() {
      mpvue.alert({
        title,
        content,
        success: () => {
          callback && callback()
        }
      })
    }
  })
}

/**
 * 获取压缩图片
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function getCompressImage({ url, cb}) {
  const wx = (res) => {
    mpvue.compressImage({
      src: res.path,
      success: data => {
        cb && cb(data.tempFilePath)
      }
    })
  }
  const my = (res) => {
    mpvue.compressImage({
      apFilePaths: [res.path],
      compressLevel: 0,
      success: data => {
        const filePath = data.apFilePaths[0]
        if (filePath) {
          cb && cb(data.apFilePaths[0])
        }
      }
    })
  }
  mpvue.getImageInfo({
    src:`${baseApi.imgUrl}${url}`,
    success:(res)=>{
      adapter({ wx, my }, res)
    }
  })
}

/**
 * 获取 Dom 元素宽高等距离
 * @Author pengqiang
 * @Date 2021/10/26 10:55
 */
export function getDomLocation(selector, cb) {
  mpvue
    .createSelectorQuery()
    .selectAll(selector)
    .boundingClientRect()
    .exec(function(res) {
      cb && cb(res)
    });
}

/**
 * 级联地区选项卡
 * @Author pengqiang
 * @Date 2021/10/27 16:05
*/
export function getAddressList(list, cb) {
  const wx = () => {
    
  }
  const my = () => {
    mpvue.multiLevelSelect({
      title: '所在地区', // 级联选择标题
      list, // 城市级联数据列表
      success:(res)=>{
        if (res.success) {
          cb && cb(res.result)
        }
      }
    });
  }
  adapter({ wx, my })
}

/**
 * 支付功能
 * @Author pengqiang
 * @Date 2021/10/28 15:08
*/
export function tradePay ({ data, success, fail, complete }) {
  const wx = () => {
    if (!data.paySign ||
        !data.tradeNo ||
        !data.nonceStr ||
        !data.signType) {
      showAlert({ content: '参数有误！' })
      complete && complete()
      return
    }
    console.log('参数', {
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.tradeNo, // 随机字符串
      signType: data.signType,
      paySign: data.paySign // 签名
    })
    mpvue.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.tradeNo, // 随机字符串
      signType: data.signType,
      paySign: data.paySign, // 签名
      success (res) {
        console.log('成功')
        success && success(res)
      },
      fail (res) {
        console.log('发生了错误', res)
        fail && fail(res)
      },
      complete () {
        complete && complete()
      }
    })
  }
  const my = () => {
    if (!data) {
      showAlert({ content: '参数有误！' })
      return
    }
    mpvue.tradePay({
      // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
      tradeNO: data,
      success: (res) => {
        success && success(res)
      },
      fail: (res) => {
        fail && fail(res)
      },
      complete: () => {
        complete && complete()
      }
    });
  }
  adapter({ wx, my })
}

/**
 * 授权功能
 * @Author pengqiang
 * @Date 2021/11/12 11:00
 */
export function getAuthCode ({ success, fail, complete }) {
  const wx = () => {
    mpvue.login({
      success (res) {
        success && success(res.code)
      }
    })
  }
  const my = () => {
    mpvue.getAuthCode({
      scopes: ['auth_base'], // ['auth_base'] 静默授权， ['auth_user'] 主动授权
      success: (res) => {
        success && success(res.authCode)
      }
    })
  }
  adapter({ wx, my })
}

function adapter (fn, params) {
  return fn[mpvuePlatform] && fn[mpvuePlatform](params)
}

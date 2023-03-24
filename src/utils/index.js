import { setError } from './error'
import qs from 'qs'

function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// 金额格式
export const fmoney = (s, n = 2) => {
  let t = ''
  if (n) {
    s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + ''
    // eslint-disable-next-line one-var
    let l = s
        .split('.')[0]
        .split('')
        .reverse(),
      r = s.split('.')[1]

    for (let i = 0; i < l.length; i++) {
      t += l[i] + ((i + 1) % 3 === 0 && i + 1 !== l.length ? ',' : '')
    }
    return (
      t
        .split('')
        .reverse()
        .join('') +
      '.' +
      r
    )
  } else {
    return s
  }
}

export function handleError (response) {
  if (response && response.data && response.data.error_code === 0) {
    return true
  } else {
    const msg = response && response.data && response.data.msg
    if (msg) {
      showToast(msg)
    } else {
      setError('数据加载失败，请重试')
    }
    return false
  }
}

export function showToast (title, success = false) {
  success ? mpvue.showToast({ title })
    : mpvue.showToast({ title, icon: 'none' })
}

// 解码,try处理多次编码的情况
export function decodeUrl (str) {
  var data = decodeURIComponent(str)
  var json = null
  try {
    json = qs.parse(data)
    return json
  } catch (e) {
    console.log('发生了错误：', e)
  }
}

export default {
  formatNumber,
  formatTime
}

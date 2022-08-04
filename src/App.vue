<script>
import { 
    setStorageSync,
    getStorageSync,
    removeStorageSync,
    showAlert,
    showLoading,
    hideLoading,
    getAuthCode,
    tradePay
} from './api/wechat'
import { request } from '@/utils/request'

export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
  },
  onLaunch(options) {
    // 第一次打开 冷启动
    if (options.query && Object.keys(options.query).length) {
      setStorageSync('query', options.query)
    } else {
      mpvue.clearStorageSync() // 解决 2 次进入小程序保留上次订单记录，拉起支付
    }
  },
  onShow(options) {
    // 从后台被 scheme 重新打开
    // 热启动 app 打开小程序
    if (options.query && Object.keys(options.query).length) {
      setStorageSync('query', options.query)
    }
    const query = getStorageSync('query')
    this.getAuthCode(query);
  },
  onHide() {
    setStorageSync('isLoading', false)
  },
  methods: {
    // 获取授权码
    getAuthCode(query) {
      if (query) {
        // app 跳转小场景
        removeStorageSync('list'); // 清除页面详情 解决热启动数据缓存问题
        setStorageSync('amount', query.amount)
      } else {
        // h5 跳转小场景
        removeStorageSync('paymentData'); // 清除页面 paymentData 数据
        removeStorageSync('amount'); // 清除价格数据
      }

      getAuthCode({
        success: (authCode) => {
          setStorageSync('authCode', authCode);
          if(query) { 
            const isLoading = getStorageSync('isLoading')
            if (isLoading) {
              removeStorageSync('paymentData') // 清除 paymentData
              return              
            }
            showLoading({
              title: '处理中...'
            });
            this.getTradNo(query) 
          }
        }
      })
    },

    // 获取 tradNo
    getTradNo(query) {
      let authCode = getStorageSync('authCode')
      var timestamp = Date.parse(new Date())
      const { baseHeader, shopsAdmin } = this.$baseApi
      const headers = {
        ...baseHeader,
        "timestamp": timestamp
      };
      const data = {
        ...query,
        authCode
      }
      const url = `${query.profile}${shopsAdmin}/mall/order/alxcxPay`
      request({
        url,
        method: 'POST',
        headers: {
          ...headers,
          "content-type":  'application/x-www-form-urlencoded'
        },
        data,
        success: (result) => {
          if(!result.data.code) {
            showAlert({content: `${result.data.msg}`})
            return
          }
          const data = result.data
          setStorageSync('paymentData', data)
          tradePay({
            // 调用统一收单交易创建接口（alipay.trade.create），获得返回字段支付宝交易号trade_no
            data,
            success: (res) => {
              console.log('支付成功')
            },
            fail: (res) => {
              showAlert({content: JSON.stringify(res)})
            }
          })
        },
        fail: () => {
          showAlert({content: '请求出错啦！'})
          
        },
        complete: () => {
          setStorageSync('isLoading', true)
          hideLoading()
        }
      });
    }
  }
}
</script>

<style>
</style>

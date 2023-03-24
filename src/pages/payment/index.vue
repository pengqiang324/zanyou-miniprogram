<template>
<view class="payment-box">
  <view class="payment-header">订单提交成功，请尽快付款!</view>
  <view class="payment-price">
    <i class="iconfont icon-price payment-icon">&#xe6a8;</i>
    <text class='payment-price_jiage'>{{dataInfo.totalPrice}}</text>
  </view>
  <view class="payment-type">
    <view class="payment-type-l">
      <!-- <image
      class="payment-detail-image"
      mode="scaleToFill"
      src="/static/images/payment_wx.png"/> -->
      <i v-if="platForm === 'wx'" class="iconfont icon-payment-wx">&#xe62b;</i>
      <i v-if="platForm === 'my'" class="iconfont icon-payment-my">&#xe629;</i>
    </view>
    <view class="payment-type-r">
      <view class="payment-type-r_l">{{ paymentText }}</view>
      <view class="payment-type-r_r">
          <img
          class="payment-select-icon"
          mode="aspectFill" 
          src="/static/images/selected.png"/>
      </view>
    </view>
  </view>
  <view class="payment-submit" @tap="handleComfirm">
    <text v-if="!loading">确认</text>
    <template v-else>
        <loading v-if="platForm === 'my'" size="100px" color="#fff" />
        <template v-if="platForm === 'wx'">
            <van-loading type="spinner" size="18px" color="#fff" />
            <text style="margin-left: 8px;">支付中</text>
        </template>
    </template>
  </view>
</view>
</template>

<script>
import { 
  setStorageSync, 
  getStorageSync, 
  showToast, 
  tradePay, 
  showAlert, 
  showLoading, 
  hideLoading } from '@/api/wechat'
import { fmoney } from '@/utils/index'
import { request } from '@/utils/request'
export default {
  computed: {
      paymentText() {
        return mpvuePlatform === 'wx' ? '微信支付' : '支付宝支付'
      }
  },
  data() {
    return {
      platForm: mpvuePlatform,
      dataInfo: {},
      authCode: '',
      isAmount: false,
      loading: false
    }
  },

  onLoad() {
    this.init()
  },

  methods: {
    init() {
        let list = getStorageSync('list');
        let amountData = getStorageSync('amount');
        let authCode = getStorageSync('authCode');
        
        this.authCode = authCode
        if (list) {
            this.isAmount = false
            this.dataInfo = list
            this.$set(this.dataInfo, 'totalPrice', fmoney(list.price))
            console.log(this.dataInfo)
        } else {
            this.isAmount = true
            this.$set(this.dataInfo, 'totalPrice', fmoney(amountData))
        }
    },
    hasLoading(loading=true) {
        this.loading = loading
    },
    handleComfirm() {
        if (this.loading) return false
        this.hasLoading(true)
        if (this.isAmount) {
            // app 进入小程序页面
            const paymentData = getStorageSync('paymentData');
            if (!paymentData) {
                this.getTradNo()
                return
            } else {
                tradePay({ 
                    data: paymentData,
                    complete: () => {
                        this.hasLoading(false)
                    }
                })
            }
        } else {
            // 正常页面交互
            var timestamp = Date.parse(new Date())
            var body = {}
            var url = ''
            var contentType = 'application/x-www-form-urlencoded'
            const { price, spuId, name } = this.dataInfo
            const { payUrl, payShopsApp } = this.$baseApi
            if (this.platForm === 'wx') {
              contentType = 'application/json'
              url = `${payUrl}${payShopsApp}/small/program/pay/create/idcode/${this.$baseApi.baseHeader.idcode}`
              body = {
                ...body,
                amount: price,
                authCode: this.authCode,
                spuId,
                spuName: name,
                type: 1
              }
            } else if (this.platForm === 'my') {
              url = `https://t-api.5296live.com/mall/xcxpay/create?amount=${price}&code=${this.authCode}`
            }
            request({
                url,
                method: 'POST',
                headers: {
                    "content-type": contentType,
                    "timestamp": timestamp,
                    ...this.$baseApi.baseHeader
                },
                body
            }).then(result => {
                const { code, msg, data } = result.data
                if (code != 200) {
                    showAlert({content: msg || '出错啦，稍后重试！'})
                    this.hasLoading(false)
                    return
                }
                tradePay({
                    data,
                    complete: () => {
                        this.hasLoading(false)
                    }
                });
            }).catch(() => {
                this.hasLoading(false)
            })
        }
    },

    getTradNo() {
        showLoading({
            title: '处理中...'
        })
        const authCode = getStorageSync('authCode')
        const query = getStorageSync('query')
        if (!query || !authCode) {
            showAlert({content: '网络繁忙，请稍再试！'})
            this.hasLoading(false)
            return
        }
        var timestamp = Date.parse(new Date())
        const { baseHeader, shopsAdmin } = this.$baseApi
        const headers = {
          ...baseHeader,
          "timestamp": timestamp
        };
        const body = {
            ...query,
            authCode: authCode
        }
        if (!query.profile) {
            showAlert({content: '参数有误！'})
            this.hasLoading(false)
            return
        }

        let url = ''
        let contentType = 'application/x-www-form-urlencoded'
        if (mpvuePlatform === 'wx') {
          contentType = 'application/json'
          url = `${query.profile}${shopsAdmin}/order/pay/wxxcxPay/idcode/guest_c3524b8d02f749329498197887127f22`
        } else if (mpvuePlatform === 'my') {
          url = `${query.profile}${shopsAdmin}/order/pay/alxcxPay/idcode/guest_c3524b8d02f749329498197887127f22?appSrc=1`
        }
        request({
            url,
            method: 'POST',
            headers: {
              ...headers,
              "content-type": contentType
            },
            body
        }).then(result => {
            const { code, msg, data } = result.data
            if (code != 200) {
                showAlert({content: `${msg || '系统繁忙，稍后再试！'}`})
                this.hasLoading(false)
                return
            }
            setStorageSync('paymentData', data)
            tradePay({
                data,
                fail: (res) => {
                    showAlert({content: JSON.stringify(res)})
                },
                complete: () => {
                    this.hasLoading(false)
                }
            });
        }).catch(() => {
            showAlert({content: '请求出错啦！'})
            this.hasLoading(false)
        }).finally(() => {
            hideLoading();
        })
    }
  }
}
</script>

<style lang='scss'>
.payment-icon {
    font-size: 20px;
    font-weight: bold;
}
.payment-box {
  height: 100vh;
  padding: 20rpx;
  box-sizing: border-box;
  background: rgba(247,249,251,1);
}
.payment-header {
  text-align: center;
  font-size: 30rpx;
  color: rgb(134, 132, 132);
  padding: 46rpx 0 30rpx;
}
.payment-price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  font-size: 32rpx;
}
.payment-sum_price,
.payment-price_jiage {
  font-weight: bold;
}
.payment-sum_price {
  position: relative;
  bottom: 6rpx;
}
.payment-price_jiage {
  font-size: 64rpx;
}
.payment-type {
  padding: 30rpx;
  margin-top: 40rpx;
  background: #fff;
  border-radius: 12rpx;
  box-sizing: border-box;
}
.payment-type {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.payment-type-l {
  width: 60rpx;
  height: 60rpx;
  margin-right: 40rpx;
  border-radius: 12rpx;
  overflow: hidden;
  .icon-payment-my,
  .icon-payment-wx {
    height: 30px;
    font-size: 30px;
  }
  .icon-payment-wx {
    color: rgba(40,196,69,1);
  }
  .icon-payment-my {
    color: rgba(2,169,241,1);
  }
}
.payment-detail-image {
  width: 100%;
  height: 100%;
}
.payment-type-r {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.payment-type-r_l {
  color: #333;
}
.payment-type-r_r {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  overflow: hidden;
  .payment-select-icon {
    display: block;
    width: 100%;
    height: 100%;
  }
}
.payment-submit {
  margin: 140rpx auto 0;
  width: 100%;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #FF844F 0%, #F3633E 100%);
  color: #fff;
  border-radius: 40rpx;
}  
</style>
<template>
  <view class="orderBuy-box">
    <view v-if="!addressInfo.name" class="orderBuy-add_address" @tap="handleAddress">
      <van-icon v-if="platForm === 'wx'" name="plus" custom-style="position: relative; top: 2px;margin-right: 4px;" />
      <i v-if="platForm === 'my'" class="iconfont icon-add" style="margin-right: 4px;"></i>
      新增收货地址
    </view>
    <view v-else class="orderBuy-address" @tap="handleAddress">
      <view class="orderBuy-address_header"><text class="orderBuy-address_h__default">默认</text>{{addressInfo.region}}
      </view>
      <view class="orderBuy-address_center">
        <view class="orderBuy-address_c__left">{{addressInfo.detailAddress}}</view>
        <view class="orderBuy-address_c__right">
          <van-icon v-if="platForm === 'wx'" name="arrow" color="#DADADA" />
          <i-icon v-if="platForm === 'my'" type="enter" size="18" color="#DADADA" />
        </view>
      </view>
      <view class="orderBuy-address_bottom">
        <text class="orderBuy-address_name">{{addressInfo.name}}</text>
        {{addressInfo.tel}}
      </view>
    </view>
    <view v-if="addressInfo.name" class="orderBuy-bg">
      <img src="/static/images/bg.png" class="orderBuy-bg-img" />
    </view>
    <view class="orderBuy-orderInfo">
      <view class="orderBuy-orderInfo_thumb">
        <template v-if="platForm === 'wx'">
          <ImageView mode="aspectFill" :src="$baseApi.imgUrl+dataInfo.image" className="goods-detail-image" />
        </template>
        <template v-if="platForm === 'my'">
          <image mode="aspectFill" :src="dataInfo.image" className="goods-detail-image"
            style="width: 100%;height:100%;" />
        </template>
      </view>
      <view class="orderBuy-orderInfo_detail">
        <view class="orderBuy-orderInfo_name">{{dataInfo.name}}</view>
        <view class="orderBuy-right-price">
          <view class="orderBuy-icon-flex">
            <i class="iconfont icon-price" style="color:#FF6666;">&#xe6a8;</i>
            <text class="orderBuy-right-money">{{dataInfo.totalPrice}}</text>
          </view>
          <view class="orderBuy-right_number">x1</view>
        </view>
      </view>
    </view>
    <view class="orderBuy-orderDetail">
      <view class="orderBuy-orderDetail_info">
        <view class="orderBuy-orderDetail_info__l">商品总额</view>
        <view class="orderBuy-orderDetail_info__r orderBuy-orderDetail_r__on">
          <i class="iconfont icon-price">&#xe6a8;</i>
          {{dataInfo.totalPrice}}
        </view>
      </view>
      <view class="orderBuy-orderDetail_info">
        <view class="orderBuy-orderDetail_info__l">
          运费
        </view>
        <view class="orderBuy-orderDetail_info__r">
          <i class="iconfont icon-price">&#xe6a8;</i>
          <text>0.00</text>
        </view>
      </view>
      <view class="orderBuy-orderDetail_sum">
        <view>合计：</view>
        <view class="orderBuy-icon-flex">
          <i class="iconfont icon-price orderBuy-sum_price">&#xe6a8;</i>
          <text class="orderBuy-sum_price">{{dataInfo.totalPrice}}</text>
        </view>
      </view>
    </view>
    <!-- <view>
    <button open-type="getAuthorize" onGetAuthorize="onGetAuthorize" onError="onAuthError" scope='phoneNumber'>授权手机号</button>
  </view> -->
    <view class="orderBuy-orderDetail-buy">
      <view class="orderBuy-orderDetail-combined orderBuy-icon-flex">
        <i class="iconfont icon-price">&#xe6a8;</i>
        <text>{{dataInfo.totalPrice}}</text>
      </view>
      <view class="orderBuy-orderDetail-submit" @tap="handleSubmit">提交订单</view>
    </view>
  </view>
</template>

<script>
import { getStorageSync, showToast } from '@/api/wechat'
import { fmoney } from '@/utils/index'
import ImageView from '@/components/base/ImageView'
export default {
  components: {
      ImageView
  },
  data() {
    return {
      platForm: mpvuePlatform,
      dataInfo: {},
      addressInfo: {}
    }
  },
  onLoad() {
    this.init()
  },
  onShow() {
    this.getAddress()
  },
  methods: {
    init() {
        let data = getStorageSync('list');
        if (data) {
            this.dataInfo = data
            if (this.platForm === 'my') {
              this.dataInfo.image = this.$baseApi.imgUrl + this.dataInfo.image
            }
            this.$set(this.dataInfo, 'totalPrice', fmoney(data.price))
        }
    },
    getAddress() {
        let data = getStorageSync('address');
        if (data) {
            this.addressInfo = data
            this.$set(this.addressInfo, 'tel', this.splitTel(data.iphone))
        }
    },
    handleAddress() {
        this.$router.push('/pages/address/index')
    },
    handleSubmit() {
        if (this.isEmptyObject()) {
        // 地址为空
        showToast('请先新增收货地址');
        return
        }
        this.$router.push({ path: '/pages/payment/index' })
    },
    isEmptyObject() {
        const Address = getStorageSync('address');
        return !Address || Object.keys(Address).length === 0 || !Address['name']
    },
    splitTel(str) {
        return str.substr(0,3)+'****'+str.substr(7);
    }
  }
}
</script>

<style lang='scss'>
.icon-price {
    display: flex;
}
.orderBuy-box,
.orderBuy-orderInfo,
.orderBuy-orderDetail {
  padding: 24rpx 30rpx;
  box-sizing: border-box;
}
.orderBuy-box {
    height: 100vh;
    background: rgba(247,249,251,1);
}
.orderBuy-address {
  padding: 34rpx 24rpx;
  border-radius: 12rpx;
  box-sizing: border-box;
}
.orderBuy-bg-img {
    width: 100%;
    display: block;
    height: 6rpx;
  }
.orderBuy-address_header {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: normal;
  line-height: 26rpx;
  padding-bottom: 6rpx;
  color: #333333;
  opacity: 1;
}
.orderBuy-address_h__default {
  display: inline-block;
  margin-right: 12rpx;
  padding: 2rpx 4rpx;
  font-size: 20rpx;
  background: #F3633E;
  border-radius: 2rpx;
  color: #fff;
}
.orderBuy-address_center {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.orderBuy-address_c__left {
  padding-bottom: 6rpx;
  margin-right: 22rpx;
  font-size: 34rpx;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 48rpx;
  color: #333333;
}
.orderBuy-address_bottom {
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: normal;
  line-height: 26rpx;
  color: #333333;
  opacity: 1;
}
.orderBuy-address_name {
  margin-right: 12rpx;
}
.orderBuy-orderInfo {
  margin-top: 30rpx;
  display: flex;
  justify-content: space-between;
  background: #fff;
  border-radius: 12rpx;
}
.orderBuy-orderInfo_thumb {
  width: 180rpx;
  height: 180rpx;
  margin-right: 24rpx;
  border-radius: 12rpx;
  overflow: hidden;
}
.goods-detail-image {
  width: 100%;
  height: 180rpx !important;
  display: block;
}
.orderBuy-orderInfo_detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.orderBuy-orderInfo_name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #333333;
  font-weight: bold;
}
.orderBuy-right-price {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.orderBuy-right-money {
  color: #FF6666;
  font-weight: bold;
}
.orderBuy-right_number {
  font-size: 26rpx;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 26rpx;
  color: #999999;
  opacity: 1;
}
.orderBuy-orderDetail {
  margin-top: 30rpx;
  padding-top: 34rpx;
  padding-bottom:40rpx;
  border-radius: 12rpx;
  background: #fff;
}

.orderBuy-orderDetail_info {
  padding: 10rpx 0 28rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 28rpx;
  line-height: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #eee;
}
.orderBuy-orderDetail_info__r {
    display: flex;
}
.orderBuy-orderDetail_r__on {
  font-weight: bold;
  border-bottom: none;
}
.orderBuy-orderDetail_info:first-child {
  border: none;
}
.orderBuy-orderDetail_sum {
  padding-top: 32rpx;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #333;
}
.orderBuy-sum_price {
  font-weight: bold;
}
.orderBuy-orderDetail-buy {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 120rpx;
  padding: 24rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-sizing: border-box;
}
.orderBuy-orderDetail-combined {
  font-weight: bold;
}
.orderBuy-icon-flex {
    display: flex;
    align-items: baseline;
}
.orderBuy-orderDetail-submit {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 210rpx;
  height: 80rpx;
  background: linear-gradient(180deg, #FF844F 0%, #F3633E 100%);
  opacity: 1;
  border-radius: 10rpx;
  color: #fff;
  font-size: 30rpx;
}
.orderBuy-add_address {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  background: #fff;
  border-radius: 12rpx;
  &:active {
      background: #eee;
  }
}  
</style>
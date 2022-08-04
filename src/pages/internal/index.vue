<template>
  <Global>
    <view class="goods-detail-box">
      <view class="goods-detail-header">
        <template v-if="platForm === 'wx'">
          <ImageView mode="aspectFill" :src="compressedSrc" className="goods-detail-image-header" />
        </template>
        <img v-if="platForm === 'my'" class="goods-detail-image" mode="aspectFill" default-source="/images/logo.png"
          :src="compressedSrc" />
      </view>
      <view class="goods-detail-info">
        <view class="goods-detail-price">
          <view class="goods-detail-prices">
            <am-icon v-if="platForm === 'my'" type="money" size="14" />
            <i v-if="platForm === 'wx'" class="iconfont icon-price">&#xe6a8;</i>
            <text class="goods-detail-money">{{ dataDetail.totalPrice || '0.00' }}</text>
          </view>
          <!-- <view class="goods-detail-saleQty">
                销量{{dataDetail.newSaleQty}}
            </view> -->
        </view>
        <view class="goods-detail-title">{{ dataDetail.name }}</view>
      </view>
      <view class="goods-detail-divider">
        <view class="divider goods-detail-shop">
          <view class="divider-content">{{ tips }}</view>
          <view class="divider-line"></view>
        </view>
      </view>
      <view class="goods-detail-content">
        <!-- <view v-if="loading" class="loading">
              <loading v-if="platForm === 'my'" height="36rpx" color="#F3633E" />
              <van-loading v-if="platForm === 'wx'" type="spinner" size="22px"  />
              <text class="loading-text">载入中</text>
            </view> -->
        <view class="goods-detail_info">
          <view v-if="isEmpty">
            <view class="empty-box">
              <view class="empty-bg"></view>
              <view class="empty-text">暂无数据</view>
              <view class="empty-message">前不见古人，后不见来者</view>
            </view>
          </view>
          <view v-else>
            <template v-if="platForm === 'wx'">
              <ImageView v-for="(item, index) in detailImageList" :key="index" mode="widthFix"
                :src="$baseApi.imgUrl + item" />
            </template>
            <template v-if="platForm === 'my'">
              <image v-for="(item,index) in detailImageList" :key="index" class="goods-detail-image" mode="widthFix"
                :src="item" />
            </template>
          </view>
        </view>
      </view>
      <view class="goods-detail-bottom">
        <view class="goods-detail-buy" @tap="handleBuy">立即购买</view>
      </view>
    </view>
  </Global>
</template>

<script>
import { getStorageSync, getCompressImage, showToast, showLoading, hideLoading } from '@/api/wechat'
import { request } from '@/utils/request'
import Global from '@/components/Global'
import { fmoney } from '@/utils/index'
import ImageView from '@/components/base/ImageView'

export default {
  components: {
    Global,
    ImageView
  },
  data() {
    return {
      platForm: mpvuePlatform,
      compressedSrc: '',
      tips: '商品详情',
      loading: true,
      isEmpty: false,
      detailImageList: [],
      dataDetail: {}
    }
  },
  onLoad() {
    this.resetData()
    this.init()
  },
  methods: {
    resetData() {
      this.compressedSrc = ''
      this.dataDetail = {}
      this.loading = true
      this.detailImageList = []
    },
    init() {
      showLoading({ title: '正在加载' })
      let res = getStorageSync('list')
      if (res) {
        const newData = JSON.parse(JSON.stringify(res))
        newData['newSaleQty'] = this.splitPrice(newData.saleQty)
        newData['totalPrice'] = fmoney(newData.price)
        this.dataDetail = newData
        getCompressImage({
          url: newData.image,
          cb: (data) => {
            this.compressedSrc = data
          }
        })
        // 获取用户信息并存储数据
        var timestamp = Date.parse(new Date())
        const { baseHeader, apiUrl, shopsAdmin } = this.$baseApi
        const headers = {
          ...baseHeader,
          "timestamp": timestamp
        };
        request({
          url: `${apiUrl}${shopsAdmin}/product/detail/spu/idcode/guest_c3524b8d02f749329498197887127f22/${newData.spuId}`,
          method: 'get',
          headers,
        }).then(res => {
          const { data: { detailsImageList, price }, code } = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
          // new add
          if (code !== '200') {
            this.loading = false
            showToast(msg || '访问出错了，请稍后再试')
            return
          }
          const length = detailsImageList && detailsImageList.length
          // let i = 0
          // detailsImageList.forEach((item,index) => {
          //     getCompressImage({
          //         url: item,
          //         cb: (data) => {
          //             i ++
          //             this.$set(this.detailImageList, index, data)
          //             if (i === length) {
          //                 this.loading = false
          //                 hideLoading()
          //             }
          //         }
          //     })
          // })
          this.detailImageList = this.platForm === 'wx' ? detailsImageList : detailsImageList.map(item => {
            return this.$baseApi.imgUrl + item
          })
          this.isEmpty = !length ? true : false
        }).finally(() => {
          this.loading = false
          hideLoading()
        })
      }
    },
    splitPrice(num) {
      if (num >= 10000) {
        num = Math.round(num / 1000) / 10 + 'W';
      } else if (num >= 1000) {
        num = Math.round(num / 100) / 10 + 'K';
      }

      return num;
    },
    handleBuy() {
      this.$router.push('/pages/orderBuy/index')
    }
  }
}
</script>

<style lang="scss">
.divider {
  width: 100%;
  text-align: center;
  font-size: 12px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  .divider-content {
    background: #fff;
    position: relative;
    z-index: 1;
    display: inline-block;
    padding: 0 10px;
  }

  .divider-line {
    position: absolute;
    left: 0;
    width: 100%;
    height: 1rpx;
    background-color: #f7f7f7;
    color: #dedede;
    top: 50%;
  }
}

.goods-detail-box {
  padding-bottom: 120rpx;
  background: #F7F9FB;
}

.goods-detail-image,
.goods-detail-image {
  width: 100%;
  display: block;
}

.goods-detail-image-header {
  height: 750rpx !important;
}

.goods-detail-info {
  padding: 20rpx 20rpx 32rpx;
  background: #fff;
  box-sizing: border-box;
}

.goods-detail-price {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.goods-detail-prices {
  display: flex;
  align-items: flex-end;
  color: #FF6666;
  font-weight: 500;
}

.goods-detail-money {
  position: relative;
  top: 6rpx;
  font-size: 42rpx;
}

.goods-detail-saleQty {
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
}

.goods-detail-title {
  padding-top: 20rpx;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: bold;
  color: #333333;
}

.goods-detail-bottom {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 750rpx;
  height: 120rpx;
  padding: 20rpx 30rpx;
  background: #FFFFFF;
  box-shadow: 0px -10px 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
}

.goods-detail-buy {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80rpx;
  /* background: linear-gradient(180deg, rgb(233, 232, 231) 0%, rgb(196, 195, 195) 100%); */
  background: linear-gradient(180deg, #FF844F 0%, #F3633E 100%);
  color: #fff;
  border-radius: 10rpx;
}

.goods-detail-content {
  background: #fff;
  box-sizing: border-box;
}

.goods-detail_header {
  font-size: 24rpx;
  font-family: PingFang SC;
  font-weight: bold;
  line-height: 28rpx;
  color: #333333;
}

.goods-detail_info {
  font-family: PingFang SC;
  font-size: 24rpx;
}

.canvas-element {
  width: 100%;
  /* display:none; */
}

#canvas {
  width: 100%;
}

.loading {
  min-height: 400rpx;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
}

.loading-text {
  font-size: 24rpx;
  padding-top: 8px;
}

.goods-detail-shop {
  width: 320rpx !important;
  margin: 20rpx auto 10rpx;
  padding: 20px 0;
}

.goods-detail-divider {
  background: #fff;
}

.empty-box {
  padding: 80px 0;

  .empty-bg {
    width: 200px;
    height: 200px;
    margin: auto;
    background: url("https://gw.alipayobjects.com/mdn/rms_997765/afts/img/A*wKJQR6FwnMgAAAAAAAAAAABkARQnAQ") right no-repeat;
    background-size: 100%;
    background-position: 6px;
  }

  .empty-text {
    margin-top: 15px;
    text-align: center;
    font-size: 16px;
    color: #333;
  }

  .empty-message {
    padding-top: 10px;
    font-size: 14px;
    color: #c7c3c3;
    text-align: center;
  }
}
</style>
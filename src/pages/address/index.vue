<template>
  <view class="form-box">
    <view class="form-box-item">
      <view class="form-row">
        <view class="form-row-label">收货人</view>
        <view class="form-row-content">
          <input :value="form.name" @input="handleInputName" class="input" type="text" placeholder="请输入收货姓名" />
        </view>
      </view>
      <view class="form-row">
        <view class="form-row-label">手机号码</view>
        <view class="form-row-content">
          <input :value="form.iphone" @input="handleInputTel" class="input" type="text" placeholder="请输入您的手机号码" />
        </view>
      </view>
      <view class="form-row">
        <view class="form-row-label">所在地区</view>
        <view class="form-row-content form-row-content-on" @tap="handleTapAddress">
          <text v-if="platForm === 'my'" class="my-form-row-content-input"
            :class="{'my-form-row-input-on': form.region === '请输入所在地区'}">{{form.region}}</text>
          <text v-if="platForm === 'wx'"  class="wx-form-row-content-input"
            :class="{'wx-form-row-input-on': form.region === '请输入所在地区'}">{{form.region}}</text>
          <i v-if="platForm === 'my'" class="iconfont icon-arrow" style="color:#DADADA;"></i>
          <van-icon v-if="platForm === 'wx'" name="arrow" color="#DADADA" />
        </view>
      </view>
      <view class="form-row form-row-on" style="align-items: flex-start;">
        <view class="form-row-label">详细地址</view>
        <view class="form-row-content" style="position:relative;top:-2px;">
          <textarea :value="form.detailAddress" :show-count="false" auto-height placeholder="如道路、门牌号、小区、楼栋号、单元室等"
            @input="handleInputDetailaddress" />
        </view>
      </view>
    </view>
    <view class="form-submit">
      <view @tap="handleSave" class="form-submit-save">保存并使用</view>
    </view>
    <van-popup :show="show" position="bottom">
      <van-area title="所在地区" :area-list="areaList" :value="form.code" @cancel="show = false" @confirm="onConfirm" />
    </van-popup>
    <!-- <picker mode="region" @change="bindRegionChange" :value="region" :custom-item="customItem">
      <view class="picker">
        当前选择：{{region[0]}}，{{region[1]}}，{{region[2]}}
      </view>
    </picker> -->
  </view>
</template>

<script>
import { getStorageSync, setStorageSync, showToast, getAddressList } from '@/api/wechat'
import addressList from '@/utils/address'
import { areaList } from '@/utils/areaList'
export default {
  data() {
    return {
      platForm: mpvuePlatform,
      show: false,
      form: {
        name: '',
        iphone: '',
        region: '请输入所在地区',
        detailAddress: '',
        code: ''
      },
      areaList,
      region: ["440000","440100","440105"],
      customItem: '全部'
    }
  },
  onLoad() {
    this.getAddress()
  },
  methods: {
    bindRegionChange(e) {
      console.log('picker发送选择改变，携带值为', e)
      // this.setData({
      //   region: e.detail.value
      // })
    },
    getAddress() {
        let data = getStorageSync('address')
        if (data) {
            this.form = data
        }
    },
    handleInputName(e) {
        const { detail: { value }} = e.mp
        this.form['name'] = value
    },
    handleInputTel(e) {
        const { detail: { value }} = e.mp
        this.form['iphone'] = value
    },
    handleInputDetailaddress(e) {
        const { detail: { value }} = e.mp
        this.form['detailAddress'] = value
    },
    handleSave() {
        //存储地址
        const { name, iphone, region } = this.form
        if (!name || !iphone) {
            showToast('收货人/手机号码不能为空');
            return
        } else if (region === '请输入所在地区') {
            showToast('请选择所在地区');
            return
        }

        setStorageSync('address', this.form)
        this.$router.back()
    },
    handleTapAddress() {
        if (mpvuePlatform === 'my') {
            getAddressList(addressList, this.joinAddress)
        } else if (mpvuePlatform === 'wx') {
            this.show = true
        }
    },
    joinAddress(list) {
        let str = ''
        list.forEach(item => {
            str += item.name
        });
        this.form['region'] = str
    },
    onConfirm(e) {
        const { detail: { index, values } } = e.mp
        this.joinAddress(values)
        this.form['code'] = values[values.length-1]['code']
        this.show = false
    }
  }
}
</script>

<style lang='scss'>





.form-box {
  height: 100vh;
  padding-top: 30rpx;
  background: rgba(247,249,251,1);
}
.van-picker__cancel, 
.van-picker__confirm {
    color: #ff6666 !important;
}
.form-box-item {
  padding: 0 30rpx;
  background: #fff;
}
.form-row {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  font-size: 30rpx;
  font-family: PingFang SC;
  font-weight: 400;
  line-height: 30rpx;
  color: #333333;
  opacity: 1;
  border-bottom: 1px solid #eee;
}
.form-row-on {
  align-items: baseline;
}
.form-row-label {
  width: 120rpx;
  margin-right: 50rpx;
}
.form-row-content {
  flex: 1;
}
.form-row-content > input,
.form-row-content > textarea {
  font-size: 30rpx;
  line-height: 30rpx;
}
.form-row-content > textarea {
  width: auto;
  min-height: 120rpx !important;
  line-height: 42rpx;
}
.my-form-row-input-on {
  color: rgba(204,204,204,1);
}
.wx-form-row-input-on {
  color: rgba(128, 128, 128, 1);
}
.my-form-row-content-input {
  position: relative;
  left: 8px;
}
.form-row-content-on {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.form-submit {
  position: fixed;
  left: 0;
  bottom: 0;
  padding: 20rpx 34rpx;
  width: 100%;
  height: 120rpx;
  background: #fff;
  box-sizing: border-box;
}
.form-submit-save {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 682rpx;
  height: 80rpx;
  background: linear-gradient(180deg, #FF844F 0%, #F3633E 100%);
  opacity: 1;
  border-radius: 10rpx;
  font-size: 30rpx;
  line-height: 30rpx;
  color: #fff;
}  
</style>
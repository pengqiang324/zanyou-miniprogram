<template>
    <!-- <Global> -->
        <view class="page">
            <view class="search skeleton-rect">
                <view v-if="platForm === 'my'" class="my-search">
                    <view class="search-left">
                        <icon type="search" size="15" color="#333" class="search-icon" />
                        <input class="my-search-input" :value="value" type="text" placeholder-style="color:#666;"
                            @input="handleInput" @confirm="handleSubmit" placeholder="请输入搜索关键词" />
                    </view>
                    <view class="search-right" @click="handleClear">
                        <text>取消</text>
                    </view>
                </view>
                <van-search v-if="platForm === 'wx'" :value="value" placeholder="请输入搜索关键词" show-action :maxlength="20"
                    @search="handleSubmit" @cancel="handleClear" @clear="handleClear" @change="handleInput" />
            </view>

            <view style="padding:0;" class="tabs">
                <van-tabs v-if="platForm === 'wx'" :active="activeTab" @change="tabChange">
                    <van-tab v-for="(item, index) in tabs" :key="index" :title="item.title"></van-tab>
                </van-tabs>
                <view ref="myTabs" v-if="platForm === 'my'" class="my-tabs">
                    <view v-for="(item, index) in tabs" :key="index" class="my-tab"
                        :class="{'my-tab-active': index === activeTab }" @click="myChangeTab(index)">{{item.title}}
                    </view>
                    <view class="my-tab-line" :style="lineStyle"></view>
                </view>
            </view>

            <view class="content">
                <view>
                    <view v-if="isEmpty">
                        <view class="empty-box">
                            <view class="empty-bg"></view>
                            <view class="empty-text">暂无数据</view>
                            <view class="empty-message">前不见古人，后不见来者</view>
                        </view>
                    </view>
                    <view v-else class="tab-content">
                        <view v-for="(data, i) in list" :key="i" class="tab-shop" @tap="handleTap" :data-list="data">
                            <view v-if="data.platForm === 'wx'" class="tab-thumb skeleton-rect">
                                <ImageView v-if="data.platForm === 'wx'" model="aspecFill"
                                    :src="data.image ? $baseApi.imgUrl + data.image : ''"
                                    class-name="tab-thumb-image" />
                            </view>
                            <view v-if="data.platForm === 'my'" class="tab-thumb skeleton-rect">
                                <image mode="aspectFill" :src="data.image ? data.baseUrl + data.image : ''" style="width:100%;"/>
                            </view>
                            <view class="tab-title skeleton-rect">{{data.name}}</view>
                            <view class="tab-money-left">
                                <view class="tab-money skeleton-rect">
                                    <i class="iconfont icon-price">&#xe6a8;</i>
                                    <text class="tab-right-money">{{data.money}}</text>
                                </view>
                                <!-- <text class="tab-money-payment">{{data.paymentNumber}}人付款</text> -->
                            </view>
                            <view class="tab-shop-name skeleton-rect">{{data.shopName}}</view>
                        </view>
                        <view class="no-more-tips">
                            {{ tips }}
                        </view>
                    </view>
                </view>
            </view>
        </view>
    <!-- </Global> -->
</template>

<script>
import Global from '@/components/Global'
import ImageView from '@/components/base/ImageView'
import { setStorageSync, removeStorageSync, showAlert, getCompressImage, showLoading, hideLoading } from '@/api/wechat'
import { request } from '@/utils/request'
import { fmoney } from '@/utils/index'
import Skeleton from '@/components/Skeleton'
export default {
    components: {
        Global,
        ImageView,
        Skeleton
    },
    data() {
        return {
            platForm: mpvuePlatform,
            showSkeleton: true,
            loading: true,
            isEmpty: false,
            tabOn: true,
            value: '',
            tips: '',
            tabs: [
                {
                    title: '箱包鞋袜'
                },
                {
                    title: '生活百货'
                },
                {
                    title: '美妆服饰'
                },
                {
                    title: '食品生鲜'
                }
            ],
            name: '',
            activeTab: 0,
            list: [],
            imgList: [],
            lineStyle: {}
        }
    },
    onLoad() {
        this.showSkeleton = true
        this.init()
        this.clearStorage()
    },
    onReady() {
        if (this.platForm === 'my') {
            this.getRect('.my-tab', true, 0)
        } 
    },
    methods: {
        init() {
            showLoading({ title: '正在加载' })
            this.getData()
        },
        getRect(selector, isAll, index=0) {
            const selectorQuery = my.createSelectorQuery()
            const oDom = isAll ? selectorQuery.selectAll(selector) : selectorQuery.select(selector)
            oDom.boundingClientRect().exec(
                (res) => {
                    console.log('获取的位置', res)
                    const width = res[0][index].width
                    const lineWidth = width / 2
                    this.lineStyle = {
                        width: `${lineWidth}px`,
                        transform: `translateX(${width * index + (lineWidth / 2)}px)`,
                        transition: 'all 0.3s'
                    }
                    resolve(res[0])
                }
            )
        },
        myChangeTab(index) {
            this.activeTab = index
            this.getRect('.my-tab', true, index)
            this.handleTabClick({ index, tabsName: 'activeTab' })
        },
        clearStorage() {
            // 清除 app数据缓存
            removeStorageSync('query')
            removeStorageSync('amount')
        },
        getData() {
            const index = this.activeTab
            const { title: categoryName } = this.tabs[index]
            const DATE = new Date()
            const timestamp = Date.parse(DATE)
            const { baseHeader, apiUrl, shopsAdmin } = this.$baseApi
            const headers = {
                ...baseHeader,
                "timestamp": timestamp
            };
            const body = {
                categoryName,
                name: this.name
            }
            // 获取用户信息并存储数据
            request({
                url: `${apiUrl}${shopsAdmin}/smallProgramGoods/list/idcode/guest_c3524b8d02f749329498197887127f22?dt=${timestamp}&signCheck=x8988276LJ5M6f3036gG%3D%3D`,
                method: 'POST',
                headers,
                body,
                timeout: 10000
            }).then(result => {
                const { data, code, msg } = typeof result.data === 'string' ? JSON.parse(result.data) : result.data
                if (code !== '200') {
                    showAlert({
                        title: msg
                    })
                } else {
                    if (data) {
                        const newData = data.slice()
                        newData.forEach((item, index) => {
                            // getCompressImage({
                            //     url: item.image,
                            //     cb: (data) => {
                            //         this.$set(this.imgList, index, data)
                            //     }
                            // })
                            item.money = fmoney(item.price)
                            item.paymentNumber = this.splitPrice(item.payment)
                        })
                        this.list = newData
                        this.list.map(item => {
                            item.platForm = this.platForm
                            item.baseUrl = this.$baseApi.imgUrl
                        })
                        this.isEmpty = !this.list.length ? true : false
                        this.tips = '客官见底了~'
                    }
                }
            }).finally(() => {
                this.loading = false
                hideLoading()
            })
        },
        splitPrice(num) {
            if(num >= 10000) {
                num = Math.round(num/1000)/10 + '万';
            } else if (num >= 1000) {
                num += '+';
            }
        
            return num;
        },
        handleInput(value) {
            if (typeof value === 'object') {
                const { detail } = value.mp
                this.value = this.platForm === 'wx' ? detail : detail.value
            } else {
                this.value = value
            }
        },
        handleClear() {
            this.value = ''
        },
        handleSubmit(value) {
            if (typeof value === 'object') {
                const { detail } = value.mp
                this.name = this.platForm === 'wx' ? detail : detail.value
            } else {
                this.name = value
            }
            this.init()
        },
        handleTabClick({ index, tabsName }) {
            this[tabsName] = index
            this.name = ''
            // this.loading = true
            this.init()
        },
        handleTabChange({ index, tabsName }) {
            this[tabsName] = index
        },
        handleTap(ev) {
            const { dataset: { list } } = ev.currentTarget
            setStorageSync('list', list)
            this.$router.push('/pages/internal/index')
        },
        tabChange(ev) {
            const { detail: { index } } = ev.mp
            this.handleTabClick({ index, tabsName: 'activeTab' })
        },
        imageLoad() {
            console.log('加载完了')
        },
        imageError() {
            console.log('加载失败')
        },
        onShareAppMessage() {
            // 返回自定义分享信息
            return {
                title: "商品列表",
                desc: '商品列表',
                path: 'pages/indexList/indexList',
            };
        }
    }
}
</script>
<style lang="scss">
.van-tabs__line {
    background: #ff6666 !important;
}
.page {
    .tab-thumb-image {
        width: 100%;
        height: 340rpx !important;
        display: block;
    }
}
</style>

<style lang='scss' scoped>


















.page {
    min-height: 100vh;
    background: #f7f9fb;
}
.am-search-cancel {
  color: #ff6666;
}
.search {
  background: rgba(247,249,251,1);
  &.search-on {
    padding: 8rpx 0;
  }
}
.my-search {
    display: flex;
    padding: 10px 0 10px 16px;
    background: #fff;
}
.search-left {
    flex: 1;
    padding-left: 10px;
    background-color: #f7f8fa;
    border-radius: 2px;
    position: relative;
    display: -webkit-flex;
    display: flex;
    width: 100%;
    padding: 5px 10px;
    font-size: 14px;
    line-height: 24px;
    color: #333;
    background-color: #f7f8fa;
    box-sizing: border-box;
    .search-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 5px;
        line-height: 24px;
        vertical-align: middle;
    }
    .my-search-input {
        position: relative;
        display: block;
        width: 100%;
        height: 24px;
        min-height: 24px;
        font-size: 14px;
        padding: 0;
        margin: 0;
        line-height: inherit;
        color: #333;
        text-align: left;
        background-color: initial;
        border: 0;
        box-sizing: border-box;
        resize: none;
    }
}
.search-right {
    padding: 0 10px;
    font-size: 14px;
    line-height: 34px;
    color: #333;
    &:active {
        background: rgba(242,243,245,1);
    }
}
.my-tabs {
    display: flex;
    align-items: center;
    justify-content: space-between;
    user-select: none;
    background: #fff;
    .my-tab {
        min-width: 0;
        padding: 0 5px;
        font-size: 14px;
        line-height: 44px;
        color: #7d7e80;
        text-align: center;
        cursor: pointer;
        box-sizing: border-box;
        -webkit-flex: 1;
        flex: 1;
        transition: all 0.3s;
        &-active {
            font-weight: 500;
            color: #333;
        }
    }
    .my-tab-line {
        width: 50px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 1;
        height: 3px;
        background-color: #ff6666;
        border-radius: 3px;
    }
}
.zl-tabs .am-tabs-bar-tab {
  font-size: 15px !important;
}
.search, .tabs {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 11;
}
.tabs {
  top: 52px;
}
.content {
  padding-top: 94px;
}
.tab-content {
  padding: 0 24rpx 20rpx;
  display: flex;
  flex-flow: row wrap;
  background: rgba(247,249,251,1);
}
.tab-shop {
  margin-top: 20rpx;
  margin-right: 22rpx;
  padding-bottom: 10rpx;
  background: #fff;
  border-radius: 14rpx;
  width: 340rpx;
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 0 2px 4px rgb(240, 238, 238);
}
.tab-shop:nth-child(2n) {
  margin-right: 0;
}
.tab-thumb {
  width: 100%;
  background: #F2F2F2;
}
.tab-title {
  font-size: 14px;
  color: #000;
  margin-bottom: 9rpx;
  padding: 20rpx 20rpx 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tab-money-left {
  display: flex;
  align-items: center;
  padding: 0 18rpx;
  line-height: 21px;
}
.tab-money {
  display: flex;
  align-items: flex-end;
  color: #FF6666;
  font-weight: 500;
  .icon-price {
    position: relative;
    top: 4px;
  }
}
.tab-right-money {
  position: relative;
  top: 3px;
  font-size: 18px;
}
.tab-money-payment {
  position: relative;
  top: 5rpx;
  margin-left: 16rpx;
  font-size: 11px;
  color: rgb(199, 197, 197);
}
.tab-shop-name {
  margin-top: 14rpx;
  padding: 0 20rpx 10rpx;
  font-size: 12px;
  color: #333;
}
.am-page-result-title {
  font-size: 16px;
}
.loading {
  min-height: 240rpx;
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
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
.no-more-tips {
    width: 100%;
    padding: 15px 0;
    text-align: center;
    font-size: 13px;
    color: #7d7e80;
}
</style>
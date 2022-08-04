let config = {}
const PLATFORM = process.env.PLATFORM
if (/^wx$/.test(PLATFORM)) {
  config = {
    navigationBarTitleText: '赞友商城',
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    usingComponents: {
      'van-search': '/vant-weapp/dist/search/index',
      'van-tab': '/vant-weapp/dist/tab/index',
      'van-tabs': '/vant-weapp/dist/tabs/index',
      'van-icon': '/vant-weapp/dist/icon/index',
      'van-loading': '/vant-weapp/dist/loading/index'
    }
  }
}

if (/^my$/.test(PLATFORM)) {
  config = {
    defaultTitle: '赞友商城'
  }
}

module.exports = [
  {
    path: '/pages/indexList/index',
    config
  }
]

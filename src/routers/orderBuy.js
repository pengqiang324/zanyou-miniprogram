let config = {}
const PLATFORM = process.env.PLATFORM
if (/^wx$/.test(PLATFORM)) {
  config = {
    navigationBarTitleText: '赞友商城',
    backgroundTextStyle: 'dark',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    usingComponents: {
      'van-icon': '/vant-weapp/dist/icon/index'
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
    path: '/pages/orderBuy/index',
    config
  }
]

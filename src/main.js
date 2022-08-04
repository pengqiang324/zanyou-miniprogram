import Vue from 'vue'
import App from './App'
import MpvueRouterPatch from 'mpvue-router-patch'
import { errorHandler, onError } from './utils/error'
import baseApi from './utils/baseApi'
import './assets/style/index.css'

Vue.use(MpvueRouterPatch)
Vue.config.productionTip = false
// Vue异常捕获
Vue.config.errorHandler = errorHandler
Vue.prototype.$baseApi = baseApi

App.mpType = 'app'
if (mpvuePlatform === 'my') {
} else {
  // App全局异常捕获
  mpvue.onError((err) => onError(err, app))
}
const app = new Vue(App)
app.$mount()

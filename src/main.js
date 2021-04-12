import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store'
import '../theme/index.css'
import vueEsign from 'vue-esign'
Vue.use(vueEsign)
// 设置反向代理，前端请求默认发送到 http://localhost:8000/seal
var axios = require('axios')
axios.defaults.baseURL = 'http://120.24.21.98:8000/seal'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
Vue.prototype.$axios = axios

Vue.use(ElementUI);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

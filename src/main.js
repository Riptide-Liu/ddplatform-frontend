import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import StoragePlugin from 'vue-web-storage';
import request from '@/utils/request'
import router from './router'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(StoragePlugin)

Vue.prototype.$request = request;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')

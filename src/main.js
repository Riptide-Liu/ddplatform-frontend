import Vue from 'vue'
import App from './App.vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'

import '@/permission' // permission control

import StoragePlugin from 'vue-web-storage';
import request from '@/utils/request'
import helper from '@/utils/helper'
import router from './router'

import "animate.css";

import _ from 'lodash'
import modal from "@/plugins/modal";


Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(StoragePlugin)

Vue.prototype.$bus = new Vue()
Vue.prototype.$request = request;
Vue.prototype.$lodash = _;
Vue.prototype.$helper = helper
Vue.prototype.$modal = modal

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

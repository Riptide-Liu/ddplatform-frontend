import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

/** 状态定义 */
export const state = {
  loading: false,
  themeObj: 0,//主题
  keywords:'',//关键词
  baseURL:'http://localhost:8081/'
}

export default new Vuex.Store({
    state,
})

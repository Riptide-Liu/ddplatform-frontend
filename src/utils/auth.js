import Vue from "vue";

const TokenKey = 'token'
export default {
  localStorage() {
    return Vue.prototype.$localStorage;
  },
  getToken() {
    return this.localStorage().get(TokenKey)
  },
  setToken(token) {
    if (!token)
      this.localStorage().remove(TokenKey)
    else
      this.localStorage().set(TokenKey, token)
  },
  removeToken() {
    this.localStorage().remove(TokenKey)
  }
}

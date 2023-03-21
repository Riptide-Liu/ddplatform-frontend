<template>
  <div style="overflow: hidden">
    <transition enter-active-class="animate__animated animate__slideInDown" appear>
      <div class="head"
           :style="`background: url(${require('@/assets/img/user/login/head_bg.webp')});background-size: 100% 100%`">
        <span>{{ platform_name }}</span>
      </div>
    </transition>
    <img class="background" :src="loginBackground"/>
    <transition enter-active-class="animate__animated animate__slideInUp" appear>
      <div class="loginBox"
           :style="`background: url(${require('@/assets/img/user/login/form_pic.webp')});background-size: 100% 100%`">
        <h1>欢迎登录</h1>
        <el-form :model="form" :rules="rules" ref="form" label-width="0" class="form">
          <el-form-item prop="username">
            <el-input class="form-input" v-model="form.username" placeholder="请输入个人账号">
              <template v-slot:prepend>
                <el-icon class="el-icon-user-solid icon"></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input class="form-input"
                      v-model="form.password"
                      type="password"
                      @keyup.enter.native="handleLogin"
                      placeholder="请输入登录密码">
              <template v-slot:prepend>
                <el-icon class="el-icon-lock icon"></el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="captcha" v-if="captcha_image">
            <el-input v-model="form.captcha" class="captcha-input form-input" placeholder="请输入验证码"
                      @keyup.enter.native="handleLogin">
              <template v-slot:prepend>
                <el-icon class="el-icon-key icon"></el-icon>
              </template>
              <template v-slot:append>
                <img :src="`data:image;base64,${captcha_image}`" alt="验证码" class="captcha-image"
                     @click="handleRefreshCaptcha">
              </template>
            </el-input>
          </el-form-item>
          <el-form-item class="submit-button">
            <el-button type="primary" @click="handleLogin">登录</el-button>
          </el-form-item>
          <div v-if="login_type === 'user'" class="register">
            还没有账号？
            <el-button type="text" style="color: #3FB5E3" @click="handleRegister">立即注册</el-button>
          </div>
        </el-form>
      </div>
    </transition>
  </div>

</template>

<script>
export default {
  name: "UserLogin",
  computed: {
    loginBackground() {
      return  require('@/assets/img/user/login/bg.webp')
    }
  },
  data() {
    return {
      platform_name: 'DD-Platform',
      login_type: '',
      form: {captcha: ''},
      captcha: {},
      captcha_image: '',
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        captcha: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
    }
  },
  methods: {
    setFormCaptcha(value) {
      this.$set(this.form, 'captcha', value)
    },
    handleLogin() {
      this.$emit('login', {form: this.form, login_type: this.login_type})
    },
    handleRegister() {
      this.$emit('clickRegister')
    },
    handleRefreshCaptcha() {
      this.$emit('clickRefreshCaptcha')
    }
  }
}
</script>

<style scoped>
.head {
  width: 100%;
  position: absolute;
  top: 0;
  line-height: 80px;
  left: 0;
  right: 0;
  color: #fff;
  text-align: center;
  font-size: 35px;
  font-weight: bold;
}

.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  min-width: 1024px;
  z-index: -1;
  background-size: cover;
  background-position: center 0;
}

.loginBox {
  width: 520px;
  position: fixed;
  top: 20%;
  right: 0;
  left: 0;
  margin: auto;
}

.loginBox h1 {
  color: #fff;
  text-align: center;
  font-weight: bold;
  font-size: 26px;
  margin-top: 64px;
  letter-spacing: 7px;
  margin-bottom: 20px
}
.form {
  height: 300px;
  width: 300px;
  margin-left: 105px;
  color: #fff;
}

.form .form-input {
  height: 45px;
  border: 1px solid #1d90c5;
}


/deep/ .form-input .el-input__inner {
  border: 0;
  background: none;
  outline: none;
  width: 100%;
  height: 45px;
  line-height: 45px;
  color: #fff;
  letter-spacing: 1px;
  font-size: 14px
}


/deep/ .captcha-input .el-input__inner {
  width: 100%;
}

/deep/ .captcha-input .el-input-group__append {
  padding: 0;
  border-radius: 0;
}

.form-input .icon {
  font-size: x-large;
  color: #3FB5E3;
}

/deep/ .form-input .el-input-group__prepend {
  padding: 0 0 0 15px;
  background: transparent;
  border-radius: 0;
  border: 0;
}

.captcha-image {
  height: 100%;
  width: 100px;
}

/deep/ .submit-button .el-button {
  width: 300px;
  height: 45px;
  background: #3FB5E3;
  outline: none;
  text-align: center;
  color: #fff;
  letter-spacing: 2px;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid #1d90c5;
}

.register {
  color: #fff;
  font-size: 12px;
  text-align: right;
}

/deep/ .register .el-button {
  padding: 0;
}

/deep/ .form .el-tabs__nav-wrap::after {
  background: transparent;
}

/deep/ .form .el-tabs__item {
  color: #fff
}

/deep/ .form .el-tabs__item.is-active {
  color: #3FB5E3;
}

</style>

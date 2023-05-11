<template>
  <div>
    <el-dialog :append-to-body='true' :before-close="handleClose" :visible.sync="dialog_visible" title="修改密码">
      <div style="margin-right: 30px">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" status-icon>
          <el-form-item label="旧密码" prop="old">
            <el-input v-model="form.old" autocomplete="off" placeholder="请输入旧密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="new">
            <el-input v-model="form.new" autocomplete="off" placeholder="请输入新密码" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repeat">
            <el-input v-model="form.repeat" autocomplete="off" placeholder="请再次输入新密码" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword">修改</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ChangePasswordDialog",
  data() {
    let validate_old = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入旧密码'));
      } else {
        callback();
      }
    };
    let validate_new = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.form.new !== '') {
          this.$refs.form.validateField('repeat');
        }
        callback();
      }
    };
    let validate_repeat = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.new) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      dialog_visible: false,
      form: {
        old: '',
        new: '',
        repeat: ''
      },
      rules: {
        old: [
          {validator: validate_old, trigger: 'blur'}
        ],
        new: [
          {validator: validate_new, trigger: 'blur'}
        ],
        repeat: [
          {validator: validate_repeat, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    open() {
      this.dialog_visible = true
    },
    changePassword() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$api.$request(this.$api.$doc.user.function.API_USER_CHANGE_PASSWORD, {
            data: this.form
          }).then(
              resp => {
                if (resp.code === 0) {
                  this.$refs.form.resetFields();
                  this.dialog_visible = false
                }
              }
          )
        }
      });
    },
    handleClose(done) {
      this.$refs.form.resetFields();
      done()
    },
  }
}
</script>

<style scoped>
  /deep/ .el-dialog{
    width: 520px;
  }
</style>

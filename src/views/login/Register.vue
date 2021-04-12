<template>
    <div class="main">
    <el-form  class="login-container"
              label-position="left"
              label-width="55px"
              status-icon :rules="rules"
              :model="registerForm"
              ref="registerForm">
      <h3 id="h3">欢迎注册印控中台</h3>
      <el-form-item label-width="0" prop="username">
        <el-input type="text" v-model="registerForm.username"
                  auto-complete="off" placeholder="设置用户名"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="password">
        <el-input type="password" v-model="registerForm.password"
                  auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="pass">
        <el-input type="password" v-model="registerForm.pass"
                  auto-complete="off" placeholder="请再次确认密码"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="account">
        <el-input type="text" v-model="registerForm.account"
                  auto-complete="off" placeholder="输入手机号码"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="code">
          <el-row gutter="30">
            <el-col :span="15">
              <div><el-input type="text" v-model="registerForm.code"
                  auto-complete="off" placeholder="输入验证码" ></el-input></div>
            </el-col>
            <el-col :span="9">
              <div><el-button type="primary" v-on:click="phonecode" style="width: 100%;border: none" :disabled="disabled=!show">
                  <span v-show="show">获取验证码</span>
                  <span v-show="!show" class="count">{{count}} s</span>
                </el-button></div>
            </el-col>
        </el-row>
      </el-form-item>
      <el-form-item style="width: 100%" label-width="0">
        <el-button type="primary" style="width: 100%;border: none" @click="regist('registerForm')">注册</el-button>
      </el-form-item>
    <el-form-item style="width: 100%" label-width="0">
        <el-button style="float: right" type="text" v-on:click="back" >快捷登录>>></el-button>
      </el-form-item>
      </el-form>
    
    </div>
</template>

<script scoped>
  export default {
    name: 'Register',
    data () {
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('昵称不能为空！'));
        } 
          callback();
      };
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空！'));
        } 
          callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码！'));
        }else if(value !== this.registerForm.password){
            callback(new Error('密码不一致！'));
        }
          callback();
      };
      var validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('验证码不能为空！'));
        } 
          callback();
      };
      var validateAccount = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号不能为空！'));
        } else if (!this.isCellPhone(value)) {
            callback(new Error('请输入正确的手机号！'));
          }
          callback();
      };
      return {
        show: true,
        count: "", 
        timer: null,
        registerForm: {
          username: '',
          password: '',
          pass: '',
          account: '',
          code: '',
        },
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' },
            { max:20, message:'昵称设置不能过长！',trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' },
            { min:8,max:16, message:'密码长度在8到16之间！',trigger: 'blur' }
          ],
          pass:[
            { validator: validatePass, trigger: 'blur' }
          ],
          code: [
            { validator: validateCode, trigger: 'blur' }
          ],
          account: [
            { validator: validateAccount, trigger: 'blur' }
          ],
        },
        responseResult: [],
      }
    },
    
    methods: {
       back(){
         this.$router.go(-1);
       },
       isCellPhone(val) {
        if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
          return false;
        } else {
          return true;
        }
      },
      
      regist(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios
          .post('/user/register', {
            username: this.registerForm.username,
            account: this.registerForm.account,
            password: this.registerForm.password,
            code: this.registerForm.code,
          })
          .then(successResponse => {
            console.log(successResponse)
            if (successResponse.data.code === 2001) {
              //注册成功后逻辑代码
              this.$router.replace('/')
              this.$message({
              message: successResponse.data.message,
              type: 'success'
            });
            }else {
              this.$message.error(successResponse.data.message);
              }
          }
          )
          }else{
            this.$confirm('请填写正确信息', '提交错误', {
            showCancelButton: false,
            confirmButtonText: '确定',
            type: 'error'
           });
          }
        });
 
       },
       phonecode() {
        const TIME_COUNT = 60; //更改倒计时时间
              if (!this.timer) {
                this.count = TIME_COUNT;
                    this.show = false;
                    this.timer = setInterval(() => {
                        if (this.count > 0 && this.count <= TIME_COUNT) {
                            this.count--;
                        } else {
                            this.show = true;
                            clearInterval(this.timer); // 清除定时器
                            this.timer = null;
                        }
                    }, 1000);
                }
          this.$axios.post('/code/phone',{
          account: this.registerForm.account,
        }).then(resp => {
          if (resp && resp.status === 200) {
            console.log(resp)
          }
        }) 
      },
    }
  }
</script>

<style lang="scss">
    .login-container {
        background-clip: padding-box;
        margin:0 auto;
        width: 350px;
        padding: 35px 35px 5px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .image{
        height: 40px;
    }
    .main {
      padding-top: 100px;
      background-position: center;
      height: 100%;
      width: 100%;
      background-size: cover;
      position: fixed;
      background: url("../../assets/002.png") no-repeat;
      background-size: 100%;
    }
    #h3 {
      text-align: center;
      color: #909399;
    }
</style>
<template>
    <div class="main">
    <h1 id="h1" >印控中台管理后台</h1>
    
    <el-card class="login-container" v-model="activeName" @tab-click="handleClick" stretch="true">
    <h3>登录后台</h3>
        <el-form label-position="left"
              label-width="55px"
              status-icon :rules="rules"
              :model="loginForm"
              ref="loginForm">
      <el-form-item label-width="0" prop="username"> 
        <el-input type="text" v-model="loginForm.username"
                  auto-complete="off" placeholder="输入手机号"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="password">
        <el-input type="password" v-model="loginForm.password"
                  auto-complete="off" placeholder="输入密码"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="code">
          <el-row gutter="30">
            <el-col :span="15">
              <div><el-input type="text" v-model="loginForm.code"
                  auto-complete="off" placeholder="输入验证码" ></el-input></div>
            </el-col>
            <el-col :span="9">
              <div><el-image :src="codeUrl" class="image-code-login" v-on:click="loadcode"></el-image></div>
            </el-col>
        </el-row>
      </el-form-item>
      
      <el-form-item style="width: 100%" label-width="0">
        <el-button type="primary" style="width: 100%;border: none" @click="login('loginForm')">登录</el-button>
      </el-form-item>
      </el-form>
    </el-card>
    </div>
</template>

<script scoped>
  export default {
    name: 'Login',
    mounted: function () {
      this.loadcode()
    },
    data () {
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('账号不能为空！'));
        } else if (!this.isCellPhone(value)) {
            callback(new Error('请输入正确的手机号码！'));
          }
        
        callback();
        
      };
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空！'));
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
        activeName: 'first',
        loginForm: {
          username: '',
          password: '',
          code: '',
          autoLogin: '',
        },
        
        rules: {
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' },
            { min:8,max:16, message:'密码长度在8到16之间！',trigger: 'blur' }
          ],
          code: [
            { validator: validateCode, trigger: 'blur' }
          ],
          account: [
            { validator: validateAccount, trigger: 'blur' }
          ],
        },
        codeUrl: '',
        codeUid: '',
        
        responseResult: [],
      }
    },
    
     methods: {
       //检查手机号
      isCellPhone(val) {
        if (!/^1(3|4|5|6|7|8)\d{9}$/.test(val)) {
          return false;
        } else {
          return true;
        }
      },
      loadcode () {
        var _this = this
        this.$axios.get('/code/image').then(resp => {
          if (resp && resp.status === 200) {
            console.log(resp)
            _this.codeUrl = resp.data.data.img
            _this.codeUid = resp.data.data.codeId
          }
        })
      },
      
      login (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios
          .post('/login/admin', {
            account: this.loginForm.username,
            password: this.loginForm.password,
            code: this.loginForm.code,
            codeId: this.codeUid,
            autoLogin: this.loginForm.autoLogin,
          })
          .then(successResponse => {
            if(successResponse.status !== 200){
              this.$message.error(successResponse.data.message)
            }else if (successResponse.data.code === 200) {
              this.$message({
              message: '登录成功',
              type: 'success'
            });
              this.$store.commit('SET_ACCOUNT',successResponse.data.data.token)
              this.$router.replace('/ahome')
            }else {
              this.$message.error(successResponse.data.message)
            }
          })
          } else {
            this.$confirm('请检查账号密码是否正确', '提交错误', {
          showCancelButton: false,
          confirmButtonText: '确定',
          type: 'error'
        });
          }
        });
        
      },
     }
  }
</script>

<style scope>
    .login-container {
        background-clip: padding-box;
        margin:0 auto;
        width: 350px;
        padding: 0px 35px 5px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .image-code-login{
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
    #h1 {
      text-align: center;
      color: #909399;
    }
    
</style>
<template>
    <div class="main">
      <el-steps :active="active" class="step-container">
        <el-step title="校验身份" icon="el-icon-position"></el-step>
        <el-step title="修改密码" icon="el-icon-edit"></el-step>
        <el-step title="修改成功" icon="el-icon-circle-check"></el-step>
      </el-steps>
    <el-form  class="container"
              label-position="left"
              label-width="55px"
              status-icon :rules="rules"
              :model="FindPassForm"
              ref="FindPassForm"
              v-if="active===1">
      
      <el-form-item label="手机号" prop="account" >
        <el-row gutter="25">
          <el-col :span="23">
        <el-input type="text" v-model="FindPassForm.account" 
                  auto-complete="off" placeholder="输入手机号码"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="验证码" prop="code" >
          <el-row gutter="25">
            <el-col :span="14">
              <div><el-input type="text" v-model="FindPassForm.code"
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
      <el-form-item style="width: 100%" label-width="0" class="form">
        <el-button type="primary" style="width: 100%;border: none" @click="check('FindPassForm')">点击验证</el-button>
      </el-form-item>
    <el-form-item style="width: 100%" label-width="0">
        <el-button style="float: right" type="text" v-on:click="back" >返回登录</el-button>
      </el-form-item>
      </el-form>

      <el-form  class="container"
              label-position="left"
              label-width="55px"
              status-icon :rules="rules"
              :model="PassForm"
              ref="PassForm"
              v-if="active===2">
      <el-form-item label-width="0" prop="password">
        <el-input type="password" v-model="PassForm.password"
                  auto-complete="off" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label-width="0" prop="pass">
        <el-input type="password" v-model="PassForm.pass"
                  auto-complete="off" placeholder="请再次确认密码"></el-input>
      </el-form-item>
      <el-form-item style="width: 100%" label-width="0" class="form">
        <el-button type="primary" style="width: 100%;border: none" @click="update('PassForm')">修改密码</el-button>
      </el-form-item>
    <el-form-item style="width: 100%" label-width="0">
        <el-button style="float: right" type="text" v-on:click="back" >返回登录</el-button>
      </el-form-item>
      </el-form>

      <el-form  class="container"
              label-position="left"
              label-width="55px"
              v-if="active===3">
        <el-form-item label-width="0" class="form">
        <el-progress type="circle" :percentage="100" status="success"></el-progress>
        </el-form-item>
        <el-form-item label-width="0" class="form">
        <h3>修改密码成功！<el-button type="text" v-on:click="back" >点击登录</el-button></h3>
        </el-form-item>
      </el-form>
    </div>
</template>

<script scoped>
  export default {
    name: 'FindPass',
    
    data () {
      var validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('密码不能为空！'));
        } 
          callback();
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码！'));
        }else if(value !== this.PassForm.password){
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
        active: 1,
        show: true,
        count: "", 
        timer: null,
        FindPassForm: {
          account: '',
          code: '',
        },
        PassForm: {
          password: '',
          pass: '',
        },
        rules: {
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
      
      check(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios
          .post('/user/recover/code', {
            account: this.FindPassForm.account,
            code: this.FindPassForm.code,
          })
          .then(successResponse => {
            console.log(successResponse)
            if (successResponse.data.code === 201) {
              //验证成功后逻辑代码
              this.$store.commit('SET_ACCOUNT',this.FindPassForm.account)
              this.active = 2
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

      update(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios
          .post('/user/recover/update', {
            account: this.$store.getters.getAccount,
            password: this.PassForm.password,
          })
          .then(successResponse => {
            console.log(successResponse)
            if (successResponse.data.code === 202) {
              //修改密码成功后逻辑代码
              this.active = 3
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
          account: this.FindPassForm.account,
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
    .step-container {
        background-clip: padding-box;
        margin:0px auto;
        width: 400px;
        padding: 35px 35px 25px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .container {
        background-clip: padding-box;
        margin:0px auto;
        width: 400px;
        padding: 35px 35px 5px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }
    .image{
        height: 40px;
    }
    .main {
      padding-top: 0px;
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
    .form {
      text-align:center;
    }
    
</style>
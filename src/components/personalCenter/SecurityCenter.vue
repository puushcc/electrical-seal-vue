<template>
    <div>
        <div>
            <el-card >
                <div slot="header" >
                <span style="font-weight:800">登录账号</span>
                </div>
            <div>
                <p >手机号码：{{account}}</p>
                <el-divider></el-divider>
                <p >个人邮箱：{{mail}}
                    <el-button type="primary" style="float:right" v-show="ismail" @click="open">绑定邮箱</el-button>
                    <el-button type="primary" style="float:right" v-show="!ismail" @click="open">更换邮箱</el-button>
                </p>
            </div>
            </el-card>
        </div>

        <div class="security-box">
            <el-card >
                <div slot="header" >
                <span style="font-weight:800">密码校验</span>
                </div>
            <div>
                <p >登录密码： ••••••••
                    <el-button type="primary" style="float:right" v-on:click="updatepass">修改密码</el-button>
                </p>
                <el-divider></el-divider>
                <p >签署密码</p>
                <el-button type="primary" style="float:right" v-show="issgin">设置</el-button>
                    <el-button type="primary" style="float:right" v-show="!issgin">更换</el-button>
                  <p>  为保障您的签署真实安全有效，完成签署时，您需要输入【签署密码】确认提交签署结果</p>
            </div>
            </el-card>
        </div>

        <div class="security-box">
            <el-card >
                <div slot="header" >
                <span style="font-weight:800">注销账号</span>
                </div>
            <div>
                <p >注销后，所有用户数据将被清除且不可恢复，请慎重考虑
                    <el-button type="primary" style="float:right">注销</el-button>
                </p>
            </div>
            </el-card>
        </div>

    </div>
</template>


<script>
export default {
    mounted: function () {
      this.loaddata()
    },
    
    data() {
        return {
            ismail: true,
            issgin: true,
            account: '',
            mail: '',
        }
    },

    methods: {
        updatepass(){
            this.$router.replace('/findpass')
        },
        loaddata(){
            var _this = this;
            if(this.$store.getters.getAccount == ''){
                this.$router.replace('/')
            }else{
                this.$axios.get('/information/getinfor',{
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              console.log(resp)
              if(resp.data.code == 401){
                    this.$router.replace('/')
                    this.$message.error('登录信息过期')
              }else{
                  
                  _this.account = resp.data.data.account
                  
                  if(resp.data.data.mail == '' || resp.data.data.mail == null){
                    _this.mail = '未设置邮箱'
                    _this.ismail = true
                  }else{
                    _this.mail = resp.data.data.mail
                    _this.ismail = false
                  }
                  
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
            }

        },
        open(){
            this.$prompt('请输入邮箱',  {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {

            var _this = this
            this.$axios.post('/information/updateMail',{
            mail: value,
          },
          {
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              console.log(resp)
              if(resp.data.code == 401){
                    this.$router.replace('/')
                    this.$message.error('登录信息过期')
              }else if(resp.data.code == 200){
                 this.$message({
                    type: 'success',
                    message: '修改成功: ' + value
                });
                _this.mail = resp.data.data.mail
                _this.ismail = false
              }else{
                  this.$message({
                    type: 'error',
                    message: '修改失败！'
                });
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
            
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消修改'
          });       
        });
        }
    },

}
</script>


<style scope>

.security-box{
    margin-top: 20px;
}

</style>
<template>
    <div class="mess">
        <el-card >
  <div class="text item">
    <div class="block">
      <el-image :size="80" :fit="cover" :src="circleUrl" style="width: 100px; height: 100px;border-radius: 50%"></el-image>
    </div>
    <div class="block2">
      <span>{{isName}}（{{account}}）</span>
      <el-tooltip placement="top">
        <div slot="content">{{isreal}}</div>
        <el-button class="el-icon-user" type="text"></el-button>
      </el-tooltip>
    </div>
  </div>
</el-card>

<el-card class="box-card">
  <div class="text item">
    <div>
      <p style="color: #f47920;font-size:20px;margin:20px" v-show="!isRZ">您还未完成实名认证</p>
      <p style="color: green;font-size:20px;margin:20px" v-show="isRZ">您已完成实名认证</p>
      <ul style="font-size:16px">
        <li>为保障签约方的身份主体真实有效，您需要实名认证后才能发起并签署个人文件</li>
        <li>您的身份信息仅用于个人实名认证服务，我们采用了各种安全技术来确保您的个人信息不被泄露和未经授权的使用</li>
      </ul>
      <el-button v-show="!isRZ" type="primary" style="font-size:16px;margin:20px" @click="opencheck">去认证</el-button>
    </div>
  </div>
</el-card>

<el-card class="box-card" v-show="enshow">
  <div class="text item">
    <div slot="header" class="clearfix">
    <span style="font-size:16px;float:right"><el-button class="el-icon-close" type="text" style="float:right" v-on:click="clo"></el-button></span>
    </div>
    <div>
      <p style="font-size:16px;margin:20px">升级为企业用户，获得更多权益
        <el-button type="primary" style="font-size:16px;float:right" v-show="enterpriseStats" v-on:click="openecheck">企业认证申请</el-button>
        <el-button type="primary" style="font-size:16px;float:right" v-show="!enterpriseStats" disabled >申请审核中</el-button>
        </p>
      <ul style="font-size:16px">
        <li>企业签发文件</li>
        <li>印章维护与管理</li>
        <li>业务分类维护</li>
        <li>文件模板维护</li>
      </ul>
      <p style="font-size:16px;margin:20px">企业认证审核将在您提交企业所有信息后进行，一般会在1~2个工作日完成审核</p>
      
    </div>
  </div>
</el-card>

<el-card class="box-card" style="height:800px">
  <div class="text item">
    <div slot="header" class="clearfix">
    <span style="font-size:16px">等待我处理的文件</span>
  </div>

  </div>
</el-card>

    </div>
</template>

<script scope>
  export default {
    mounted: function () {
      this.loaddata()
    },
    data () {
      return {
        circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
        enshow: true,
        isName: '',
        isreal: '未实名',
        account: '',
        isRZ: '',
        enterpriseStats: true,
      }
    },
    methods: {
    clo(){
      this.enshow = false
    },
    loaddata(){
      var _this = this;
      if(this.$store.getters.getAccount == ''){
        this.$router.replace('/')
      }else{
        //通过token获取是否用户信息
      this.$axios.get('/check/checkByUser',{
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
                //已经实名
                _this.isName = resp.data.data.realName
                if(resp.data.data.image != null){
                  _this.circleUrl = resp.data.data.image
                }
                _this.isreal = '已实名'
                _this.isRZ = true
              }else{
                //未实名
                _this.isName = '未实名'
                 if(resp.data.data.image != null){
                  _this.circleUrl = resp.data.data.image
                }
                _this.isreal = '未实名'
                _this.isRZ = false
              }
              _this.account = resp.data.data.account
            }else{
              this.$message.error('登录信息过期')
            }
          })
          this.$axios.get('/enterprise/checkByUser',{
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              console.log(resp)
              if(resp.data.code == 200){
                _this.enshow = false
              }else{
                if(resp.data.data.enterpriseStats == 0){
                  _this.enterpriseStats = false 
                }else{
                  _this.enterpriseStats = true
                }
              }
            }else{
              this.$message.error('登录信息过期')
            }
          })
      }

      
    },
    opencheck(){
       this.$router.replace('/pcertification')
    },
    openecheck(){
      this.$router.replace('/ecertification')
    }
    },
  }
</script>

<style scope>

  .text {
    font-size: 30px;
  }

  .item {
    padding: 18px 0;
  }

  .block{
    margin: 50px;
    width: 7%  ;
    float: left;
  }
.clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.box-card{
  margin-top: 30px;
}
  .block2{
    margin-top:  50px;
    width: 50%  ;
    float: left;
  }

  .mess{
    margin: 30px;
    width: 1600px;
  padding: 3px;
  }
</style>
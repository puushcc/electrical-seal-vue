<template>
<div class="wapper-out">
    <div class="wapper">
    <div class="wapper-avi">
        <el-card shadow="hover">
            <div>
                <div class="blockp">
        <el-image :size="80" :fit="cover" :src="circleUrl" style="width: 80px; height: 80px;border-radius: 50%"></el-image></div>
                  <div>
                    <span>{{isName}}</span>

      <el-tooltip placement="top">
        <div slot="content">{{isreal}}</div>

        <el-button class="el-icon-user" type="text"></el-button>
      </el-tooltip>

      <p>{{account}}</p>

      </div>
            </div>
        </el-card>
    </div>
    <div class="wapper-select">
        <el-card shadow="hover">
<div class="tab_title">
          <ul>
            <li @click="tab=0" :class="{tab_active:tab==0}">
             基本信息
            </li>
            <li @click="tab=1" :class="{tab_active:tab==1}">
             安全中心
            </li>
            <li @click="tab=2" :class="{tab_active:tab==2}">
             企业信息
            </li>
          </ul>
        </div>
        </el-card>
    </div>
    </div>
    <div class="wapper-main">
        <div class="tab_content" v-if="tab==0">
              <basicInformation/>
          </div>
          <div class="tab_content" v-else-if="tab==1">
            <securitycenter/>
          </div>
          <div class="tab_content" v-else-if="tab==2">
            <companycenter/>
          </div>
    </div>

    
</div>
    
</template>

<script>
import basicInformation from '../personalCenter/BasicInformation'
import securitycenter from '../personalCenter/SecurityCenter'
import companycenter from '../personalCenter/CompanyCenter'
export default {
    name: 'PersonalCenter',
    components: {basicInformation,securitycenter,companycenter},
    mounted: function () {
      this.loaddata()
    },
    methods: {loaddata(){
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
                 if(resp.data.data.image != null){
                  _this.circleUrl = resp.data.data.image
                }
                _this.isName = '未实名'
                _this.isreal = '未实名'
                _this.isRZ = false
              }
              _this.account = resp.data.data.account
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
      }
    }
    },
    data() {
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            isName: '',
            isreal: '未实名',
            account: '',
            tab:0,
        }
    },
}
</script>

<style>
.wapper-out{
  width: 1600px;
}
.wapper{
    width: 300px;
    background-color: #E9EEF3;
    float: left;
    margin: 10px;
    margin-left: 150px;
}

.wapper-main{
    width: 600px;
    margin: 10px;
    float: left;
}

.wapper-avi{
    width: 300px;
    
}

.wapper-select{
    width: 300px;
    margin-top: 10px;
}

  .blockp{
    float: left;
    margin: 10px;
  }

.select-btn{
    width: 100%;

}


.tab_title .tab_active{
  cursor: pointer;
  background: linear-gradient(to right top, #ffffff, #fcfcfc);
  color: rgb(255, 0, 0);
  border: 0;
}

.tab_title{
  width: 261px;
  height: 100%;
}
.tab_title>ul{
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
  height: 140px;
  display: flex;
  flex-direction: column;
}
.tab_title>ul>li{
  flex-grow: 1;
  width: 100%;
  text-align: left;
  line-height: 50px;
  display: flex;
  justify-content: left;
}
.tab_title>ul>li:hover{
  cursor: pointer;
}

</style>
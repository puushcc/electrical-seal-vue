<template>
    <div>
        <div v-show="enshow">
            <el-card>
                <div slot="header" >
                <span style="font-weight:800">所属企业</span>
                </div>
            <div class="imgs-box">
                <el-image
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                <p>暂不属于任何企业</p>

                <p><el-button type="primary" v-show="enterpriseStats" v-on:click="openecheck">企业认证</el-button>
                <el-button type="primary" v-show="!enterpriseStats" disabled>申请审核中</el-button></p>
            </div>
            </el-card>
        </div>

        <div v-show="enshow2">
            <el-card>
                <div slot="header" >
                <span style="font-weight:800">所属企业</span>
                </div>
            <div >
                <p>企业名称：{{enName}}</p>
            <el-button type="primary" v-show="more" v-on:click="moreinfor">查看更多信息</el-button>
            <p v-show="!more">服务行业：{{enIndustry}}</p>
            <p v-show="!more">企业注册地：{{enLocal}}</p>
            <p v-show="!more">所在地区：{{enCity}}</p>
            <span v-show="!more">营业执照：<img :src="enBusiness" class="avatar"></span>
            <p v-show="!more">统一社会信用代码：{{enCode}}</p>    
            <p v-show="!more">法定代表人：{{enUser}}</p>    
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
            url: 'https://demo-1304423007.cos.ap-guangzhou.myqcloud.com/electric/staic/pic_data_no.89e8bad5.png',
            enterpriseStats: true,
            enshow:true,
            enshow2:false,
            more:true,
            enName: '',
            enIndustry: '',
            enLocal: '',
            enCity: '',
            enBusiness: '',
            enCode: '',
            enUser: '',
        }
    },
    methods: {
        moreinfor(){
            this.more = false
        },
        loaddata(){
            var _this = this
            this.$axios.get('/enterprise/checkByUser',{
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              console.log(resp)
              if(resp.data.code == 200){
                _this.enshow = false
                _this.enshow2 = true
                _this.enName = resp.data.data.enterpriseName
                _this.enIndustry = resp.data.data.enterpriseIndustry
                _this.enLocal = resp.data.data.enterpriseLocal
                _this.enCity = resp.data.data.enterpriseCity
                _this.enBusiness = resp.data.data.enterpriseBusiness
                _this.enCode = resp.data.data.enterpriseCode
                _this.enUser = resp.data.data.enterpriseUser
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
        },
        openecheck(){
      this.$router.replace('/ecertification')
        }
    },



}
</script>

<style scope>
.imgs-box{
    text-align: center;
}

.imgs{
    margin: 130px;
}
.avatar{
  width: 178px;
    height: 178px;
    display: block;
}
</style>
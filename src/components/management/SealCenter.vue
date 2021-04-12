<template>
<div class="wapper-out">
        <el-card shadow="hover">
            <div slot="header" >
                <el-button type="primary" icon="el-icon-s-check" @click="des()">印章制作</el-button>
            </div>
            
            <div>
                <el-row>
                <el-image
                v-if="showimg"
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                
                <el-col :span="5.5" v-for="o in sginsrc" :key="o">
                    <el-tooltip effect="dark" placement="right">
                        <p slot="content" style="font-size: 14px;margin-bottom: 6px;">印章名称：{{o.sealName}}</p>
                        <p slot="content" style="font-size: 14px;margin-bottom: 6px;">印章编号：{{o.sealNum}}</p>
                        <p slot="content" style="font-size: 14px;margin-bottom: 6px;">印章创建时间：{{o.createTimestamp}}</p>
                        <p slot="content" style="font-size: 14px;margin-bottom: 6px;">印章状态：{{o.state}}中</p>
                    <el-card :body-style="{ padding: '0px' }" style="margin:10px" >
                        <img :src="o.sealUrl" class="image">
                        <div style="padding: 0px;">
                        <div class="bottom clearfix">
                            <p  class="text2">{{o.sealName}}</p>
                            <el-button type="text2" class="button" @click="deletesign(o.sealUrl)">删除</el-button>
                        </div>
                        </div>
                    </el-card>
                    </el-tooltip>
                </el-col>
                </el-row>
            </div>

        </el-card>
</div>
    
</template>

<script>
export default {
    mounted: function () {
      this.loaddata()
    },
    methods: {
    loaddata(){
      var _this = this;
            if(this.$store.getters.getAccount == ''){
                this.$router.replace('/')
            }else{
                this.$axios.get('/enterpriseSeal/selectEnterpriseSeal',{
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              // console.log(resp)
              if(resp.data.code == 401){
                    this.$router.replace('/')
                    this.$message.error('登录信息过期')
              }else if(resp.data.code == 200){
                  _this.sginsrc = resp.data.data
                  if(resp.data.data == null){
                    _this.showimg = true
                  }else{
                    _this.showimg = false
                  }
                  
              }else{
                  this.$message.error('获取失败')
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
            }
    },
    deletesign(val){
 this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //删除
          this.$axios.post('/enterpriseSeal/delEnterpriseSeal',{
            sealUrl: val,
          },
          {
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              // console.log(resp)
              if(resp.data.code == 401){
                    this.$router.replace('/')
                    this.$message.error('登录信息过期')
              }else if(resp.data.code == 200){
                 this.$message({
                    type: 'success',
                    message: '删除成功! ' 
                });
                this.loaddata()
              }else{
                  this.$message({
                    type: 'error',
                    message: '删除失败！'
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
            message: '已取消删除'
          });          
        });
    },
    des(){
        this.$router.replace('/sealDesgin')
    }
    },
    data() {
        return {
            url: 'https://demo-1304423007.cos.ap-guangzhou.myqcloud.com/electric/staic/pic_data_no.89e8bad5.png',
            showimg: true,
            sginsrc: '',
        }
    },
}
</script>

<style scope>
.wapper-out{
  width: 1600px;
  height: 1000px;
  padding: 20px;
}
.hover{
    margin: 20px;
}
.imgs{
    margin: 130px;
}
.image{
    width: 250px;
    height: 250px;
}
.text2{
    text-align: center;
    size: 14px;
}
.button{
    float: right;
    margin-right: 20px;
}
</style>
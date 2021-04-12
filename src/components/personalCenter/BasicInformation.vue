<template>
    <div>
        <div v-show="isName">
            <el-card >
            <div>
                <div>
                <p style="color: #f47920;font-size:16px;margin:20px" >个人实名认证
                    <el-button type="primary" style="font-size:16px;margin:20px;float:right" @click="opencheck">去认证</el-button>
                </p>
                <p style="font-size:16px;margin:20px">为保障您的身份真实有效，签署结果具有法律效力，建议您完成个人实名认证</p>
            </div>
            </div>
            </el-card>
        </div>
        <div class="information">
            <el-card >
            <div slot="header" >
                <span>个人信息</span>
            </div>

            <div class="information-box">
                <p>头像：<span><el-image :size="80" :fit="cover" :src="circleUrl" style="width: 100px; height: 100px"></el-image></span>
                <el-button type="primary" 
                style="font-size:14px;margin-top:40px;float:right"
                 @click="dialogFormVisible = true" >更换头像</el-button>
                <el-dialog title="更换头像" :visible.sync="dialogFormVisible">
                  <div class="dia-box">
                    <p>点击+设置头像</p>
                  <el-upload
                    class="avatar-uploader"
                    action="http://localhost:8000/seal/fileLoad/upload"
                    :headers="myHeaders"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                  <el-button type="primary" 
                style="font-size:14px;float:right" v-on:click="saveH">保存</el-button>
                  </div>
                </el-dialog>
                </p>
                <el-button type="primary" style="float:right" @click="open" >更换用户名</el-button>
                <p>用户名：<span>{{username}}</span></p>
                <p>账号：<span>{{account}}</span></p>
                <p>邮箱：<span>{{mail}}</span></p>
                <p>身份：<span>{{role}}</span></p>
            </div>
            </el-card>
        </div>

        <div class="sign">
            <el-card >
            <div slot="header" >
                <span>个人签名</span>
                <el-button size="small" style="float:right" icon="el-icon-plus" circle @click="dialogFormVisible2 = true"></el-button>
             <el-dialog title="添加签名" :visible.sync="dialogFormVisible2">
                <vue-esign ref="esign" :width="800" :height="300" :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" :bgColor.sync="bgColor" />
                <el-button type="primary"  @click="handleReset">清空</el-button> 
                <el-button type="primary"  @click="handleGenerate">保存</el-button>
                </el-dialog>
            </div>
            <div>
            <el-row>
  <el-col :span="12" v-for="o in sginsrc" :key="o">
              <el-card :body-style="{ padding: '0px' }" style="margin:10px" >
                <img :src="o.signUrl" class="image">
                <div style="padding: 10px;">
                  <div class="bottom clearfix">
                    <el-button type="text" class="button" @click="deletesign(o.signUrl)">删除</el-button>
                  </div>
                </div>
              </el-card>
       </el-col>
</el-row>
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
    methods: {
      handleAvatarSuccess(res, file) {
        this.srcUrl=res.data
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
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
              // console.log(resp)
              if(resp.data.code == 401){
                    this.$router.replace('/')
                    this.$message.error('登录信息过期')
              }else if(resp.data.code == 200){
                  _this.username = resp.data.data.userName
                  _this.account = resp.data.data.account
                   if(resp.data.data.image != null){
                  _this.circleUrl = resp.data.data.image
                }
                  _this.role = resp.data.data.password
                  if(resp.data.data.mail == '' || resp.data.data.mail == null){
                    _this.mail = '未设置邮箱'
                  }else{
                    _this.mail = resp.data.data.mail
                  }
                  
              }else{
                  _this.username = resp.data.data.userName
                  _this.account = resp.data.data.account
                  _this.role = resp.data.data.password
                   if(resp.data.data.image != null){
                  _this.circleUrl = resp.data.data.image
                }
                  if(resp.data.data.mail == '' || resp.data.data.mail == null){
                    _this.mail = '未设置邮箱'
                  }else{
                    _this.mail = resp.data.data.mail
                  }
                 _this.isName = false
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
          this.$axios.get('/sign/selectUserSign',{
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
                  console.log(this.sginsrc)
              }else{
                  this.$message.error('获取个人签名失败')
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
            }
          
        },
        opencheck(){
            this.$router.replace('/pcertification')
        },
        open() {
        this.$prompt('用户名', '修改用户名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
            var _this = this
            this.$axios.post('/information/updateUserName',{
            userName: value,
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
                    message: '修改成功: ' + value
                });
                _this.username = resp.data.data.userName
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
      },
      saveH(){
          this.$axios.post('/information/updateImage',{
            image: this.srcUrl,
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
                    message: '修改成功! ' 
                   
                });
                this.dialogFormVisible = false
                this.circleUrl = resp.data.data.image
                location.reload()
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
        
      },
      handleReset () {
    this.$refs['esign'].reset() //清空画布
  },
  handleGenerate () {
    this.$refs['esign'].generate().then(res => {
      this.resultImg = res // 得到了签字生成的base64图片
      //请求后端添加个人签名
      this.$axios.post('/sign/addUserSign',{
            signUrl: res,
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
                    message: '添加成功! ' 
                });
                this.loaddata()
              }else{
                  this.$message({
                    type: 'error',
                    message: '添加失败！'
                });
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
      this.dialogFormVisible2 = false
      this.$refs['esign'].reset() //清空画布
    }).catch(err => { //  没有签名，点击生成图片时调用
      this.$message({
        message: err + ' 未签名！',
        type: 'warning'
      })
      alert(err) // 画布没有签字时会执行这里 'Not Signned'
    })
  },
  deletesign(res){
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(res)
          //删除个人签名接口
          this.$axios.post('/sign/delUserSign',{
            signUrl: res,
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
  }
    },

    data() {
      var token =  this.$store.getters.getAccount
        return {
            isName: true,
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            srcUrl: '',
            username: '',
            account:'',
            mail: '',
            role: '',
            dialogFormVisible: false,
            dialogFormVisible2:false,
            imageUrl: '',
            myHeaders: {Authorization: token},
            lineWidth: 6,
            lineColor: '#000000',
            bgColor: '',
            resultImg: '',
            isCrop: false,
            sginsrc: '',
        }
    },
}
</script>

<style scoped>

.information{
    margin-top: 20px;
}
.information-box{
    text-align: left;
}
.sign{
    margin-top: 20px;
}
p{
    margin-top: 30px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .dia-box{
    margin: 20px;
    
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 120px;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>
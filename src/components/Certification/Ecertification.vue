<template>
    <div class="out-box">
        <div v-show="suc">
            <el-card class="box-pcre">
                <div slot="header" >
                <span style="font-weight:800">企业认证申请</span>
                <p>填写以下组织机构信息</p>
                </div>
            <div>
               
               <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="140px">
                <el-form-item label="企业名称：" prop="enterpriseName">
                    <el-input type="text" v-model="ruleForm.enterpriseName" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="服务行业：" >
                    <el-select v-model="ruleForm.enterpriseIndustry" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="企业注册地：" >
                    <el-select v-model="ruleForm.enterpriseLocal" placeholder="请选择">
                    <el-option
                    v-for="item in options2"
                    :key="item.value"
                    :label="item.value"
                    :value="item.value">
                    </el-option>
                </el-select>
                </el-form-item>
                <el-form-item label="所在地区：">
                <el-input type="text" v-model="ruleForm.enterpriseCity" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>

                <el-form-item label="营业执照：">
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
                </el-form-item>

                <el-form-item label="统一社会信用代码：">
                <el-input type="text" v-model="ruleForm.enterpriseCode" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>

                <el-form-item label="法定代表人：">
                <el-input type="text" v-model="ruleForm.enterpriseUser" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" v-on:click="sub">提交申请</el-button>
                </el-form-item>
                </el-form>
            </div>

            </el-card>
        </div>
        
        <div v-show="!suc">
            <el-card class="box-pcre">
                <img :src="retp" style="height:300px;weight:300px;margin-left:200px">
                <p>申请成功！<el-button type="primary" v-on:click="ret" style="margin-left:230px">返回首页</el-button></p>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    data() {
       var token =  this.$store.getters.getAccount
        var enterpriseName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入信息'));
        }
        else {
          callback();
        }
      };
      
        return {
          suc:true,
          retp:"https://demo-1304423007.cos.ap-guangzhou.myqcloud.com/images/src%3Dhttp___ku.90sjimg.com_element_origin_min_pic_17_03_10_e28925604e8ea785638ee3cbfcd7f70e.jpg%26refer%3Dhttp___ku.90sjimg.jpg",
          myHeaders: {Authorization: token},
          srcUrl: '',
          imageUrl: '',
            ruleForm: {
          enterpriseName: '',
          enterpriseIndustry: '',
          enterpriseLocal: '',
          enterpriseCode: '',
          enterpriseUser: '',
          enterpriseCity: '',
        },
        options: [{
          value: '餐饮',
          
        }, {
          value: '电商',
          
        }, {
          value: '品牌',
          
        }, {
          value: '酒店',
          
        }, {
          value: '教育',
          
        },
        {
          value: '金融',
          
        },{
          value: '汽车',
          
        },{
          value: '医疗',
          
        }, {
          value: '交通',
          
        }, {
          value: '政务',
          
        }, {
          value: '其它',
          
        },   ],
        options2: [{
          value: '中国大陆',
          
        }, {
          value: '中国香港',
          
        }, {
          value: '中国台湾',
          
        }, {
          value: '中国澳门',
          
        }],
            rules: {
          realName: [
            { validator: enterpriseName, trigger: 'blur' }
          ],
          
        }
        }
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
    loadup(){
         var _this = this;
            if(this.$store.getters.getAccount == ''){
                this.$router.replace('/')
            }else{
                this.$axios.post('/check/Personal',{
                    idCard:this.ruleForm.idCard,
                    realName: this.ruleForm.realName
                },{
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
                  this.$confirm('个人实名认证成功', '成功', {
          confirmButtonText: '确定',
          showCancelButton: false, 
          type: 'success',
          center: true
        }).then(() => {
          this.$router.replace('/home')
        }).catch(() => {
          this.$router.replace('/home')
        });
              }else{

                 this.$confirm('个人实名认证失败', '失败', {
          confirmButtonText: '重新认证',
          type: 'error',
          showCancelButton: false, 
          center: true
        }).then(() => {
          _this.ruleForm.idCard = ''
          _this.ruleForm.realName = ''
        }).catch(() => {
          _this.ruleForm.idCard = ''
          _this.ruleForm.realName = ''
        });
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
            }
    },
    sub(){
      this.$axios.post('/enterprise/checkByEnterprise',{
                    enterpriseName : this.ruleForm.enterpriseName,
                    enterpriseIndustry : this.ruleForm.enterpriseIndustry,
                    enterpriseLocal : this.ruleForm.enterpriseLocal,
                    enterpriseCity : this.ruleForm.enterpriseCity,
                    enterpriseBusiness :this.srcUrl,
                    enterpriseCode : this.ruleForm.enterpriseCode,
                    enterpriseUser :this.ruleForm.enterpriseUser,
                },{
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
                  this.suc = false
              }else{
                this.$message({
                    type: 'error',
                    message: '申请失败！'
                });
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
    },
    ret(){
      this.$router.replace('/index')
    }
    }
}
</script>

<style scope>
.out-box{
    width: 1600px;
    height: 1000px;
}

.box-pcre{
    margin-top: 50px;
    margin-bottom: 50px;
    margin-left: 260px;
    width: 800px;
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
</style>
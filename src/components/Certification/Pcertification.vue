<template>
    <div class="out-box">
        <div>
            <el-card class="box-pcre">
                <div slot="header" >
                <span style="font-weight:800">个人实名认证</span>
                <p>证件类型：身份证</p>
                </div>
            <div>
               
               <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="真实姓名：" prop="realName">
                    <el-input type="text" v-model="ruleForm.realName" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idCard">
                    <el-input type="text" v-model="ruleForm.idCard" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="loadup">提交</el-button>
                </el-form-item>
                </el-form>

            
            </div>
            </el-card>
        </div>
        
    </div>
</template>

<script>
export default {
    data() {
        var realName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入真实姓名'));
        }else if(!this.isrealName(value)){
            callback(new Error('请输入真实姓名！'));
        } 
        else {
          
          callback();
        }
      };
      var idCard = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入正确的身份证号码'));
        } else if(!this.isIdCard(value)){
            callback(new Error('请输入正确的身份证号码'));
        }  else {
          callback();
        }
      };
        return {
            ruleForm: {
          realName: '',
          idCard: '',
        },
            rules: {
          realName: [
            { validator: realName, trigger: 'blur' }
          ],
          idCard: [
            { validator: idCard, trigger: 'blur' }
          ],
        }
        }
    },
    methods: {
        isrealName(val) {
        if (!/^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\\s]{1,20})$/.test(val)) {
          return false;
        } else {
          return true;
        }
      },
      isIdCard(val) {
        if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val)) {
          return false;
        } else {
          return true;
        }
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
    }
    }
}
</script>

<style scope>
.out-box{
    width: 1600px;
    height: 700px;
}

.box-pcre{
    margin-top: 50px;
    margin-left: 260px;
    width: 800px;
}
</style>
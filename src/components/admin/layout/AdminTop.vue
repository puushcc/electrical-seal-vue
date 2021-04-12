<template>
    <div>
        
        <el-row>
            <el-col :span="23"><div class="grid-content bg-purple">
                <el-button class="top" icon="el-icon-s-fold" v-on:click="isC"></el-button>
                </div></el-col>
                <el-col :span="1"><div class="grid-content bg-purple-light">
                <el-dropdown @command="handleCommand">
                <el-image :size="30" class="el-dropdown-link" :fit="cover" :src="circleUrl" style="width: 40px; height: 40px;border-radius: 50%;margin-top:10px">
                </el-image>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item >{{account}}</el-dropdown-item>
                    <el-dropdown-item command="a">安全退出</el-dropdown-item>
                </el-dropdown-menu>
                </el-dropdown>
                </div></el-col>
        </el-row>

    </div>
</template>

<script>
import Utils from '../../../assets/util';
  export default {
    data() {
        return {
            circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
            account: '',
        }
    },
    mounted: function() {
        Utils.$on('demo', (msg) => {
          console.log(msg);
          this.loaddata();
      })
        this.loaddata()
    },
    methods: {
         handleCommand(command) {
        if(command == 'a'){
           //退出登录
            this.$store.commit('SET_ACCOUNT','')
            this.$message({
              message: '退出登录',
              type: 'success'
            });
            this.$router.replace('/admin')
        }
      },
    isC(){
        this.$store.commit('SET_ISCOLLAPSE',!this.$store.getters.getIsCollapse)
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
                  _this.account =  resp.data.data.account
                if(resp.data.data.image != null){
                
                _this.circleUrl = resp.data.data.image
                }
              }else{
                  _this.account =  resp.data.data.account
                 if(resp.data.data.image != null){
                  _this.circleUrl = resp.data.data.image
                }
              }
            }else{
              this.$message.error('登录信息过期')
            }
          })
      }
    }
    },
  }
</script>

<style>
    .top{
        float: left;
        margin: 10px;
    }
    .coll{
    font-size: 20px;
    margin: 20px;
    }
    .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>
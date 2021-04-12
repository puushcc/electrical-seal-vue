<template>
    <el-menu
      :default-active="$route.path"
      router
      background-color=" #FFFFFF"
      text-color="#222"
      active-text-color="red"
      :collapse="this.$store.getters.getIsCollapse"
      class="el-menu-vertical-demo"
      >

        <el-menu-item :key="0-1" :index="'/index'" @click="refure()">
        <i class="el-icon-location"></i>
        <span slot="title" >首页</span>
        </el-menu-item>

      <el-submenu index="1">
        <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">签约</span>
        </template>
        <el-menu-item-group>
            <el-menu-item :key="1-1" :index="'/contract'" @click="refure()">
                合同中心
            </el-menu-item>
        </el-menu-item-group>
      </el-submenu>

      <el-submenu index="">
        <template slot="title">
        <i class="el-icon-location"></i>
        <span slot="title">管理</span>
        </template>
        <el-menu-item-group>
            <el-menu-item :key="2-1" :index="'/personalCenter'" @click="refure()" >
                个人中心
            </el-menu-item>
            <el-menu-item v-show="disableV" :key="2-2" :index="'/sealCenter'" @click="refure()" >
                印章管理
            </el-menu-item>
        </el-menu-item-group>
      </el-submenu>


    </el-menu>
    
</template>

<script>
import Utils from '../../assets/util.js';
  export default {
    name: 'NavMenu',
    data () {
        return {
            isCollapse: '',
            disableV: false,
        }
      },
    mounted: function () {
        this.$store.commit('SET_ISCOLLAPSE',false)
        this.loaddata()
    },
    methods: {
      refure(){
        Utils.$emit('demo','msg');
      },
     loaddata(){
        var _this = this;
      if(this.$store.getters.getAccount == ''){
        this.$router.replace('/')
      }else{
          this.$axios.get('/enterprise/checkByUser',{
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              console.log(resp)
              if(resp.data.code == 200){
                _this.disableV = true
              }else{
                if(resp.data.data.enterpriseStats == 0){
                  _this.disableV = false 
                }else{
                  _this.disableV = false
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

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
  }
</style>
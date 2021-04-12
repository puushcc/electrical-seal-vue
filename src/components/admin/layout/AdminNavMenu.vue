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

        <el-menu-item :key="0-1" :index="'/adminindex'" @click="refure()">
        <i class="el-icon-user"></i>
        <span slot="title" >用户管理</span>
        </el-menu-item>
        <el-menu-item :key="0-1" :index="'/adminecert'" @click="refure()">
        <i class="el-icon-s-shop"></i>
        <span slot="title" >企业管理</span>
        </el-menu-item>
        

    </el-menu>
    
</template>

<script>
import Utils from '../../../assets/util.js';
  export default {
    name: 'NavMenu',
    data () {
        return {
            isCollapse: '',
        }
      },
    mounted: function () {
        this.$store.commit('SET_ISCOLLAPSE',false)
        
    },
    methods: {
      refure(){
        Utils.$emit('demo','msg');
      },
     

    },
  }
</script>

<style scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 250px;
  }
</style>
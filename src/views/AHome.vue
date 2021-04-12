<template>
  <div>
    <el-container>
        <el-header><top></top></el-header>
        <el-container class="con">
            <nav-menu></nav-menu>
            <router-view/>
        </el-container>
    </el-container>
  </div>
</template>


<script>
import NavMenu from '../components/admin/layout/AdminNavMenu'
import Top from '../components/admin/layout/AdminTop'
export default {

    name: 'Home',
    components: {NavMenu,Top},
    mounted(){
        console.log(this.$store.getters.getAccount)
    }
}
</script>

<style scoped>
.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
  .con{
      background-color: #E9EEF3;
  }
</style>
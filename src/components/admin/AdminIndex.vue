<template>
    <div class="box-user">
        <el-table
    :data="tableData"
    border=""
    style="width: 100%; margin-top:10px">
    <el-table-column
      prop="account"
      label="账号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="username"
      label="昵称"
      width="100">
    </el-table-column>
    <el-table-column
      prop="mail"
      label="邮箱"
      width="180">
    </el-table-column>
    <el-table-column
      prop="idcard"
      label="身份证"
      width="180">
    </el-table-column>
    <el-table-column
      prop="realname"
      label="真实姓名"
      width="180">
    </el-table-column>
    <el-table-column
      prop="creattime"
      label="注册时间"
      width="180">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="180">
    </el-table-column>
    <el-table-column
      prop="role"
      label="角色"
      width="100">
      
    </el-table-column>
    <el-table-column
      
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
          
        <el-button
          v-if="scope.row.status == '正常'"
          type="danger"
          size="small"
          @click.native="handlesta(scope.row)">
          禁用
        </el-button>
        <el-button
          v-if="scope.row.status == '禁用中'"
          type="success"
          size="small"
          @click.native="handlesta(scope.row)"
          >
          启用
        </el-button>
      </template>
    </el-table-column>
  </el-table>
    </div>
</template>

<script>
export default {
    data() {
      return {
        tableData: '',
      }
    },
    mounted: function() {
         this.loaddata()
    },
    methods: {
        loaddata(){
        var _this = this;
        if(this.$store.getters.getAccount == ''){
        this.$router.replace('/')
      }else{
        //通过token获取是否用户信息
      this.$axios.get('/admin/getuser',{
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
                _this.tableData = resp.data.data
              }else{
                 this.$message.error('获取失败')
              }
            }else{
              this.$message.error('登录信息过期')
            }
          })
      }

        },
        handlesta(row){
        this.$confirm('确认操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          console.log(row)
          
          this.$axios.post('/admin/upStates',{
              account: row.account,
              status: row.status,
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
                
                this.$message.success('操作成功')
                this.loaddata()
              }else{
                 this.$message.error('操作失败')
              }
            }else{
              this.$message.error('登录信息过期')
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
        }
    },
}
</script>

<style scoped>
.box-user{
    margin: 10px;
    width: 1800px;
    height: 1000px;
    padding: 10px;
}
</style>
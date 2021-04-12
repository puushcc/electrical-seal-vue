<template>
    <div class="box-user">
         <el-table
         border=""
    :data="tableData"
    style="width: 100%; margin-top:10px">
    <el-table-column
      prop="account"
      label="用户"
      width="120">
    </el-table-column>
    <el-table-column
      prop="ename"
      label="企业名称"
      width="100">
    </el-table-column>
    <el-table-column
      prop="eindustry"
      label="服务行业"
      width="180">
    </el-table-column>
    <el-table-column
      prop="elocal"
      label="企业注册地"
      width="100">
    </el-table-column>
    <el-table-column
      prop="ecity"
      label="所在地区"
      width="100">
    </el-table-column>
    <el-table-column
      
      label="营业执照"
      width="100">
      <template slot-scope="scope">
        <el-button
          type="text"
          size="small"
          @click.native="handlebus(scope.row.ebusiness)">
          查看
        </el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="ecode"
      label="统一社会信用代码"
      width="180">
    </el-table-column>
    <el-table-column
      prop="euser"
      label="法定代表人"
      width="100">
    </el-table-column>
    <el-table-column
      prop="estats"
      label="状态"
      width="100">
      <template slot-scope="scope">
        
            <i v-if="scope.row.estats == '1'" class="el-icon-success" style="color:green">审核通过</i>
            <i v-if="scope.row.estats == '2'" class="el-icon-error"  style="color:red">审核失败</i>
            <i v-if="scope.row.estats == '0'" class="el-icon-remove"  style="color:#f26522">审核中</i>
      </template>  
    </el-table-column>
    <el-table-column
      
      fixed="right"
      label="操作"
      >
      <template slot-scope="scope">
        <el-button
        v-if="scope.row.estats == '0'"
          type="success"
          size="small"
          @click.native="handlesu(scope.row)">
          通过
        </el-button>
        <el-button
        v-if="scope.row.estats == '0'"
          type="danger"
          size="small"
          @click.native="handlefa(scope.row)"
          >
          不通过
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog title="营业执照" :visible.sync="dialogFormVisible">
      <el-image
      style="width: 500px; height: 500px"
      :src="bussrc"
      :fit="fit"></el-image>
  </el-dialog>
    </div>
</template>

<script>
export default {
   data() {
       return {
        dialogFormVisible: false,
        tableData: '',
        bussrc: '',
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
      this.$axios.get('/admin/getentri',{
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
        handlebus(ebusiness){
            this.bussrc = ebusiness
            this.dialogFormVisible = true
        },
        handlesu(row){
            this.$confirm('确认操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          console.log(row)
          
          this.$axios.post('/admin/review',{
              account: row.account,
              review: 'true'
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
        },
        handlefa(row){
            this.$confirm('确认操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center: true
        }).then(() => {
          console.log(row)
          
          this.$axios.post('/admin/review',{
              account: row.account,
              review: 'false'
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
<template>
<div class="wapper-out">
    <div class="head-box">
        <el-button type="primary" round style="margin-top:4px;margin-left:10px" @click="ondrawer()">发起合同</el-button>
        
    </div>
    <div class="main-box">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="全部">
                <el-row>
                <el-image
                v-show="showimg"
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                <el-col :span="24" v-for="o in consrc" :key="o">
                    
                    <el-card :body-style="{ padding: '0px' }" style="margin:10px" >
                    <div class= "card-head">
                      <div style="float:left">
                        <p >
                          <el-tooltip class="item" effect="dark" placement="right-start">
                            <p slot="content" >合同发起时间：{{o.contractCreatetime}}</p>
                          <el-button type="text" @click="readcon(o.contractId)"><h2>{{o.contractName}}</h2></el-button>
                          </el-tooltip>
                          
                          </p>
                          <p><span>签署方：{{o.contractReceiver}}</span>
                          <i v-if="o.contractStatus == '2'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待发起方处理</i>
                          <i v-if="o.contractStatus == '1'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待签署方处理</i>
                          <i v-if="o.contractStatus == '3'" style="margin-left:20px;color:#45b97c" class="el-icon-remove-outline">已完成</i>
                          <i v-if="o.contractStatus == '4'" style="margin-left:20px;color:#ed1941" class="el-icon-remove-outline">已失效</i>
                          </p>
                      </div >
                        <div class= "card-right">
                          <span style="margin-left:70px">
                          <el-button v-if="(o.contractStatus == '1' && o.contractReceiver == account) 
                          || (o.contractStatus == '2' && o.contractSponsor == account)" type="text" @click="addcon(o.contractId)">签署</el-button>
                          <el-button v-if="o.contractStatus == '3'|| o.contractStatus == '4' || (o.contractStatus == '1' && o.contractReceiver != account) 
                          || (o.contractStatus == '2' && o.contractSponsor != account) " type="text" @click="readcon(o.contractId)">详情</el-button>
                          <el-divider  direction="vertical"></el-divider>
                          <el-button type="text">下载</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button type="text">打印</el-button>
                          </span>
                          <p style="margin-right:20px"><span v-if="o.contractStatus == '3' " type="text">{{o.contractCompletetime}}完成</span>    
                          <span v-if="o.contractStatus == '1'|| o.contractStatus == '2' " type="text">请在{{o.contractDate}}前完成签署</span>
                          <span v-if="o.contractStatus == '4' " type="text">合同签署时间超时已失效</span>
                          <el-tooltip class="item" effect="dark" placement="top-start">
                            <p slot="content" >合同发起人：{{o.contractSponsor}}</p>
                            <i class="el-icon-position"></i>
                          </el-tooltip></p>
                        </div>
                    </div>  
                    </el-card>

                </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="待我处理" name="待我处理">
                <el-row>
                <el-image
                v-show="showimg"
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                <el-col :span="24" v-for="o in consrc" :key="o">
                    
                    <el-card v-if="(o.contractStatus == '1' && o.contractReceiver == account) 
                          || (o.contractStatus == '2' && o.contractSponsor == account)" :body-style="{ padding: '0px' }" style="margin:10px" >
                    <div class= "card-head">
                      <div style="float:left">
                        <p >
                          <el-tooltip class="item" effect="dark" placement="right-start">
                            <p slot="content" >合同发起时间：{{o.contractCreatetime}}</p>
                          <el-button type="text" @click="readcon(o.contractId)"><h2>{{o.contractName}}</h2></el-button>
                          </el-tooltip>
                          
                          </p>
                          <p><span>签署方：{{o.contractReceiver}}</span>
                          <i v-if="o.contractStatus == '2'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待发起方处理</i>
                          <i v-if="o.contractStatus == '1'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待签署方处理</i>
                          <i v-if="o.contractStatus == '3'" style="margin-left:20px;color:#45b97c" class="el-icon-remove-outline">已完成</i>
                          <i v-if="o.contractStatus == '4'" style="margin-left:20px;color:#ed1941" class="el-icon-remove-outline">已失效</i>
                          </p>
                      </div >
                        <div class= "card-right">
                          <span style="margin-left:70px">
                          <el-button v-if="(o.contractStatus == '1' && o.contractReceiver == account) 
                          || (o.contractStatus == '2' && o.contractSponsor == account)" type="text">签署</el-button>
                          <el-button v-if="o.contractStatus == '3'|| o.contractStatus == '4' || (o.contractStatus == '1' && o.contractReceiver != account) 
                          || (o.contractStatus == '2' && o.contractSponsor != account) " type="text" @click="readcon(o.contractId)">详情</el-button>
                          <el-divider  direction="vertical"></el-divider>
                          <el-button type="text">下载</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button type="text">打印</el-button>
                          </span>
                          <p style="margin-right:20px"><span v-if="o.contractStatus == '3' " type="text">{{o.contractCompletetime}}完成</span>    
                          <span v-if="o.contractStatus == '1'|| o.contractStatus == '2' " type="text">请在{{o.contractDate}}前完成签署</span>
                          <span v-if="o.contractStatus == '4' " type="text">合同签署时间超时已失效</span>
                          <el-tooltip class="item" effect="dark" placement="top-start">
                            <p slot="content" >合同发起人：{{o.contractSponsor}}</p>
                            <i class="el-icon-position"></i>
                          </el-tooltip></p>
                        </div>
                    </div>  
                    </el-card>

                </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="待他人处理" name="待他人处理">
                <el-row>
                <el-image
                v-show="showimg"
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                <el-col :span="24" v-for="o in consrc" :key="o">
                    
                    <el-card v-if="(o.contractStatus == '1' && o.contractReceiver != account) 
                          || (o.contractStatus == '2' && o.contractSponsor != account)" :body-style="{ padding: '0px' }" style="margin:10px" >
                    <div class= "card-head">
                      <div style="float:left">
                        <p >
                          <el-tooltip class="item" effect="dark" placement="right-start">
                            <p slot="content" >合同发起时间：{{o.contractCreatetime}}</p>
                          <el-button type="text" @click="readcon(o.contractId)"><h2>{{o.contractName}}</h2></el-button>
                          </el-tooltip>
                          
                          </p>
                          <p><span>签署方：{{o.contractReceiver}}</span>
                          <i v-if="o.contractStatus == '2'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待发起方处理</i>
                          <i v-if="o.contractStatus == '1'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待签署方处理</i>
                          <i v-if="o.contractStatus == '3'" style="margin-left:20px;color:#45b97c" class="el-icon-remove-outline">已完成</i>
                          <i v-if="o.contractStatus == '4'" style="margin-left:20px;color:#ed1941" class="el-icon-remove-outline">已失效</i>
                          </p>
                      </div >
                        <div class= "card-right">
                          <span style="margin-left:70px">
                          <el-button v-if="(o.contractStatus == '1' && o.contractReceiver == account) 
                          || (o.contractStatus == '2' && o.contractSponsor == account)" type="text">签署</el-button>
                          <el-button v-if="o.contractStatus == '3'|| o.contractStatus == '4' || (o.contractStatus == '1' && o.contractReceiver != account) 
                          || (o.contractStatus == '2' && o.contractSponsor != account) " type="text" @click="readcon(o.contractId)">详情</el-button>
                          <el-divider  direction="vertical"></el-divider>
                          <el-button type="text">下载</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button type="text">打印</el-button>
                          </span>
                          <p style="margin-right:20px"><span v-if="o.contractStatus == '3' " type="text">{{o.contractCompletetime}}完成</span>    
                          <span v-if="o.contractStatus == '1'|| o.contractStatus == '2' " type="text">请在{{o.contractDate}}前完成签署</span>
                          <span v-if="o.contractStatus == '4' " type="text">合同签署时间超时已失效</span>
                          <el-tooltip class="item" effect="dark" placement="top-start">
                            <p slot="content" >合同发起人：{{o.contractSponsor}}</p>
                            <i class="el-icon-position"></i>
                          </el-tooltip></p>
                        </div>
                    </div>  
                    </el-card>

                </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="未完成" name="未完成">
                <el-row>
                <el-image
                v-show="showimg"
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                <el-col :span="24" v-for="o in consrc" :key="o">
                    
                    <el-card v-if="o.contractStatus == '1' || o.contractStatus == '2'" :body-style="{ padding: '0px' }" style="margin:10px" >
                    <div class= "card-head">
                      <div style="float:left">
                        <p >
                          <el-tooltip class="item" effect="dark" placement="right-start">
                            <p slot="content" >合同发起时间：{{o.contractCreatetime}}</p>
                          <el-button type="text" @click="readcon(o.contractId)"><h2>{{o.contractName}}</h2></el-button>
                          </el-tooltip>
                          
                          </p>
                          <p><span>签署方：{{o.contractReceiver}}</span>
                          <i v-if="o.contractStatus == '2'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待发起方处理</i>
                          <i v-if="o.contractStatus == '1'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待签署方处理</i>
                          <i v-if="o.contractStatus == '3'" style="margin-left:20px;color:#45b97c" class="el-icon-remove-outline">已完成</i>
                          <i v-if="o.contractStatus == '4'" style="margin-left:20px;color:#ed1941" class="el-icon-remove-outline">已失效</i>
                          </p>
                      </div >
                        <div class= "card-right">
                          <span style="margin-left:70px">
                          <el-button v-if="(o.contractStatus == '1' && o.contractReceiver == account) 
                          || (o.contractStatus == '2' && o.contractSponsor == account)" type="text">签署</el-button>
                          <el-button v-if="o.contractStatus == '3'|| o.contractStatus == '4' || (o.contractStatus == '1' && o.contractReceiver != account) 
                          || (o.contractStatus == '2' && o.contractSponsor != account) " type="text" @click="readcon(o.contractId)">详情</el-button>
                          <el-divider  direction="vertical"></el-divider>
                          <el-button type="text">下载</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button type="text">打印</el-button>
                          </span>
                          <p style="margin-right:20px"><span v-if="o.contractStatus == '3' " type="text">{{o.contractCompletetime}}完成</span>    
                          <span v-if="o.contractStatus == '1'|| o.contractStatus == '2' " type="text">请在{{o.contractDate}}前完成签署</span>
                          <span v-if="o.contractStatus == '4' " type="text">合同签署时间超时已失效</span>
                          <el-tooltip class="item" effect="dark" placement="top-start">
                            <p slot="content" >合同发起人：{{o.contractSponsor}}</p>
                            <i class="el-icon-position"></i>
                          </el-tooltip></p>
                        </div>
                    </div>  
                    </el-card>

                </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="已完成" name="已完成">
                <el-row>
                <el-image
                v-show="showimg"
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                <el-col :span="24" v-for="o in consrc" :key="o">
                    
                    <el-card v-if="o.contractStatus == '3'" :body-style="{ padding: '0px' }" style="margin:10px" >
                    <div class= "card-head">
                      <div style="float:left">
                        <p >
                          <el-tooltip class="item" effect="dark" placement="right-start">
                            <p slot="content" >合同发起时间：{{o.contractCreatetime}}</p>
                          <el-button type="text" @click="readcon(o.contractId)"><h2>{{o.contractName}}</h2></el-button>
                          </el-tooltip>
                          
                          </p>
                          <p><span>签署方：{{o.contractReceiver}}</span>
                          <i v-if="o.contractStatus == '2'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待发起方处理</i>
                          <i v-if="o.contractStatus == '1'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待签署方处理</i>
                          <i v-if="o.contractStatus == '3'" style="margin-left:20px;color:#45b97c" class="el-icon-remove-outline">已完成</i>
                          <i v-if="o.contractStatus == '4'" style="margin-left:20px;color:#ed1941" class="el-icon-remove-outline">已失效</i>
                          </p>
                      </div >
                        <div class= "card-right">
                          <span style="margin-left:70px">
                          <el-button v-if="(o.contractStatus == '1' && o.contractReceiver == account) 
                          || (o.contractStatus == '2' && o.contractSponsor == account)" type="text">签署</el-button>
                          <el-button v-if="o.contractStatus == '3'|| o.contractStatus == '4' || (o.contractStatus == '1' && o.contractReceiver != account) 
                          || (o.contractStatus == '2' && o.contractSponsor != account) " type="text" @click="readcon(o.contractId)">详情</el-button>
                          <el-divider  direction="vertical"></el-divider>
                          <el-button type="text">下载</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button type="text">打印</el-button>
                          </span>
                          <p style="margin-right:20px"><span v-if="o.contractStatus == '3' " type="text">{{o.contractCompletetime}}完成签署</span>    
                          <span v-if="o.contractStatus == '1'|| o.contractStatus == '2' " type="text">请在{{o.contractDate}}前完成签署</span>
                          <span v-if="o.contractStatus == '4' " type="text">合同签署时间超时已失效</span>
                          <el-tooltip class="item" effect="dark" placement="top-start">
                            <p slot="content" >合同发起人：{{o.contractSponsor}}</p>
                            <i class="el-icon-position"></i>
                          </el-tooltip></p>
                        </div>
                    </div>  
                    </el-card>

                </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="已失效" name="已失效">
                <el-row>
                <el-image
                v-show="showimg"
                class="imgs"
                :src="url"
                :fit="fit"></el-image>
                <el-col :span="24" v-for="o in consrc" :key="o">
                    
                    <el-card v-if="o.contractStatus == '4'" :body-style="{ padding: '0px' }" style="margin:10px" >
                    <div class= "card-head">
                      <div style="float:left">
                        <p >
                          <el-tooltip class="item" effect="dark" placement="right-start">
                            <p slot="content" >合同发起时间：{{o.contractCreatetime}}</p>
                          <el-button type="text" @click="readcon(o.contractId)"><h2>{{o.contractName}}</h2></el-button>
                          </el-tooltip>
                          
                          </p>
                          <p><span>签署方：{{o.contractReceiver}}</span>
                          <i v-if="o.contractStatus == '2'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待发起方处理</i>
                          <i v-if="o.contractStatus == '1'" style="margin-left:20px;color:#f47920" class="el-icon-remove-outline">待签署方处理</i>
                          <i v-if="o.contractStatus == '3'" style="margin-left:20px;color:#45b97c" class="el-icon-remove-outline">已完成</i>
                          <i v-if="o.contractStatus == '4'" style="margin-left:20px;color:#ed1941" class="el-icon-remove-outline">已失效</i>
                          </p>
                      </div >
                        <div class= "card-right">
                          <span style="margin-left:70px">
                          <el-button v-if="(o.contractStatus == '1' && o.contractReceiver == account) 
                          || (o.contractStatus == '2' && o.contractSponsor == account)" type="text">签署</el-button>
                          <el-button v-if="o.contractStatus == '3'|| o.contractStatus == '4' || (o.contractStatus == '1' && o.contractReceiver != account) 
                          || (o.contractStatus == '2' && o.contractSponsor != account) " type="text" @click="readcon(o.contractId)">详情</el-button>
                          <el-divider  direction="vertical"></el-divider>
                          <el-button type="text">下载</el-button>
                          <el-divider direction="vertical"></el-divider>
                          <el-button type="text">打印</el-button>
                          </span>
                          <p style="margin-right:20px"><span v-if="o.contractStatus == '3' " type="text">{{o.contractCompletetime}}完成签署</span>    
                          <span v-if="o.contractStatus == '1'|| o.contractStatus == '2' " type="text">请在{{o.contractDate}}前完成签署</span>
                          <span v-if="o.contractStatus == '4' " type="text">合同签署时间超时已失效</span>
                          <el-tooltip class="item" effect="dark" placement="top-start">
                            <p slot="content" >合同发起人：{{o.contractSponsor}}</p>
                            <i class="el-icon-position"></i>
                          </el-tooltip></p>
                        </div>
                    </div>  
                    </el-card>

                </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
    <el-drawer
        title="发起合同"
        :visible.sync="drawer"
        :direction="rtl"
        >
        <el-card class="box-card-c">
        
        <el-form :model="ruleForm" status-icon label-width="100px">
        <el-form-item label="合同主题：" >
            <el-input type="text" v-model="ruleForm.contractName" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="文件：" >

            <el-upload
            class="upload-demo"
            action="http://localhost:8000/seal/fileLoad/upload"
            :headers="myHeaders"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleAvatarSuccess"
            multiple
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="fileList"
            accept=".pdf"
            :before-upload="beforeUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传pdf文件</div>
            </el-upload>

        </el-form-item>
        <el-form-item label="接收方：" >
            <el-input type="text" v-model="ruleForm.contractReceiver" autocomplete="off" placeholder="请输入" style="width:300px">
                <template slot="prepend">+86</template>
            </el-input>
        </el-form-item>
        <el-form-item label="签署有效期：" >
            <el-date-picker
            v-model="ruleForm.contractDate"
            align="right"
            type="date"
            placeholder="选择日期"
            style="width:180px">
            </el-date-picker>
            需在此日期前完成签署
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="send()">发起合同</el-button>
        </el-form-item>
        </el-form>
        </el-card>
        </el-drawer>
</div>
    
</template>

<script>
export default {
    data() {
        var token =  this.$store.getters.getAccount
      return {
        url: 'https://demo-1304423007.cos.ap-guangzhou.myqcloud.com/electric/staic/pic_data_no.89e8bad5.png',
            showimg: true,
            Complete: true,
           myHeaders: {Authorization: token},
          fileList: '',
        pdfUrl: '',
        account: '',
        drawer: false,
        activeName: '全部',
        ruleForm: {
          contractName: '',
          contractReceiver: '',
        contractDate: '',
        consrc: '',
        },
      };
    },
    mounted() {
      this.loaddata()
    },
    methods: {
      loaddata(){
        var _this = this
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
                //已经实名
                _this.account = resp.data.data.account
              }else{
                _this.account = resp.data.data.account
              }
               _this.account = resp.data.data.account
               console.log(resp.data.data.account)
            }else{
              this.$message.error('登录信息过期')
            }
          })
          if(this.$store.getters.getAccount == ''){
        this.$router.replace('/')
      }else{
      this.$axios.get('/contract/getContract',{
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
                _this.consrc = resp.data.data
                console.log(resp.data.data)
                if(resp.data.data.length>0){
                  _this.showimg = false
                }
                
              }else{
                this.$message.error('获取失败')
              }
            }else{
              this.$message.error('登录信息过期')
            }
          })
      }
      },
        beforeUpload(file) {
            console.log(file)
            var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
            const extension = testmsg === 'pdf'
            
            // const isLt2M = file.size / 1024 / 1024 < 10
            if(!extension ) {
                this.$message({
                    message: '上传文件只能是 xls、xlsx格式!',
                    type: 'warning'
                });
            }
            // if(!isLt2M) {
            //     this.$message({
            //         message: '上传文件大小不能超过 10MB!',
            //         type: 'warning'
            //     });
            // }
            // return (extension || extension2) && isLt2M
            return extension 
        },
        handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      beforeAvatarUpload(file) {
        console.log(file)
        var testmsg=file.name.substring(file.name.lastIndexOf('.')+1)
        const extension = testmsg === 'pdf'
         const isLt2M = file.size / 1024 / 1024 < 10
        if(!extension) {
            this.$message({
                message: '上传文件只能是 pdf格式!',
                type: 'warning'
            });
        }
        if(!isLt2M) {
            this.$message({
                message: '上传文件大小不能超过 10MB!',
                type: 'warning'
            });
        }
        // return (extension || extension2) && isLt2M
        return extension 
      },
       handleAvatarSuccess(res, file) {
        this.pdfUrl=res.data
        console.log(file)
      },
      send(){
          if(this.$store.getters.getAccount == ''){
                this.$router.replace('/')
            }else{
                this.$axios.post('/contract/sendContract',{
                    contractName: this.ruleForm.contractName,
                    contractFile: this.pdfUrl,
                    contractReceiver: this.ruleForm.contractReceiver,
                    contractDate: this.ruleForm.contractDate,
                },{
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
                 this.$message.success('发起合同成功')
                 this.loaddata()
                 this.drawer = false
              }else{
                  this.$message.error('发起合同失败')
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
        }
      },
      ondrawer(){
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
                //已经实名
                this.drawer = true
              }else{
                //未实名
                this.$message.warning('请先进行实名认证')
              }
            }else{
              this.$message.error('登录信息过期')
            }
          })
      }
      },
      readcon(id){
        this.$router.push({
          path:'/rederContract',
          query:{
            Id:id
          }
        })
      },
      addcon(id){
        this.$router.push({
          path:'/addContract',
          query:{
            Id:id
          }
        })
      },
    }
  };
</script>

<style scope>
.wapper-out{
  width: 1600px;
  height: 1000px;
  padding: 3px;
}
.head-box {
height: 50px;
background-color: rgb(255, 255, 255);
}
.main-box {
background-color: rgb(255, 255, 255);
padding-left: 20px;
}
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
.imgs{
    margin: 130px;
}
  .box-card-c {
    width: 480px;
  }
  .card-head{
    margin-left: 10px;
  }
.card-right{
  float: right;
  margin-top: 40px;
  width: 250px;
}
</style>
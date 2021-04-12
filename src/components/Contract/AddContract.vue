<template>
    <div class="wapper-out">
        <div class="wapper-page">

        <el-page-header @back="goBack">
            <span slot="content">{{contract.contractName}}</span>
            
        </el-page-header>

        </div>
        
        <div class="left-box">
            <el-button type="primary" @click="showseal()">选择印章</el-button>
            <el-button type="primary" @click="showsign()">选择签名</el-button>
            <el-col v-show="toshowseal" :span="18" v-for="o in sginsrc" :key="o" >
                    
                    <el-card :body-style="{ padding: '0px' }" style="margin:10px" >
                        <img :src="o.sealUrl" class="image-se">
                        <div style="padding: 0px;">
                        <div class="bottom clearfix">
                            <p  class="text2">{{o.sealName}}</p>
                            <el-button type="text2" class="button" @click="onseal(o.sealUrl)">点击盖章</el-button>
                        </div>
                        </div>
                    </el-card>
            </el-col>
            <el-col v-show="toshowsign" :span="18" v-for="o in sginsrc" :key="o" >
                    
                    <el-card :body-style="{ padding: '0px' }" style="margin:10px" >
                        <img :src="o.signUrl" class="image-sign">
                        <div style="padding: 0px;">
                        <div class="bottom clearfix">
                            <el-button type="text2" class="button" @click="onsign(o.signUrl)">点击签名</el-button>
                        </div>
                        </div>
                    </el-card>
            </el-col>

        </div>

        <div class="center-box">
            <div v-show="owseal" v-drag="{set:set}" class="drag" ><img :src="sealUrl" class="image-seal"></div>
            <div v-show="owsign" v-dragsign="{setsign:setsign}" class="dragsign" ><img :src="signUrl" class="image-sign"></div>
            <canvas id="the-canvas"  />
        <div>
            <el-button size="small" @click="prevPage">Previous</el-button>
            <el-button size="small" @click="nextPage">Next</el-button>
            &nbsp; &nbsp;
            <span>Page: {{ pageNum }} / <span id="page_count"></span></span>
            <el-button style="float:right" type="primary" @click="onContract()">确定签署</el-button>
        </div>
        </div>
    </div>
</template>


<script>
const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = "https://demo-1304423007.cos.ap-guangzhou.myqcloud.com/images/pdf.worker.js";
export default {
    directives: {
    drag(el,binding) {
      el.onmousedown = function(e) {
        var disx = e.pageX - el.offsetLeft
        var disy = e.pageY - el.offsetTop
        //var x= e.clientX;
        //var y= e.clientY;
        //console.log(x,y);
        
        document.onmousemove = function (e) {
          var canvas = document.getElementById('the-canvas');
          var width = canvas.width;
          var height = canvas.height;
          
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
          if(parseInt(el.style.left) < 470 ){
            el.style.left = 470 + 'px'
          }
          if(parseInt(el.style.left) >  parseInt( 350 + width)){
            el.style.left =  parseInt(350 +width) + 'px'
          }
          if(parseInt(el.style.top) < 130){
            el.style.top = 130  + 'px'
          }
          if(parseInt(el.style.top) > parseInt(10 + height)){
            el.style.top = parseInt(10 +height) + 'px'
          }
        }
        document.onmouseup = function() {
          
          document.onmousemove = document.onmouseup = null
          binding.value.set(el.style.left,el.style.top)
          
          
        }
      }
    },
    dragsign(el,binding) {
      el.onmousedown = function(e) {
        var disx = e.pageX - el.offsetLeft
        var disy = e.pageY - el.offsetTop
        //var x= e.clientX;
        //var y= e.clientY;
        //console.log(x,y);
        
        document.onmousemove = function (e) {
          var canvas = document.getElementById('the-canvas');
          var width = canvas.width;
          var height = canvas.height;
          
          el.style.left = e.pageX - disx + 'px'
          el.style.top = e.pageY - disy + 'px'
          if(parseInt(el.style.left) < 470 ){
            el.style.left = 470 + 'px'
          }
          if(parseInt(el.style.left) >  parseInt( 350 + width)){
            el.style.left =  parseInt(350 +width) + 'px'
          }
          if(parseInt(el.style.top) < 130){
            el.style.top = 130  + 'px'
          }
          if(parseInt(el.style.top) > parseInt(82 + height)){
            el.style.top = parseInt(82 +height) + 'px'
          }
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
          binding.value.setsign(el.style.left,el.style.top)
        }
      }
    },
  },
    mounted() {
        this.loaddata()
        
    },
    props: {
    scale: {
      type: Number,
      default: 1.0,
    },
  },
    methods: {
      set(x,y){
      this.sealwidth=x;
      this.sealheight=y;
      },
      setsign(x,y){
      this.signwidth=x;
      this.signheight=y;
      },
        loaddata(){
            var _this = this
            if(this.$store.getters.getAccount == ''){
        this.$router.replace('/')
      }else{
      this.$axios.post('/contract/getContractByid',{
        contractId: this.$route.query.Id
      },{
            headers: {
              'Authorization': this.$store.getters.getAccount ,
            }
          }).then(resp => {
            if (resp && resp.status === 200) {
              if(resp.data.code == 401){
                    this.$router.replace('/')
                    this.$message.error('登录信息过期')
              }else if(resp.data.code == 200){
                this.contract = resp.data.data
                console.log(this.contract.contractFile)
                _this.pdfUrl = this.contract.contractFile
                this.canvas = document.getElementById("the-canvas");
                this.ctx = this.canvas.getContext("2d");
                
                PDFJS.getDocument(this.pdfUrl).promise.then((pdfDoc_) => {
                this.pdfDoc = pdfDoc_;
                document.getElementById("page_count").textContent = this.pdfDoc.numPages;
                this.renderPage(this.pageNum).then((res) => {
                    console.log(res)
                    this.$emit("renderPdf", {
                    width: this.canvas.width,
                    height: this.canvas.height,
                    });
                });
                });
              }else{
                this.$message.error('获取失败')
              }
            }else{
              this.$message.error('登录信息过期')
            }
          })
      }
        },
        goBack() {
        this.$router.go(-1);//返回上一层
        },
        renderPage(num) {
      let _this = this;
      this.pageRendering = true;
      // Using promise to fetch the page
      return this.pdfDoc.getPage(num).then((page) => {
        let viewport = page.getViewport({ scale: _this.scale });
        _this.canvas.height = viewport.height;
        _this.canvas.width = viewport.width;
        _this.canheight = this.canvas.height;
        _this.canwidth  = this.canvas.width;
        
        // Render PDF page into canvas context
        let renderContext = {
          canvasContext: _this.ctx,
          viewport: viewport,
        };
        let renderTask = page.render(renderContext);

        // Wait for rendering to finish
        renderTask.promise.then(() => {
          _this.pageRendering = false;
          if (_this.pageNumPending !== null) {
            // New page rendering is pending
            this.renderPage(_this.pageNumPending);
            _this.pageNumPending = null;
          }
        });
      });
    },
    queueRenderPage(num) {
      if (this.pageRendering) {
        this.pageNumPending = num;
      } else {
        this.renderPage(num);
      }
    },
    prevPage() {
      if (this.pageNum <= 1) {
        return;
      }
      this.pageNum--;
      this.queueRenderPage(this.pageNum);
    },
    nextPage() {
      if (this.pageNum >= this.pdfDoc.numPages) {
        return;
      }
      this.pageNum++;
      this.queueRenderPage(this.pageNum);
    },
    showseal(){
        var _this = this;
        this.toshowseal = true
        this.toshowsign = false
            if(this.$store.getters.getAccount == ''){
                this.$router.replace('/')
            }else{
                this.$axios.get('/enterpriseSeal/selectEnterpriseSeal',{
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
                  if(resp.data.data == null){
                    _this.showimg = true
                  }else{
                    _this.showimg = false
                  }
                  
              }else{
                  this.$message.error('获取失败')
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
            }
    },
    showsign(){
        var _this = this;
        this.toshowseal = false
        this.toshowsign = true
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
              }else{
                  this.$message.error('获取个人签名失败')
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
    },
    onseal(url){
        this.sealUrl = url
        this.owseal = true
    },
    onsign(url){
        this.signUrl = url
        this.owsign = true
    },
    onContract(){
      this.$confirm('签署合同，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //签约接口
          this.$axios.post('/contract/onContract',{
            contractId: this.$route.query.Id,
            sealWidth: this.sealwidth,
            sealHeight: this.sealheight,
            signWidth: this.signwidth,
            signHeight: this.signheight,
            sealUrl: this.sealUrl,
            signUrl: this.signUrl,
            pageNum: this.pageNum,
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
                    message: '签约成功! ' 
                });
                //签约成功逻辑代码
                this.$router.replace('/contract')

              }else{
                  this.$message({
                    type: 'error',
                    message: '签约失败！'
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
            message: '已取消'
          });          
        });
    }
    },
    data() {
        return {
            contract: '',
            pdfUrl: '',
            pdfDoc: null,
            pageNum: 1,
            pageRendering: false,
            pageNumPending: null,
            canvas: null,
            ctx: null,
            canheight: '',
            canwidth: '',
            sginsrc: '',
            sealUrl: '',
            signUrl: '',
            owsign: false,
            owseal: false,
            toshowseal: false,
            toshowsign: false,
            sealwidth:'',
            sealheight: '',
            signwidth: '',
            signheight: '',
        }
    },
}
</script>

<style >
  .wapper-out{
  width: 1600px;
  height: 1700px;
  padding: 3px;
}
.wapper-page{
    padding: 20px;
    background-color: #fff;
}
.center-box{
    
    float: left;
    border:1px solid rgb(66, 32, 187)
}
.left-box{
    margin: 10px;
    background: rgb(255, 255, 255);
    width: 20%;
    height: 1300px;
    float: left;
    margin: auto;
}
.drag{
            width: 120px;
            height: 120px;
            position: absolute;
            top: 200;
            left: 200;
}
.dragsign{
            width: 120px;
            height: 48px;
            position: absolute;
            top: 200;
            left: 200;
}
.image-seal{
    width: 120px;
    height: 120px;
}
.image-sign{
  width: 120px;
  height: 48px;
}
.image-se{
  width: 150px;
    height: 150px;
    margin: 5px;
}
.button{
    margin-left: 40px;
}
.text2{
    text-align: center;
}
</style>
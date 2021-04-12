<template>
    <div class="wapper-out">
        <div class="wapper-page">

        <el-page-header @back="goBack">
            <span slot="content">{{contract.contractName}}</span>
        </el-page-header>

        </div>
        
        <div class="center">
            <canvas id="the-canvas" style="height:1300px" />
        <div>
            <el-button size="small" @click="prevPage">Previous</el-button>
            <el-button size="small" @click="nextPage">Next</el-button>
            &nbsp; &nbsp;
            <span>Page: {{ pageNum }} / <span id="page_count"></span></span>
        </div>
        </div>
    </div>
</template>


<script>
const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = "https://demo-1304423007.cos.ap-guangzhou.myqcloud.com/images/pdf.worker.js";
export default {
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
        }
    },
}
</script>

<style >
  .wapper-out{
  width: 1600px;
  height: 1600px;
  padding: 3px;
}
.wapper-page{
    padding: 20px;
    background-color: #fff;
}
.center{
    margin-top: 10px;
    margin-left: 200px;
    width:500px;
}
</style>
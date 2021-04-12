<template>
  <div>
    <div class="center">
  <div>
    <el-button size="small" @click="prevPage">Previous</el-button>
    <el-button size="small" @click="nextPage">Next</el-button>
    &nbsp; &nbsp;
    <span>Page: {{ pageNum }} / <span id="page_count"></span></span>
  </div>
  <canvas id="the-canvas" />
</div>
  </div>
</template>

<script>
const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = "https://demo-1304423007.cos.ap-guangzhou.myqcloud.com/images/pdf.worker.js";
export default {
  name: "pdfPreview",
  props: {
    pdfUrl: {
      type: String,
    },
    scale: {
      type: Number,
      default: 1.5,
    },
  },
  data() {
    return {
      pdfDoc: null,
      pageNum: 1,
      pageRendering: false,
      pageNumPending: null,
      canvas: null,
      ctx: null,
    };
  },
  methods: {
    renderPage(num) {
      let _this = this;
      this.pageRendering = true;
      // Using promise to fetch the page
      return this.pdfDoc.getPage(num).then((page) => {
        let viewport = page.getViewport({ scale: _this.scale });
        _this.canvas.height = viewport.height;
        _this.canvas.width = viewport.width;

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
  mounted() {
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
  },
};
</script>
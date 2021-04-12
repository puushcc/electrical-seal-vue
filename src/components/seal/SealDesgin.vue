<template>
  <div class="about">
    <div class="box">
    
    
    <div class="left-seal">
    <el-card shadow="hover">
        <div slot="header">
            <span>在线制作印章</span>
        </div>
        <div>
            <p>输入印章信息</p>
            <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px">
                <el-form-item label="印章名称：">
                    <el-input type="text" v-model="ruleForm.sealName" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item label="印章编号：">
                    <el-input type="text" v-model="ruleForm.sealNum" autocomplete="off" placeholder="请输入" style="width:300px"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="loadup">点击预览</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-card>
</div>

<div class="right-seal">
    <el-card shadow="hover" >
        <div class= "can-box">
            <p>印章预览</p>
            <canvas id="canvas" width="250" height="250" class= "can-box"></canvas>
           
        </div>
        <div class= "ar-box">
             <el-button type="primary" v-on:click="loadseal">生成印章</el-button>
        </div>
    </el-card>
</div>

</div>
</div>
</template>

<script>
export default {
  data() {
      return {
          ruleForm: {
          sealName: '',
          sealNum: '',
            },
          
      }
  },
  mounted: function () {
      this.createSeal('canvas','','')
    },
  methods:{
      loadup(){
        var c=document.getElementById("canvas");
        var cxt=document.getElementById("canvas").getContext("2d");
        cxt.clearRect(0,0,c.width,c.height); 
        this.createSeal('canvas',this.ruleForm.sealName,this.ruleForm.sealNum)
      },
      loadseal(){
          
            if(this.$store.getters.getAccount == ''){
                this.$router.replace('/')
            }else{
                this.$axios.post('/enterpriseSeal/addEnterpriseSeal',{
                    sealUrl: document.getElementById('canvas').toDataURL("image/png"),
                    sealName:this.ruleForm.sealName,
                    sealNum:this.ruleForm.sealNum,
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
                  //成功
                this.$router.replace('/sealCenter')
                this.$message({
                    type: 'success',
                    message: '印章制作成功! ' 
                });
              }else{
                 //失败
                this.$message({
                    type: 'error',
                    message: '印章制作失败! ' 
                });
              }
            }else{
              this.$message.error('登录信息过期')
              this.$router.replace('/')
            }
          })
            }
      },
createSeal(id,company,name){

var canvas = document.getElementById(id);  
var context = canvas.getContext('2d');

// 绘制印章边框   
var width=canvas.width/2;
var height=canvas.height/2;
context.lineWidth=7;
context.strokeStyle="#f00";
context.beginPath();
context.arc(width,height,110,0,Math.PI*2);
context.stroke();
//画五角
create5star(context,width,height,30,"#f00",0);
// 绘制印章名称   
context.font = '15px Helvetica';
context.textBaseline = 'middle';//设置文本的垂直对齐方式
context.textAlign = 'center'; //设置文本的水平对对齐方式
context.lineWidth=1;
context.fillStyle = '#f00';
// var x = width
// var y = height+80 
// context.fillText(name,x,y);

var smccircle = {x: 125,
                  y: 125,
                  radius: 90}
drawCircularText(smccircle,name, rads(38), rads(137),'center');
drawCircularText(smccircle,company, rads(173), rads(365),'center');
//转换弧度
    function rads(x){
        return Math.PI*x/180;
    }


//绘制五角星  
/** 
 * 创建一个五角星形状. 该五角星的中心坐标为(sx,sy),中心到顶点的距离为radius,rotate=0时一个顶点在对称轴上 
 * rotate:绕对称轴旋转rotate弧度 
 */  
function drawCircularText(s,string, startAngle, endAngle ,lv){
        var radius = s.radius,
            angleDecrement = (startAngle - endAngle)/(string.length-1),
            angle = parseFloat(startAngle),
            index = 0,
            character;
        
        context.save();
        
        context.fillStyle = 'red';
        context.font = '20px 微软雅黑';
        context.textAlign = lv;
        context.textBaseline = 'middle';
        
        while (index < string.length) {
            character = string.charAt(index);
            
            context.save();
            context.beginPath();
            context.translate(s.x + Math.cos(angle) * radius,
                          s.y + Math.sin(angle) * radius);
            context.rotate(Math.PI/2 + angle);
            
            context.fillText(character, 0, 0);
//            ctx.strokeText(character, 0, 0);
            
            angle -= angleDecrement;
            index++;
            context.restore();
        }
        context.restore();
    }

function create5star(context,sx,sy,radius,color,rotato){
context.save();  
context.fillStyle=color;  
context.translate(sx,sy);//移动坐标原点  
context.rotate(Math.PI+rotato);//旋转  
context.beginPath();//创建路径  
var x = Math.sin(0);  
var y= Math.cos(0);  
var dig = Math.PI/5 *4;  
for(var i = 0;i< 5;i++){//画五角星的五条边
 x = Math.sin(i*dig);
 y = Math.cos(i*dig);
context.lineTo(x*radius,y*radius);
}   
context.closePath();  
context.stroke();  
context.fill();  
context.restore(); 
}
},
}
}
</script>

<style scoped>
.about{
    width: 100%;
}
.box{
    margin: 40px;
}
.left-seal{
    width: 36%;
    height: 1000px;
    float: left;
    margin: 40px;
}
.right-seal{
    width: 90%;
    height: 100px; 
}
.can-box{
    margin-top: 20px;
    margin-left: 70px;
}
.ar-box{
    float: right;
    margin : 20px;
}
</style>
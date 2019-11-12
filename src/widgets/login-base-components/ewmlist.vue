<template>
    <div>  
        <el-row class="barcodes" type="flex" justify="space-between">
        <el-col class="barcodes-group" v-for="item in qrcodes" :key="item.link">
            <div class="barcode-title">{{item.title}}</div>
            <div class="barcode-img">
                <canvas width="180" height="180" :ref="item.name"></canvas>
            </div>
        </el-col>
    </el-row>
    </div>
    
</template>
<script>
import QRCode from "qrcode";
export default {
  mounted() {
    this.toCanvas();
  },
  props: {
      qrcodes:{
          type: Array,
          default(){
              return []
          }
      }
  },
  data() {
    return {};
  },
  watch:{
    
  },
  methods: {
    toCanvas() {
      _.each(this.qrcodes,item => { 
        QRCode.toCanvas(_.first(this.$refs[item.name]), item.link, callback)
      });
      function callback() {
      }
    }
  }
};
</script>
<style scoped lang="less">
ul,
li {
  list-style: none;
}
.barcodes {
  overflow: auto;
  width: 100%;
  margin: 50px auto 10px;
  padding: 0;
  .barcodes-group {
    box-sizing: border-box;
    float: left;
    // width: 20%;
    border-right: solid 1px #6ec5f0;
    .barcode-title {
      text-align: center;
      font-size: 20px;
      font-family: "微软雅黑";
      color: #36afe8;
      padding: 10px 0;
    }
    .barcode-img {
      text-align: center;
      canvas {
        display: inline-block;
        margin-top: 5px;
        width: 170px !important;
        height: 170px !important;
      }
    }
  }
  :last-child {
    border-right: none;
  }
}
</style>

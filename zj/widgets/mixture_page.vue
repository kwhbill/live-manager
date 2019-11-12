<template>
  <div>
      <div ref="content">page loading...</div>
  </div>
  
</template>

<script>
import BasePage from "./base_page"
// hold 住 jquery 所有 ready load 回调
if(window.$){
  window.$.holdReady(true);
}

export default {
  mixins: [BasePage],
  data () {
    return {
      title: window.PAGE_TITLE,
      index: window.PAGE_INDEX
    }
  },
  methods: {
    setup(app){
        window.require(["vue1"], (vue1)=>{
            // 暴露 vue1 作为 Vue 全局变量，给混合页面使用
            window.Vue = vue1 
            // 移动 混合页面内容 至 content
            let content = this.$refs.content
            let pageContent = $("#pageContent")
            pageContent.replaceAll(content)
            pageContent.css({opacity: 1})
            
            // 释放并执行 jquery ready load 回调链
            if(window.$) window.$.holdReady(false);
        })

    }
  }
}
</script>

<style>
.app .app-page .app-top-box .zj-breadcrumb{
  background-color: #fff!important;
}
.page-header-fixed>div {
    background: #fff!important;
}
</style>

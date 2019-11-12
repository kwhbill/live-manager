import App from "./app.vue"
import Vue from "vue"

window.zjAppInit = function(){
    zj.init()
    Vue.buildPage({App})
}

// 混合型，手动调用
if(!window.isZjAppInitManual){
    window.zjAppInit()
}


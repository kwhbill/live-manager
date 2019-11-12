import qs from "qs"
import axios from "axios"
import fecha from "fecha"
import Vue from "vue"
import VueRouter from "vue-router"
import echarts from "echarts"

import "./ui"
import * as compatible from "./compatible"
import * as consts from "./consts"
import * as net from "./net"
import * as utils from "./utils"
import * as remote from "./remote"

export {
    consts,
    net,
    utils,
    remote
 }

export function init(){
    window.require.config({
        baseUrl: "/opms",
        paths: {
            "vue1": "zj/assets/js/vue-1.0.26" // 混合页面使用
        },
        urlArgs: function(id, url) {
          if(url.indexOf("?") < 0){
            let ts = (new Date).getTime()
            return `?ts=${ts}`
          }
          return ""
        }
    })

    let amdDefMap = {
        vue2: Vue,
        zj: this,
        jquery: $,
        lodash: _,
        qs: qs,
        axios: axios,
        fecha: fecha,
        "vue-router": VueRouter,
        "echarts": echarts
    }

    _.each(amdDefMap, (m, key)=>{
        window.define(key, [], function(){
            return m
        })        
    })
    // zj.xxxx 的兼容处理
    compatible.process(this, {consts, net, utils})
    window.zj = this
    this.qs = qs
}
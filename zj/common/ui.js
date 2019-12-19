import Vue from "vue"
import VueRouter from "vue-router"
import Cookie from "js-cookie"
import VueI18n from "vue-i18n"

import ElementUI from "element-ui"
import {default as enUILocale} from "element-ui/lib/locale/lang/en"
import {default as zhUILocale} from "element-ui/lib/locale/lang/zh-CN"

import MixturePage from "../widgets/mixture_page"

Vue.config.devtools = true

// ui and i18n =================
Vue.use(VueI18n)
Vue.use(VueRouter)
Vue.use(ElementUI)

Vue.localeMap = {
    "en": "English",
    "zh-CN": "简体中文"
    // "ja-JP": "日本语"
}
Vue.locales = _.keys(Vue.localeMap)

var elmMsgMap = {
    "en": enUILocale,
    "zh-CN": zhUILocale
}

var zjMsgMap = {
    "en": require("../i18n/en.js").default,
    "zh-CN": require("../i18n/zh-CN.js").default
}

function loadCss(url) {
    var link = document.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
}


// 构建混合页面
Vue.buildMixturePage = function(App){
    let lang = Vue.i18nGetLocale()
    let elmMsgs = elmMsgMap[lang]
    let zjMsgs = zjMsgMap[lang]
    Vue.locale(lang, _.merge(elmMsgs, zjMsgs))
    Vue.component("page", MixturePage)
    new Vue({
        el: "#app",
        template: "<App/>",
        components: { App }
    })    
}
// 构造页面
Vue.buildPage = function({App, parsePageInfo}){
    
    if(!parsePageInfo) parsePageInfo = ()=>{
        return location.pathname.match(/opms\/(.+)\.html/)
    }

    let [pageUrl,pageName] = parsePageInfo()
    
    window.require([`/opms/commonChunk.js`], function() {
       

        if(!IS_DEV){ // 若为正式环境，css 被抽离独立，需要额外加载
            let cssNameArr = pageName.split("/")
            cssNameArr.unshift([ "assets", "css"].join("/"))
            loadCss(`/opms/pages/${cssNameArr.join("/")}.css?${new Date().getTime()}`)
        }
        window.require([`i18n`, pageName], (prodMsgMap, Page)=>{
            let lang = Vue.i18nGetLocale()
            let elmMsgs = elmMsgMap[lang]
            let zjMsgs = zjMsgMap[lang]
            let prodMsgs = _.get(prodMsgMap, ["default", lang], {})
            prodMsgs = {f: prodMsgs, p: prodMsgs}
            Vue.locale(lang, _.merge(elmMsgs, zjMsgs, prodMsgs))
            Vue.component("page", Page.default)
            new Vue({
                el: "#app",
                template: "<App/>",
                components: { App },
                router: Page.router
            })
        })
    })
}

// TODO: 翻译完语料后，默认应该以 en 显示
Vue.config.fallbackLang = "zh-CN"
// 多语言的读取和设置
Vue.i18nSetLocale = function (locale) {
    Vue.config.lang = locale
    Cookie.set("i18n-locale", locale)
}
Vue.i18nGetLocale = function () {
    let locale = Cookie.get("i18n-locale")
    if (locale && Vue.localeMap[locale]) {
        return locale
    }
    return "zh-CN"
}
// 设置当前语言
Vue.i18nSetLocale(Vue.i18nGetLocale())




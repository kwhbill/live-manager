import path from "path"

export var isDev = !!process.env.DEV
export var target = 'pages'
export var nameFormat = "[name]"
export var idFormat = "[id]"
export var publicName = "opms"

export function resolve(subPath){
    return path.resolve(subPath)
}

export function dllNameTarget(dllName){
    return `dll_${dllName}`
}

export var resolveInfo = {
    resolve: {
        modules: [
            resolve("./node_modules")
        ],
        alias: {
            "dll": resolve("./dll"),
            "zj": resolve("./zj"),
            "vue": resolve("./node_modules/vue/dist/vue.esm.js"),
            "vue-router": resolve("./node_modules/vue-router/dist/vue-router.esm.js"),
            "echarts": resolve("./dll/vendors/echarts@3.3.2/echarts.min.js"),
            "element-ui.css": resolve("./node_modules/element-ui/lib/theme-chalk/index.css"),
            "fico4.css": resolve("./dll/vendors/font-awesome@4.7.0/css/font-awesome.min.css"),
            "fico3.css": resolve("./dll/vendors/font-awesome@3.2.1/css/font-awesome.min.css"),
            "jquery": resolve("./node_modules/jquery/dist/jquery.min.js")
        },
        extensions: [".js", ".vue", ".json"]
    }
}
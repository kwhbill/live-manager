import fs from "fs"
import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CleanWebpackPlugin from "clean-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import HtmlWebpackIncludeAssetsPlugin from "html-webpack-include-assets-plugin"
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer"

import * as _ from "lodash"

import {isDev, nameFormat, publicName, resolve, dllNameTarget} from "../resolve"
import {sortEntryNames} from "../dll/entry"
import entryConf from "./entry"

var dllJsAssets = []
var dllPlugins =  []
_.each(sortEntryNames, (dllName)=>{
    dllJsAssets.push(`dll/${dllName}.js`)
    dllPlugins.push(new webpack.DllReferencePlugin({
        manifest: resolve(`./dll/manifest/${dllName}.json`),
        name: dllNameTarget(dllName),
        sourceType: "var"
    }))
})
var browserTmpl = fs.readFileSync(resolve("./webpack_config/portal/browser_tmpl.txt"), {encoding: "utf8"})
browserTmpl = JSON.stringify(browserTmpl)
var browserJsTmpl = fs.readFileSync(resolve("./webpack_config/portal/browser.js"), {encoding: "utf8"})

browserJsTmpl = _.replace(browserJsTmpl, '{tmpl}', browserTmpl)
var browserCSSTmpl = fs.readFileSync(resolve("./webpack_config/portal/browser_css.txt"), {encoding: "utf8"})
var htmlPlugins = _.map(entryConf.entry, (info, entryName)=>{
    return new HtmlWebpackPlugin({
        title: entryName,
        template: resolve(`./portals/${entryName}/template.html`),
        filename: `portals/${entryName}.htm`,
        chunks: [entryName, "commonChunk", "manifest"],
        hash: true,
        inject: false,
        ieNotice: browserJsTmpl,
        ieCss: browserCSSTmpl
    })
})

export default {
    plugins: [
        // new BundleAnalyzerPlugin(), // 查看打包树可视化插件
        // 清理 portals 产出
        new CleanWebpackPlugin(
            [
                resolve("./build/portals")
            ],
            {
                root: resolve(""),
                verbose: true
            }
        ),
        // 直接 copy zj assets 至 build
        new CopyWebpackPlugin( 
            [
                {from: resolve("./zj/assets"), to: resolve("./build/zj/assets") }
            ]
        ),
        new webpack.DefinePlugin({
            IS_DEV: isDev
        }),
        // 提取CSS
        new ExtractTextPlugin(`portals/assets/css/${nameFormat}.css`, { allChunks: true }),
        // number id => word id
        new webpack.HashedModuleIdsPlugin(),
        // 提取公用代码
        new webpack.optimize.CommonsChunkPlugin({
            name: "commonChunk",
            filename: "portals/commonChunk.js"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "manifest",
            minChunks: Infinity,
            filename: "portals/manifest.js"
        }),
        // 暴露全局变量
        new webpack.ProvidePlugin({
            _: "lodash",
            $: "jquery",
            zj: "zj",
            prod: "prod"
        }),
        // dll 引入
        ...dllPlugins,
        // 页面生成
        ...htmlPlugins,
        // .. 引入 dll 资源
        new HtmlWebpackIncludeAssetsPlugin({ 
            assets: [
                {path: "dll", glob: "**/*.css", globPath: resolve("./build/dll/")},
                ...dllJsAssets
            ], 
            append: false,
            hash: true
        })
    ]
}
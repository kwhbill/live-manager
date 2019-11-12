import fs from "fs"
import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import HtmlWebpackPlugin from "html-webpack-plugin"
import CleanWebpackPlugin from "clean-webpack-plugin"
import CopyWebpackPlugin from "copy-webpack-plugin"
import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer"

import * as _ from "lodash"

import {isDev, target, nameFormat, publicName, resolve} from "../resolve"
import entryConf from "./entry"


export default {
    plugins: [
        // new BundleAnalyzerPlugin(), // 查看打包树可视化插件
        // 清理产品产出
        new CleanWebpackPlugin(
            [
                resolve(`./build/${target}`)
            ],
            {
                root: resolve(""),
                verbose: true
            }
        ),
        // 提取CSS
        new ExtractTextPlugin(`${target}/assets/css/${nameFormat}.css`, { allChunks: true }),
        // number id => word id
        new webpack.HashedModuleIdsPlugin(),
        // 提取公用代码
        new webpack.optimize.CommonsChunkPlugin({
            name: "commonChunk",
            minChunks: function(module, count) {
                return module.resource && (/.js$/).test(module.resource)&& count >= 2;
            }
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: "manifest",
        //     minChunks: Infinity
        // }),
        // 暴露全局变量
        new webpack.ProvidePlugin({
            _: "lodash",
            $: "jquery",
            zj: "zj",
            prod: "prod"
        })
    ]
}
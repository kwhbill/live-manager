import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"
import NyanProgressPlugin from "nyan-progress-webpack-plugin"
// import {BundleAnalyzerPlugin} from "webpack-bundle-analyzer"
import CleanWebpackPlugin from "clean-webpack-plugin"

import { sortEntryNames } from "./entry"
import {nameFormat, resolve, dllNameTarget} from "../resolve"

let conf = {
    plugins: [
        // 清理 dll 生成
        new CleanWebpackPlugin(
            [
                resolve("./build/dll"),
                resolve("./dll/manifest/*"),
            ],
            {
                root: resolve(""),
                verbose: true
            }
        ),
        // number id => word id
        new webpack.HashedModuleIdsPlugin(),
        // new BundleAnalyzerPlugin(), // 查看打包树可视化插件
        new NyanProgressPlugin({
            debounceInterval: 60,
            nyanCatSays(progress) {
                if (progress === 1) {
                    return "喵~ Bug生成完毕"
                }
                return "喵~ 又在写Bug了?"
            }
        }),
        // 抽取 css
        new ExtractTextPlugin(`assets/css/${nameFormat}.css`, { allChunks: true }),
        // entry 独立抽取
        new webpack.optimize.CommonsChunkPlugin({
            names: sortEntryNames.reverse(),
            minChunks: Infinity
        }),
        // 生成 dll 清单
        new webpack.DllPlugin({
            path: `dll/manifest/${nameFormat}.json`,
            name: dllNameTarget(nameFormat)
        })
    ]
}

export default conf
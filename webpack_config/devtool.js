import {
    process as mockProcess,
    mockEmptyMenu
} from "../mock"

import {
    publicName, prodName, resolve, isDev
} from "./resolve"


import fs from "fs"
import * as _ from "lodash"
import * as bodyParser from "body-parser"




export default function () {
    let info = {
        devtool: isDev ? "cheap-module-source-map" : false
    }

    if (isDev) {


        info.devServer = {
            hot: true,
            port: 9999,
        
            proxy: {
                '/admin': {
                    target: 'http://localhost:8009',
                    changeOrigin: true,     // target是域名的话，需要这个参数，
                    secure: false,          // 设置支持https协议的代理
                    pathRewrite: {
                        '^/admin/': '/'
                      },
                },
            },
            
            before(app){
                // app.use(bodyParser.json());
                let publicPrefix = `/${publicName}/`
                console.log(app,'appapp');
                
                // 其余GET请求，尽量匹配 build 下的静态文件
                // 匹配不到，则交给webpack-dev-server处理
                app.get("*", (req, res, next) => {
                    let reqPath = req.path
                    if (_.startsWith(reqPath, publicPrefix)) {
                        let filePathName = reqPath.substr(publicPrefix.length)
                        let srcPath = "./build/" + filePathName
                        if (fs.existsSync(srcPath)) {
                            console.info("GET BUILD:", reqPath)
                            let option = {
                                root: resolve(""),
                                headers: {
                                    "x-timestamp": Date.now(),
                                    "x-sent": true
                                }
                            }
                            res.sendFile(srcPath, option, (err) => {
                                if (err) {
                                    console.error("SEND FILE ERROR:", reqPath, err)
                                    next()
                                }
                            })
                            return
                        }else{
                            
                        }
                    }
                    console.warn("!! NOT FOUND:", reqPath)
                    next()
                })
                app.post("*", (req, res, next) => {
                    console.log(req);
                    next()
                })
            },
           
        }


    }

    return info    
}
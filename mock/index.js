import * as _ from "lodash"
import fs from "fs"
import vm from "vm"
import Mock from "mockjs"

export function process(req, res, type){
    let reqPath = _.trim(req.path, "/")
    if(type == "gapi"){
        reqPath = reqPath + "/" + req.query.tip
    }
    let filePath = `mock/${reqPath}.js`
    let data = {
        code: -404,
        message: `unfound mockjs file: ${filePath}`
    }

    if(fs.existsSync(filePath)){
        console.info("MOCK:", req.method, reqPath)
        let code = fs.readFileSync(filePath, {encoding: "utf8"})
        code = vm.runInThisContext(code)
        data = code(req, {require, Mock})
    }else{
        console.error("MOCK UNFOUND:", req.method, reqPath)
    }

    res.writeHead(200, {
        "Content-Type": "text/json; charset=utf-8"
    })
    res.end(JSON.stringify(data))
}

export function mockEmptyMenu(res){
    let data = {
        "data": {
            "head": [],
            "middle": [],
            "foot": []
        }
    }
    res.writeHead(200, {
        "Content-Type": "text/json; charset=utf-8"
    })
    res.end(JSON.stringify(data))   
}
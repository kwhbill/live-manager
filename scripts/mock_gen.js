
var fs = require("fs")
var path = require("path")
var {
  checkArgs,
  exec
} = require('./basics/exec_chain_utils')


checkArgs(1, "yarn mock-gen -- uc/common/user_info", (args) => {
  let url = args[0]

  let destPath = `./mock/${url}.js`
  let destDir = path.dirname(destPath)
  let srcPath = "./scripts/tpls/mock.js"

  if(!fs.existsSync(destPath)){ // 若不存爱，则以模板为作为源
    exec(`生成${destDir}目录`,`mkdir -p ${destDir}`)
    exec(`拷贝${srcPath}到${destPath}`,`cp ${srcPath} ${destPath}` )
  }
})
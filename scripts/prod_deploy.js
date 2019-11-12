
var {
  checkArgs,
  Chain
} = require('./basics/exec_chain_utils')
var {
  checkStatus,
  swichToTarget,
  pullTargetBranch,
  createHash,
  compareVersion,
  compilePages,
  clear,
  deploy
} = require('./basics/exec_utils')
checkArgs(0, "BRANCH=opms yarn prod-deploy", (args) => {
  let branch = process.env.BRANCH || "opms"
  let prodName = 'pages'
  var chain = new Chain()
  chain
    .cd('../zj_front_deploy')
    .concat(checkStatus)
    .concat(swichToTarget,{branch})
    .concat(pullTargetBranch,{branch})
    .concat(compareVersion,{branch})
    .cd(`../zj_opms_h5pc`)
    .concat(checkStatus)
    .concat(swichToTarget,{branch:'master'})
    .concat(pullTargetBranch,{branch:'master'})
    .concat(compareVersion,{branch:'master'})
    .concat(compilePages,{inline:true})
    .concat(createHash)
    .concat(deploy,{prodName})
    .concat(clear,{prodName})
    .run()
})
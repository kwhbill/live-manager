
var {
  checkArgs,
  Chain
} = require('./basics/exec_chain_utils')
var {
  checkStatus,
  swichToTarget,
  pullTargetBranch,
  compareVersion,
  compilePortal,
  createHash,
  clear,
  deploy
} = require('./basics/exec_utils')

checkArgs(0, "BRANCH=opms yarn portal-deploy", (args) => {
  let branch = process.env.BRANCH || "opms"
  var chain = new Chain()
  chain
    .cd('../zj_opms_h5pc')
    .concat(checkStatus)
    .concat(swichToTarget,{branch:'master'})
    .concat(pullTargetBranch,{branch:'master'})
    .concat(compareVersion,{branch:'master'})
    .cd('../zj_front_deploy')
    .concat(checkStatus)
    .concat(swichToTarget,{branch})
    .concat(pullTargetBranch,{branch})
    .concat(compareVersion,{branch})
    .cd('../zj_opms_h5pc')
    .concat(compilePortal,{inline:true})
    .concat(createHash)
    .concat(deploy,{prodName:'dll'})
    .concat(deploy,{prodName:'portals'})
    .concat(deploy,{prodName:'zj'})
    .concat(clear,{prodName:'portals'})
    .run()
})
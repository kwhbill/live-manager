
var {
  checkArgs,
  Chain
} = require('./basics/exec_chain_utils')
var {
  createHash,
  sync,
} = require('./basics/exec_utils')



checkArgs(1, "yarn dll-sync -- name@num [name: 您的账号, num: 同步至测试服务器8]", (args)=>{
  var chain = new Chain({args})
  chain
    .concat(createHash)
    .concat(sync,{prodName:'dll'})
    .run()
})
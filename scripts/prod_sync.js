var {
  checkArgs,
  Chain
} = require('./basics/exec_chain_utils')
var {
  compilePages,
  createHash,
  sync,
  clear
} = require('./basics/exec_utils')
var _ = require('lodash')

checkArgs(1, "yarn prod-sync -- kongweihao@1,3,8,9,10 [demo: 产品名 name: 您的账号, num: 同步至测试服务器1,3,8,9,10]", (args) => {
  let prodName = 'pages'
  var chain = new Chain({args})
  chain
    .concat(compilePages)
    .concat(createHash)
  let [name, at] = _.split(args[0], "@")
  let _at =  _.split(at,',')
  _.each(_at,item=>{
    chain.concat(sync,{prodName,target:[`${name}@${item}`]})
  })
  chain.concat(clear, {prodName})
    .run()

})
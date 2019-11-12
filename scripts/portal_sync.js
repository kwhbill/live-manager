var {
  checkArgs,
  Chain
} = require('./basics/exec_chain_utils')
var {
  compilePortal,
  createHash,
  sync,
  clear
} = require('./basics/exec_utils')
var _ = require('lodash')

checkArgs(1, "yarn portal-sync -- kongweihao@1,3,8,9,10 [name: 您的账号, num: 同步至测试服务器1,3,8,9,10]", (args) => {
  var chain = new Chain({args})
  chain
    .concat(compilePortal)
    .concat(createHash)
  let [name, at] = _.split(args[0], "@")
  _.each(_.split(at, ','), _at => {
    chain
      .concat(sync, {prodName: 'dll', target: [`${name}@${_at}`]})
      .concat(sync, {prodName: 'zj', target: [`${name}@${_at}`]})
      .concat(sync, {prodName: 'portals', target: [`${name}@${_at}`]})
  })
  chain
    .concat(clear, {prodName: 'portals'})
    .run()
})
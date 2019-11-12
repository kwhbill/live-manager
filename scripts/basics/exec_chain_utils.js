var _ = require("lodash")
var execa = require("execa")

var index = 0

function exec(tip, cmd, callback) {
  console.log(`${index++} ${tip} exec: ${cmd}`);
  return execa.shell(cmd).then(function (result) {
    callback && callback(result.stdout)
  }).catch(function (error) {
    callback && callback(error.message)
  })
}

function syncWrap({tip, args, srcPath, dest}, resolve) {
  let [name, at] = _.split(args[0], "@")
  let server = "ubuntu@10.13.123.151"
  let target
  switch (at) {
    case '1':
      target = 'open_t1_go'
      break;
    case '10':
      target = 'test10'
      server = "ubuntu@10.13.96.88"
      break;
    default:
      target =`test${at}_go`
  }
  if (!_.includes(dest, "ubuntu@")) { // 若不含账号信息，则使用默认路径
    dest = `${server}:/data/zhijian/upload_pkg/rsync/${target}/webui${dest}`
  }
  return exec(tip, `rsync -rvzKPO --exclude  ".DS_Store" -e "ssh -o ProxyCommand='ssh ${name}@106.75.153.251 -W %h:%p'" ${srcPath}  ${dest}`, (result) => {
    resolve(result)
  })
}

function checkArgs(argsCount, argsTip, resolve) {
  // argsCount:  传参个数
  // argsTip：   传参个数有误提示
  // resolve:    处理回调
  let args = _.slice(process.argv, 2)
  if (args.length < argsCount) {
    console.log("参数有误：", argsTip)
    return
  }
  resolve(args)
}


class Chain {

  constructor(context = {}) {
    this.context = context
    this.fnArgsList = []
    this.step = -1
    this.curCatalog = '../zj_h5pc'
  }

  concat(fn, params = {}) {
    params['curCatalog'] = this.curCatalog
    this.fnArgsList.push({fn, params})
    return this
  }

  cd(catalog = '../zj_h5pc') {
    this.curCatalog = catalog
    return this
  }

  next(result = 'success') {
    if (this.fnArgsList.length === this.step) return
    let {fn, params} = this.fnArgsList[++this.step]
    let context = _.merge(this.context, {lastFnResult: result})  //拿到上次函数执行结果
    fn({
      context,
      params,
      next: (result) => {
        this.next(result)
      },
    })
  }

  run() {
    this.next()
  }
}

module.exports = {
  exec,
  syncWrap,
  checkArgs,
  Chain
}



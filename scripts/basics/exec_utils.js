var {exec, syncWrap} = require('./exec_chain_utils')

function checkStatus({context,next,params}) {
  exec(`检查${params.curCatalog}有无未提交的版本`, `cd ${params.curCatalog} && git status`, (result) => {
    if (result.indexOf('nothing to commit') !== -1) {
      next()
    } else {
      console.log(`错误提示：您在${params.curCatalog}有未保存的版本，请先保存版本并推送到线上，再部署`);
    }
  })
}


function swichToTarget({context, params, next}) {
  exec(`切换到目标分支 ${params.branch} `, `cd ${params.curCatalog} && git checkout ${params.branch}`, (result) => {
    if (result.indexOf('error') === -1) {
      next()
    } else {   // 没有目标分支
      console.log(`提示：本地没有目标分支${params.branch}，需要远端拉取`);
      next('error')
    }
  })
}

function pullTargetBranch({context,params, next}) {
  if(context.lastFnResult=='error'){
    exec('拉取目标分支并更新版本', `cd ${params.curCatalog} && git fetch origin ${params.branch} && git checkout ${params.branch}`, (result) => {
      if(result.indexOf("Couldn't find remote ref") === -1){
        next()
      }else{
        console.log(`错误提示：远端没有目标分支`)
      }
    })
  }else{
    exec('拉取目标分支并更新版本', `cd ${params.curCatalog} && git pull origin ${params.branch}`, (result) => {
      next()
    })
  }
}

function compareVersion({params, next}) {
  exec(`对比当前版本与线上版本是否一致`, `cd ${params.curCatalog} && git diff ${params.branch} -- origin/${params.branch}`, (result) => {
    if (result.length === 0) {
      next()
    } else {
      console.log(`错误提示：您当前版本与线上版本不一致`)
    }
  })
}

function compilePortal({params ,next}) {
  let command = `yarn portal-build`
  if(params.inline) command = `${command} -- -p`
  exec('编译portal', command, (result) => {
    next()
  })
}

function compilePages({params, next}) {
  let command = `yarn prod-build`
  if(params.inline) command = `${command} -- -p`
  exec(`编译产品页面`, command, (result) => {
    next()
  })
}

function createProdHash({params, next}) {
  exec(`生成GIT ${params.prodName} HASH VER `,
    `        cd products/${params.prodName}  
             && git branch -v | grep ^* > ../../build/${params.prodName}/ver.txt  
             && cd ../../
            `, (result) => {
      next()
    })
}

function createHash({next}) {
  exec(`生成GIT HASH VER `,
      `git branch -v | grep ^* > ./build/ver.txt`, (result) => {
      next()
  })
}
function clear({params, next}) {
  exec(`清除 build/${params.prodName}`, `rm -rf build/${params.prodName}`, () => {
    next()
  })
}

function sync({context, params, next}) {
  let srcPath = `./build/${params.prodName}`
  let dest = "/opms"
  syncWrap({tip: `推送${params.prodName}到测试服务器`, args:params.target ? params.target : context.args, srcPath, dest}, (result) => {
    next()
  })
}

function deploy({params, next}) {
  let rsyncCmd = "rsync -avzP --exclude  \".DS_Store\""
  let deployPath = "../zj_front_deploy/opms"
  if (!params.prodName) throw new Error('deploy缺乏必要参数')
  let srcPath = `build/${params.prodName}`
  exec(`同步至部署GIT：${srcPath} >>>> ${deployPath}`, `${rsyncCmd} ${srcPath} ${deployPath}`, (result) => {
    next()
  })
}


module.exports = {
  checkStatus,
  swichToTarget,
  pullTargetBranch,
  compareVersion,
  compilePortal,
  compilePages,
  createProdHash,
  createHash,
  clear,
  sync,
  deploy
}


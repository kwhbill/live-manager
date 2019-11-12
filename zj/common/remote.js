var remoteCxt = {}

export function addGAPIGen(namePath, url, varMap, resStr, s){
    // s: 常用 resStr 的集合引用
    let name = _.last(_.split(namePath, "."))
    let defaultVars = {}
    _.each(varMap, (item,key)=>{
        if(_.isObject(item)){
            defaultVars[key] = _.get(item, "defaultValue")
            varMap[key] = item.type
        }
    })
    let gen = function(newResStr){
        if(newResStr){
            if(_.isFunction(newResStr)){
                newResStr = newResStr(resStr, s)
            }
        }else{
            newResStr = resStr
        }
        let query = zj.net.buildGAPIQueryStr(
            name, 
            varMap,
            newResStr
        )

        return {
            type: "gapi",
            url,
            vars: {},
            varKeys: _.keys(varMap),
            defaultVars,
            query
        }
    }
    remoteCxt[namePath] = gen
}

export function addPAPIGen(namePath, url, method="GET"){
    let name = _.last(_.split(namePath, "."))
    url = `${url}/${name}` 
    let gen = function(){
        return {
            type: "papi",
            method,
            url,
            params: null,
            data: null
        }
    }
   
    remoteCxt[namePath] = gen
}


export function genRemote(name, options){
    // let gen = remoteCxt[name]
    let gen = remoteCxt[name]
    if(!gen){
        throw `未定义remote:${name}`
    }
    return gen(options)
}

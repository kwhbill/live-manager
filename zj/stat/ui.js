import {components} from "../widgets/ns/help"

var context ={}

_.each(components, (component)=>{
    component.uiRegister(context)
})

function buildConf(uiType, options={}) {
    let component = context[uiType]
    if(!component){
        throw `未注册组件：${uiType}`
    }
    return component.uiGenConf(options)
}

export default buildConf
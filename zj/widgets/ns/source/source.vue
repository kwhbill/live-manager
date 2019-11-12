<template>
    <i :name="name">
    </i>
</template>

<script>
import Base from "../base"
let uiType = "source/source"

export default {
    mixins: [Base],

    uiRegister(context) {
        // 注册组件，绑定生成对应conf、tpl
        context[uiType] = this
    },

    uiGenConf(options) {
        /*
          生成
          options:
            watchVar: {    // 若指定了监控变量，则将忽略watchForm
                name: "xxx"
            },
            watchForm: { // 监控表单配置
                include: ["a","b"], // 监控哪些表单的value变化，不指定则全部
                renderOnly: ["a"]   // 哪些表单的value变化，仅仅通知视图重绘，不进行远端获取 
                requires: [...]     // 表单必填项名列表，字符串 '*' 表示全部,requires为Object的时候值为{key:'',valid(){}}，
                                    //key为表单必填项名称，isReadLoad为是否准备好加载，必须返回true或false
            },
            data: {} // 数据集
            remote: {} // 远端数据获取配置

        */
        let conf = {
            uiType,
            data: {}
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-source name="${name}"></ns-source>`
    },

    data() {
        return {
            nsType: "source",
            requireFields: null,
            allLabelList: []
        }
    },
    methods: {
        readyCreated() {
            let formConf = this.nsget("#form", {})
            let watchForm = this.nsget("watchForm", {})
            // 要监控的表单名，不指定，则默认全部
            let fieldNames = watchForm.include || _.keys(formConf)

            let renderOnly = watchForm.renderOnly || []
            let requires = watchForm.requires
            if(requires){
                if(requires == "*"){
                    // 全部，排除只刷新的表单项
                    this.requireFields = _.difference(fieldNames, renderOnly)
                }else{
                    // 仅仅必须且存在于表单中
                    let fieldMap = {}
                    _.each(fieldNames, (field)=>{
                        fieldMap[field] = true
                    })
                    this.requireFields = _.filter(requires, function(item){

                        return fieldMap[ _.isObject(item) ? item.name : item ]
                        
                    })


                    
                }
            }
            if (this.hasNsWatchVar()) {
                this.nswatchVar((name, v) => {
                    if(v !== false) this.reloadData()
                })
                this.nswatch("data", (data)=>{
                    this.nssetVar(false)
                })
            } else {
                // 仅仅重绘的表单名
                let renderOnlyFieldMap = {}
                _.each(watchForm.renderOnly, (name) => {
                    renderOnlyFieldMap[name] = true
                })

                _.each(fieldNames, (name) => {
                    this.nswatch(`#form.${name}.value`, (v) => {
                        let isRenderOnly = renderOnlyFieldMap[name]
                        this.reloadData(isRenderOnly)
                    })
                })
                
                this.reloadData()
            }
        },
        reloadData(renderOnly = false) {
            if (renderOnly) {
                // 仅变更data，不从远端获取数据
                let data = this.nsget("data")
                if(!_.isEmpty(data)) this.nsset("data", _.clone(data))
            } else {
                // 从远端获取数据
                let requires = this.nsget("watchForm.requires")
                if(!this.validRequires()){
                    let warningFont =  _.join(this.allLabelList,'、')
                    //this.hasNsWatchVar() 主要是针对没有查询按钮的页面一开始表单还没加载到数据出现不必要的提示
                    if(warningFont && this.hasNsWatchVar()){  
                        this.$message({
                            message: `${warningFont}为必填项`,
                            type: 'warning'
                        })
                    }
                    
                    return
                } 
                this.loadDataFromRemote()
            }
        },
        validRequires(){
            let result = true
            if(this.requireFields){
                let allLabelList = []
                result = _.every(this.requireFields, (field)=>{
                    let status = false
                    if(_.isObject(field)){
                        status =  _.bind(field.valid,this)()
                        field = field.name
                    }
                    else{
                        let v = this.nsget(`#form.${field}.value`)
                        status = v == "" || !_.isNil(v)
                    }
                    let label = _.trim(this.nsget(`#form.${field}.label`, `${field}`), `：`)
                    allLabelList.push(label)
                    return  status
                })
                this.allLabelList = allLabelList
            }
            return result
        }
    }
}
</script>




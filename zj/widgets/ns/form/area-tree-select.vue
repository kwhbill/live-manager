<template>
    <div class="cell" :class="selectOption.multiple?'mul-select-box':''">
        <div class="form-label"  :class="label?'':'nopl'">
            <span><i class="required-font" v-show="required">* </i>{{label}}</span>
            <div>
                <select-tree v-model="selectedValue" class="form-field" :placeholder="placeholder"
                :multiple="selectOption.multiple"
                :loadTreeReady="selectOption.loadTreeReady"
                :lazy="selectOption.lazy"
                :defaultProps="selectOption.defaultProps"
                :nodekey="selectOption.nodekey"
                :optionlabel="selectOption.optionlabel"
                :loadNode="loadTree"
                size="samll"
                ></select-tree>
            </div>
            
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
import selectTree from "../../select-tree/widget"
let uiTag = "area-tree-select"
let uiType = `form/${uiTag}`

export default {
    mixins: [FormBase],
    components: {
        selectTree
    },
    uiRegister(context) {
        // 注册组件，绑定生成对应conf、tpl
        context[uiType] = this
    },

    uiGenConf(options) {
        /*
          生成
          options:
            multiple:false //是否多选，默认单选
            allItem: {id: 0, name: "xxxx"} // 可以为对象，可以为回调方法（返回一个对象）

        */
        let conf = {
            uiType,
            value: null
        }

        return _.merge(conf, options)
    },
    uiGenTpl({ name, conf, ui }) {
        return `<ns-${uiTag} name="${name}"></ns-${uiTag}>`
    },

    data() {
        return {
            selectedValue: null,
            items: [],
            selectOption:{
                multiple: false,
                loadTreeReady: false,
                lazy: true,
                defaultProps:{label: 'name', isLeaf: 'isLeaf'},
                nodekey: "id",
                optionlabel: "pathName"
            },
            pathNameMap: {}
        }
    },

    computed:{
        label(){
            return this.nsget("label", "")
        },
        placeholder(){
            return this.nsget("placeholder", "请选择区域")
        },
        required(){
            return this.nsget("required",false)
        }  
    },

    watch: {
        selectedValue(v) {
            this.nsset("value", v)
        }
    },

    methods: {
        readyCreated() {
            let isMultiple = this.nsget('multiple',false)
            if(isMultiple){
                this.selectOption.multiple = isMultiple
                this.selectedValue = []
            }
            this.selectOption.loadTreeReady = true
        },
        isRootNode(node){
            return node.level <= 0
        },
        loadTree(node, resolve){
            let onRemoteChange = _.bind(this.nsget("onRemoteChange", _.noop), this)

            // 取代 this.onRemoteChange 处理
            this.loadDataFromRemote((state, context)=>{
                if(state == "before"){
                    context.params.fatherId = _.get(node, "data.id")
                }

                onRemoteChange(state, context)

                if(state == "success"){
                    resolve(this.processData(node, context.data.result))
                }
            })
        },
        processData(node, items){
            if(this.isRootNode(node)){
                let wholeItem = this.getWholeItem()
                if(wholeItem){
                    wholeItem.isLeaf = true
                    items.unshift(wholeItem)
                }
            }

            _.each(items, item =>{
                let fatherId = item.fatherId
                let id = item.id
                let parentPathName = fatherId ? this.pathNameMap[fatherId] : false

                if(!this.pathNameMap[id]){
                    this.pathNameMap[id] = parentPathName ? _.join([parentPathName, item.name], "/") : item.name
                }

                item.pathName = this.pathNameMap[id]
            })

            return items
        },
        getWholeItem(){
            let item = this.nsget("wholeItem")
            if(_.isFunction(item)){
                item = _.bind(item, this)()
            }
            if(item && !this.selectOption.multiple){
                this.selectedValue = item.id
            }
            return item
        }
    }
}
</script>
<style lang="less">
    .select-box{
        .el-select{
            width: 100%;
        }
    }
    .mul-select-box{
        width: 100%;
    }
    
    .required-font{
            color: red;
            font-size:12px;
            font-style: normal;
            font-weight: normal;
        }
    
</style>



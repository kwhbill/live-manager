<template>
    <div class="cell select-box" :class="selectOption.multiple?'mul-select-box':''">
        <div class="form-label" :class="label?'':'nopl'">
            <span><i class="required-font" v-show="required">* </i>{{label}}</span>
            <div>
                <select-tree v-model="selectedKey" class="form-field" placeholder="请选择"
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
let uiType = "form/category-tree-select"

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

        */
        let conf = {
            uiType,
            value: null,
            data:{}
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-category-tree-select name="${name}"></ns-category-tree-select>`
    },

    data() {
        return {
            selectedValue: null,
            items: [],
            selectOption:{
                loadTreeReady: false,
                multiple: false,
                lazy: true,
                defaultProps:{label: 'name', isLeaf: 'isLeaf'},
                nodekey: "key",
                optionlabel: "pathNames"
            },
            selectedKey: null,
            categoryPathNameMap: {}
            
        }
    },
    computed:{
        label(){
            return this.nsget("label", "")
        },
        placeholder(){
            return this.nsget("placeholder", "请选择检查项")
        },
        required(){
            return this.nsget("required",false)
        }  
    },
    watch: {
        selectedKey(v) {
            this.nsset("value", v)
        }
    },

    methods: {
        readyCreated() {
            let isMultiple = this.nsget('multiple',false)
            if(isMultiple){
                this.selectOption.multiple = isMultiple
                this.selectedKey = []
            }
            this.selectOption.loadTreeReady = true
        },
        isRootCategoryNode(node){
            return node.level <= 0 //如果节点的层级level为0，请求的是检查标准
        },
        loadTree(node, resolve){
            let onRemoteChange = _.bind(this.nsget("onRemoteChange", _.noop), this)
            let fatherK = node.key,
                items = []
            if (this.isRootCategoryNode(node)) {
                fatherK = _.get(this.nsget("/rootCategory"),'key')
            }
            // 取代 this.onRemoteChange 处理
            this.loadDataFromRemote((state, context)=>{
                if(state == "before"){
                    context.params.fatherKey = fatherK
                }

                onRemoteChange(state, context)

                if(state == "success"){
                    resolve(this.processData(node, context.data.result))
                }
            })
            
             
            
        },
        processData(node,items){
            if(this.isRootCategoryNode(node)){
                let wholeItem = this.getWholeItem()
                if(wholeItem){
                    wholeItem.isLeaf = true
                    items.unshift(wholeItem)
                }
            }
            _.each(items, (item) => {
                item.label = item.name;
                let fatherKey = item.fatherKey
                let key = item.key
                let parentPathName = !fatherKey? false : this.categoryPathNameMap[fatherKey];
                if (parentPathName) {
                    this.categoryPathNameMap[key] = _.join([parentPathName, item.name],"/");
                } else {
                    this.categoryPathNameMap[key] = item.name;
                }
                item.pathNames = this.categoryPathNameMap[key];
            });
            return items
        },
        getWholeItem(){
            let item = this.nsget("wholeItem")
            if(_.isFunction(item)) item = _.bind(item, this)()
            
            if(item && !this.selectOption.multiple){
                this.selectedKey = item.key
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



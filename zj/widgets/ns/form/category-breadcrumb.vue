<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <el-breadcrumb class="breadcrumb-box" separator="/">
                <el-breadcrumb-item
                    :key="item.key"
                    v-for="item in items"
                >
                    <span @click="onItemClick(item)">{{item.name}}</span>
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/category-breadcrumb"

export default {
    mixins: [FormBase],
    uiRegister(context) {
        // 注册组件，绑定生成对应conf、tpl
        context[uiType] = this
    },

    uiGenConf(options) {
        /*
          生成
          options:
            label
            watchVar: {
                name: xxxx
            }
            remote:
            onRemoteChange:
        */
        let conf = {
            uiType,
            label: "",
            data: {},
            value: ""
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-category-breadcrumb name="${name}"></ns-category-breadcrumb>`
    },
    
    computed:{
        label(){
            return this.nsget("label")
        },
        items(){
            let items = this.nsget("data.result", [])
            let lastItem = _.last(items)
            if(lastItem) lastItem.isLast = true
            return items
        }
    },

    methods: {
        readyCreated(){
            this.nswatchVar( (name, key) =>{
                this.nsset("value", key)
                this.loadDataFromRemote()
            })

            this.nswatch("/rootCategory", (rootCategory)=>{
                let key = _.get(rootCategory, "key")
                if(key){
                    this.updatePath(key)
                }
            }, {firstCall: true})
        },
        onItemClick(item){
            if(item.isLast) return
            this.updatePath(item.key)
        },
        updatePath(key){
            this.nssetVar(key)
        }
    }
}
</script>

<style lang="less">
    .breadcrumb-box{
        line-height: 24px;
        span{font-size: 15px;}
        .el-breadcrumb__item__inner, .el-breadcrumb__item__inner a{
            color: #279fff;
        }
        .el-breadcrumb__item:last-child .el-breadcrumb__item__inner{
            color: #7b818a;
        }
    }
    
</style>

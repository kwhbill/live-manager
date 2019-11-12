<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <el-breadcrumb class="breadcrumb-box" separator="/">
                <el-breadcrumb-item
                    :key="item.id"
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
let uiTag = "area-breadcrumb"
let uiType = `form/${uiTag}`

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
            value: 0
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        let tag = `ns-${uiTag}`
        return `<${tag} name="${name}"></${tag}>`
    },
    
    computed:{
        label(){
            return this.nsget("label")
        },
        items(){
            let items = this.nsget("data.result", [])
            let firstItem = {
                id: 0,
                name: "项目整体"
            }
            items = _.concat([firstItem], items)
            let lastItem = _.last(items)
            if(lastItem) lastItem.isLast = true
            return items
        }
    },

    methods: {
        readyCreated(){
            this.nswatchVar( (name, id) =>{
                this.nsset("value", id)
                if(id == 0){ // 返回项目整体，无需网络请求
                    this.nsset("data.result", [])
                    return
                }
                this.loadDataFromRemote()
            })
        },
        onItemClick(item){
            if(item.isLast) return
            this.updatePath(item.id)
        },
        updatePath(id){
            this.nssetVar(id)
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

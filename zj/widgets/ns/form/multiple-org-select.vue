<template>
    <div class="cell select-box">
        <div class="form-label">
            <span><i class="required-font" v-show="required">* </i>{{label}}</span>
            <div class="org-select-box">
                <el-select v-model="selectedScopeType" class="type-select">
                    <el-option
                    v-for="scopeType in scopeTypes"
                    :key="scopeType.value"
                    :label="scopeType.name"
                    :value="scopeType.value"
                    ></el-option>
                </el-select>
                <el-select class="content-select" v-model="selectedIds" filterable multiple placeholder="请选择" v-if="selectedScopeType=='PROJ'">
                    <el-option-group
                    v-for="team in teams"
                    :key="team.id"
                    :label="team.name">
                    <el-option
                        v-for="item in team.projs"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                    </el-option-group>
                </el-select>
                <el-select class="content-select" v-model="selectedIds" filterable multiple placeholder="请选择" v-if="selectedScopeType=='TEAM'">
                    <el-option
                        v-for="item in teams"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/multiple-org-select"

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
            level:  group | team // 可显示层级
            remote:              // 远端接口
            onRemoteChange:
            required: false //是否必填
        */
        let conf = {
            uiType,
            data: {},
            level: "team",
            required: false
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-multiple-org-select name="${name}"></ns-multiple-org-select>`
    },

    data() {
        return {
            scopeTypes: [],
            selectedIds: [],
            selectedScopeType: "",
            teams: [],
            label: ""
        }
    },

    watch:{
        selectedScopeType(){
            this.selectedIds = []
        },
        selectedIds(ids){
            this.nsset("value", {
                scopeType: this.selectedScopeType,
                targetIds: ids
            })
        }
    },
    computed: {
        required(){
            return this.nsget("required",false)
        }  
    },
    methods: {
        readyCreated() {
            this.label = this.nsget("label")
            this.nswatch("data", (data)=>{
                this.teams = data.result
                this.buildScopeTypes()
            })

            this.loadDataFromRemote()
        },

        buildScopeTypes(){
            let level = this.nsget("level", "team")
            let scopeTypes = [
                {name: "项目对比", value: "PROJ"}
            ]
            if(level == "group"){
                scopeTypes.unshift({
                    name: "公司对比", value: "TEAM"
                })
            }

            this.scopeTypes = scopeTypes
            this.selectedScopeType = _.first(scopeTypes).value
        }
    }
}
</script>


<style lang="less">
    .select-box{
        width:100%;
        display: flex;
        .required-font{
            color: red;
            font-size:12px;
            font-style: normal;
            font-weight: normal;
        }
        .org-select-box{
            width:100%;
            flex:1;
            display: flex;
            .type-select{
                width: 130px;
                padding-right:10px;
            }
            .content-select{
                flex: 1;
            }
        }
    }
    
</style>


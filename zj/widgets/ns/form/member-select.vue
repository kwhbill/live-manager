<template>
    <div class="cell" :class="multiple? 'mul-role-select': ''">
        <div class="form-label">
            <span>{{label}}</span>
            <div class="role-select-box">
                <el-select class="role-select" v-model="selectedType">
                    <el-option
                        v-for="item in types"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select class="user-select" v-model="selectedId" filterable :placeholder="placeholder" :clearable="clearable" :multiple="multiple">
                    <el-option
                        v-for="item in items"
                        :key="item.id"
                        :label="item.realName"
                        :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </div>
    </div>
</template>


<script>
import FormBase from "./form-base"
let uiType = "form/member-select"

let memberModeMap = {
    "package": ["TOTAL_PACKAGE", "SUBCONSTRACTOR", "SUPERVISOR"],
    "workload": ["CHECKER", "REPAIRER"],
    "jobType": ["CHECKER", "WORKER", "SPOTCHECKER"]
}

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
            remote:              // 远端接口
            onRemoteChange:
            mode:                // 模式
            multiple:            // 多选
            palceholder
            clearable
            autoSelectedFirst   // 自动选取第一个
        */
        let conf = {
            uiType,
            mode: "package",  // package
            multiple: true,
            value: {
                type: null,
                id: []
            },
            data: {}
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-member-select name="${name}"></ns-member-select>`
    },

    data() {
        return {
            selectedType: null,
            selectedId: null,
            items: [],
            types: []
        }
    },

    watch:{
        selectedType(type){
            this.nsset("value.type", type)
            let multiple = this.multiple
            this.selectedId = multiple ? [] : null
            this.loadDataFromRemote()
        },
        selectedId(id){
            this.nsset("value.id", id)
        }
    },

    computed:{
        label(){
            return this.nsget("label")
        },
        placeholder(){
            return this.nsget("placeholder", "请选择人员")
        },
        clearable(){
            return this.nsget("clearable", false)
        },
        multiple(){
            return this.nsget("multiple", false)
        }
    },

    methods: {
        readyCreated() {
            let multiple = this.multiple
            let autoSelectedFirst = this.nsget("autoSelectedFirst")


            if(multiple){
                this.selectedId = []
            }

            this.nswatch("data", (data)=>{
                this.items = data.result

                if(autoSelectedFirst){
                    let id = _.get(this.items, "0.id")
                    this.selectedId = multiple ? [id] : id
                }
            })
    
            this.buildTypes()
        },

        buildTypes(){
            let mode = this.nsget("mode", "package")
            let types = memberModeMap[mode]
            this.types = _.map(types,  type =>{
                return {
                    value: type,
                    label: this.$t(`ns.members.${type}`)
                }
            })

            if(!this.selectedType) this.selectedType = _.first(types)
        }
    }
}
</script>


<style lang="less">
    
    .mul-role-select{
        width:100%;
        .role-select-box{
            display: flex;
            flex: 1;
            .role-select{
                width: 150px;
                margin-right: 10px;
            }
            .user-select{
                flex: 1;
            }
        }
        .form-label{
            position: relative;
            display: flex;
        }
        
        
    }
    
    
    
</style>


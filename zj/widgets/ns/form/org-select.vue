<template>
    <div class="cell select-box" :class="multiple? 'mul-select-box': ''">
        <div class="form-label">
            <span><i class="required-font" v-show="required">* </i>{{label}}</span>
            <div class="org-select-box">
                <el-select v-model="selectedId" filterable :placeholder="placeholder" :clearable="clearable" :multiple="multiple">
                    <el-option
                        v-for="item in items"
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
let uiType = "form/org-select"

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
            autoSelectedFirst: boolean
            remote:              // 远端接口
            onRemoteChange:
            clearable: //是否添加清除图标，默认不添加
            multiple: //是否多选，默认单选
        */
        let conf = {
            uiType,
            data: {}
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-org-select name="${name}"></ns-org-select>`
    },

    data() {
        return {
            selectedId: null,
            items: [],
            label: "",
            placeholder: "",
            clearable: false,
            multiple: false
        }
    },
    computed: {
        required(){
            return this.nsget("required",false)
        }  
    },
    watch:{
        selectedId(id){
            this.nsset("value", id)
        }
    },

    methods: {
        readyCreated() {
            this.label = this.nsget("label")
            this.placeholder = this.nsget("placeholder", "请选择")
            this.clearable = this.nsget("clearable", false)
            this.multiple = this.nsget("multiple", false)
            let autoSelectedFirst = this.nsget("autoSelectedFirst")

            let multiple = this.multiple
            if(multiple){
                this.selectedId = []
            }

            this.nswatch("data", (data)=>{
                this.items = data.result

                if(autoSelectedFirst){
                    this.selectedId = _.get(this.items, "0.id")
                    if(multiple) this.selectedId = [this.selectedId]
                }
            })
            

            this.loadDataFromRemote()
        }
    }
}
</script>




<style lang="less">
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


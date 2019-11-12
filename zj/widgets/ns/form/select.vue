<template>
    <div class="cell">
        <div class="form-label">
            <span><i class="required-font" v-show="required">* </i>{{label}}</span>
            <el-select v-model="selectedValue" :placeholder="placeholder">
                <el-option v-for="item in items" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/select"

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
            .defaultSelectedValue: // 默认选中value
            .transformItems(data): => return items: [{labek, value}, ...]
        */
        let conf = {
            uiType,
            defaultSelectedValue: "",
            value: null,
            data: {}
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-select name="${name}"></ns-select>`
    },

    data() {
        return {
            placeholder: "",
            selectedValue: null,
            items: [],
            label: '',
            data: {}
        }
    },

    watch: {
        selectedValue(v) {
            this.nsset("value", v)
            this.nssetVar(v)
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
                this.onDataChange(data)
            })

            let nvList = this.nsget("nameValues")
            if(nvList){
                this.nsset("data", nvList)
            }

            this.loadDataFromRemote()
        },

        onDataChange(data){
            let transformItems = this.nsget("transformItems")
            if(_.isFunction(transformItems)){
               this.items = _.bind(transformItems, this)(data)
            }else{
                this.items = _.map(data, ([name, value]) => {
                    return {
                        label: name,
                        value
                    }
                })
            }

            let defaultSelectedValue = this.nsget("defaultSelectedValue")
            if (!_.isNil(defaultSelectedValue)) {
                if(defaultSelectedValue == "#FIRST"){
                    defaultSelectedValue = _.get(this.items, "0.value")
                }
                this.selectedValue = defaultSelectedValue
            }
        }
    }
}
</script>

<style lang="less">
    .required-font{
        color: red;
        font-size:12px;
        font-style: normal;
        font-weight: normal;
    }

</style>
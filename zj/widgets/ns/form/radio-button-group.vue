<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <el-radio-group v-model="selectedValue" style="margin-bottom: 15px;">
                <el-radio-button :label="item.value" v-for="item in items" :key="item.value">
                    {{item.label}}
                </el-radio-button>
            </el-radio-group>
        </div>
    </div>
    
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/radio-button-group"

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
            .defaultSelectedValue: // 默认选中名称，参考 daysMap
            .label: 
            .nameValues: [] //列表
        */
        let conf = {
            uiType,
            defaultSelectedValue: "0",
            label: '',
            nameValues: []

        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-radio-button-group name="${name}"></ns-radio-button-group>`
    },

    data() {
        return {
            selectedValue: "",
            items: [],
            label: ""
        }
    },

    watch: {
        selectedValue(val) {
            this.nsset("value", val)
            this.nssetVar(val)
        }
    },

    methods: {
        readyCreated() {
            this.label = this.nsget("label", "")
            let nvList = this.nsget("nameValues")

            this.items = _.map(nvList, ([name, value]) => {
                return {
                    label: name,
                    value
                }
            })

            let defaultSelectedValue = this.nsget("defaultSelectedValue")

            if (!_.isNil(defaultSelectedValue)) {
                this.selectedValue = defaultSelectedValue
            }
        }
    }
}
</script>




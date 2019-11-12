<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <div class="org-select-box">
                <el-input type="primary" v-model="value" :placeholder="placeholder">
                </el-input>
            </div>
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/input"

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
            .label: // 按钮文本
            .placeholder: // 占位提示
        */
        let name = options.label
        let conf = {
            uiType,
            label: "",
        }
        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-input name="${name}"></ns-input>`
    },

    data() {
        return {
            value: "",
            label: "",
            placeholder: ""
        }
    },

    watch:{
        value(v){
            this.nsset("value", v)
        }
    },

    methods: {
        readyCreated() {
            this.label = this.nsget("label")
            this.placeholder = this.nsget("placeholder", "请输入")
            this.value = this.nsget("value")
        }
    }
}
</script>




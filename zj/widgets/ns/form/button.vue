<template>
    <div class="cell">
        <el-button type="primary" @click="onClick" >
            <i :class="icon"></i>
            {{label}}
        </el-button>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/button"

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
            .icon: // 图表
            .onClick: // 点击回调方法
        */
        let name = options.label
        let conf = {
            uiType,
            label: "",
            icon: ""
        }
        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-button name="${name}"></ns-button>`
    },

    data() {
        return {
            label: "",
            icon: "",
            isLoading: false
        }
    },

    methods: {
        readyCreated() {
            this.label = this.nsget("label")
            this.icon = this.nsget("icon", "")
            this.nswatchVar((name, v) => {
                this.isLoading = !!v
            })
        },

        onClick(){
            let callback = this.nsget("onClick", _.noop)
            _.bind(callback, this)()
        }
    }
}
</script>




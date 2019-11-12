<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <el-switch
                v-model="selectedValue"
                @change= "onChange"
                on-text=""
                off-text="">
                </el-switch>
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/switch"

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
            .label: // 文本
            .onChange: // 变化回调方法
            .watchVar: //监听的变量
            .defaultValue: //默认选中值
            .value: //选中的值
        */
        let name = options.label
        let conf = {
            uiType,
            label: "",
            value: true
        }
        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-switch name="${name}"></ns-switch>`
    },

    data() {
        return {
            label: "",
            selectedValue: true
        }
    },
    watch: {
        selectedValue(val) {
            this.nsset("value",val)
            this.nssetVar(val)
        }
    },
    methods: {
        readyCreated() {
            this.label = this.nsget("label")
            this.selectedValue = this.nsget("defaultValue", true)
        },
        onChange(status){
            let callback = this.nsget("onChange", _.noop)
            _.bind(callback, this)(status)
        }
    }
}
</script>
<style lang="less">
    .form-row .cell .el-switch .el-switch__button{
        margin-top: 0!important;
    }

</style>




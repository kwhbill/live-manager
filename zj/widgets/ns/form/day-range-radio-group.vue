<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <el-radio-group v-model="selectedName">
                <el-radio-button :label="item.name" v-for="item in items" :key="item.name">
                    {{item.label}}
                </el-radio-button>
            </el-radio-group>
        </div>
    </div>
    
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/day-range-radio-group"

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
            .defaultSelectedName: // 默认选中名称，参考 daysMap
        */
        let conf = {
            uiType,
            defaultSelectedName: "0",
            value: {}
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-day-range-radio-group name="${name}"></ns-day-range-radio-group>`
    },

    data() {
        let daysMap = {
            "0": ["今天", [0, 0]],
            "1": ["昨天", [-1, -1]],
            "7": ["近7天", [-6, 0]],
            "30": ["近30天", [-29, 0]],
            "90": ["近90天", [-89, 0]],
            "365": ["近一年", [-365, 0]]
        }
        let items = _.map(daysMap, ([label], name) => {
            return { label, name }
        })

        return {
            selectedName: "",
            daysMap,
            items,
            label: ""
        }
    },

    watch: {
        selectedName(name) {
            if (!name) return
            let v = this.daysMap[name]
            this.nsset("value", {
                deltaDaysMin: v[1][1],
                deltaDaysMax: v[1][0]
            })
        }
    },

    methods: {
        readyCreated() {
            this.label = this.nsget("label")
            let defaultSelectedName = this.nsget("defaultSelectedName")
            if (defaultSelectedName) {
                this.selectedName = defaultSelectedName
            }
        }
    }
}
</script>




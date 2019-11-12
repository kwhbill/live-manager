<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <el-date-picker
            v-model="selectedDates"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            :clearable="false"
            :editable="false"
            :picker-options="pickerOptions">
            </el-date-picker>
        </div>
    </div>
    
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/day-range-select"


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
            .defaultSelectedDates: // 默认选择日期（以相对今天的天数差表示），无则以[0,0]代替
            .shortcuts: // 快捷选择列表，没有则以组件 defaultShortcurts 取代
            .disabledDate: // 禁止选择的日期方法，默认为超过今天
        */
        let conf = {
            uiType,
            value: {}
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-day-range-select name="${name}"></ns-day-range-select>`
    },

    data() {
        return {
            selectedDates: [],
            pickerOptions: [],
            label: ""
        }
    },

    watch: {
        selectedDates(dates) {
            this.nsset("value", {
                deltaDaysMin: zj.utils.dateToDelta(dates[0]),
                deltaDaysMax: zj.utils.dateToDelta(dates[1])
            })
        }
    },

    methods: {
        readyCreated() {
            let defaultShortcurts = [
                [zj.t('ns.days.today'), [0, 0]],
                [zj.t('ns.days.yesterday'), [-1, -1]],
                [zj.t('ns.days.last_x_days',7), [-6, 0]],
                [zj.t('ns.days.last_x_days',30), [-29, 0]],
                [zj.t('ns.days.last_x_days',90), [-89, 0]],
                [zj.t('ns.days.this_year'), [-365, 0]]
            ]

            let shortcuts = this.nsget("shortcuts", defaultShortcurts)
            let disabledDate = this.nsget("disabledDate", this.disabledDate)
            let defaultSelectedDates = this.nsget("defaultSelectedDates", [0,0])

            this.pickerOptions = this.buildPickerOptions(shortcuts, disabledDate)
            this.label = this.nsget("label")
            this.selectedDates = [
                zj.utils.deltaToDate(defaultSelectedDates[0]),
                zj.utils.deltaToDate(defaultSelectedDates[1])
            ]
        },
        buildPickerOptions(shortcuts, disabledDate){
            return {
                disabledDate,
                shortcuts: _.map(shortcuts, (shortcut)=>{
                    return {
                        text: shortcut[0],
                        onClick(picker){
                            let dateRange = shortcut[1]
                            picker.$emit(
                                "pick",
                                [
                                    zj.utils.deltaToDate(dateRange[0]),
                                    zj.utils.deltaToDate(dateRange[1]),
                                ]
                            )
                        }
                    }
                })
            }
        },
        disabledDate(date){
            let today = zj.utils.deltaToDate()
            date = zj.utils.beginOfDate(date)
            return date > today
        }
    }
}
</script>




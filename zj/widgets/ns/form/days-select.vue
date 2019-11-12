<template>
    <div class="cell">
        <div class="form-label">
        <span>{{label}}</span>
        <el-select v-model="selectedValue" filterable placeholder="请选择">
            <el-option-group v-for="group in groups" :key="group.name" :label="group.name">
                <el-option v-for="item in group.items" :key="item.value" :label="item.name" :value="item.value">
                </el-option>
            </el-option-group>
        </el-select>
        </div>
    </div>
    
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/days-select"

let daysMap = {
    day: [7,14,30],
    week: [4,12],
    month: [6,12],
    quarter: [4,12],
    year: [3]
}
let daysGradingMap = {
    week: [1,-1],
    month: [1,-1],
    quarter: [1],
    year: [1]
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
            pattern: 'grading'//显示的形式,grading为时间粒度（本周模式）,duration为时间长度（近7天模式），默认为时间长度
        */
        let conf = {
            uiType,
            data: {},
            value: null
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-days-select name="${name}"></ns-days-select>`
    },

    data() {
        return {
            selectedValue: "day-",
            groups: [],
            label: '',
            isGrading: false,
            valueMap: {}
        }
    },

    watch: {
        selectedValue(v) {
            let valueMap = this.valueMap
            let max = valueMap[v]["timeFrameMax"]
            valueMap[v]["timeFrameMax"] = Math.abs(max)
            this.nsset("value", valueMap[v])
        }
    },

    methods: {
        readyCreated() {
            this.label = this.nsget("label")
            this.isGrading = this.nsget("pattern") == "grading"
            
            let selectedValue = false
            let dayMap = _.cloneDeep(daysMap)
            if( this.isGrading ) dayMap = _.cloneDeep(daysGradingMap)
            this.groups = _.map(dayMap, (items, unit)=>{
                    return {
                        name: this.$t(`ns.days.${unit}`),
                        items: _.map(items, (v)=>{
                            let maxNum = v
                            let name = this.$t(`ns.days.recent_${unit}`, [v])
                            let timeFrameEnd = null
                            if( this.isGrading ) {
                                let tmpl = ``
                                if(_.toNumber(maxNum)<0){
                                    tmpl = `prev_`
                                    timeFrameEnd = this.getEndDate(unit)
                                }
                                name = this.$t(`ns.days.grading_${tmpl}${unit}`)
                            }
                            let valueKey = `${unit}-${maxNum}`
                            this.valueMap[valueKey] = {
                                    timeFrameType: _.upperCase(unit),
                                    timeFrameMax: maxNum,
                                    timeFrameEnd
                            }

                            if(!selectedValue) selectedValue = valueKey

                            return {
                                name,
                                value: valueKey
                            }
                        })
                    }
                })
            this.selectedValue = selectedValue
        },
        getEndDate(type){
            switch (type) {
                case "week":
                    return this.getLastWeekDate()
                case "month":
                    return this.getLastMonthEndDate()
                default:
                    break;
            }
        },
        getLastWeekDate(){
            let now=new Date();
            let date=now.getDate();//今天是这个月的第几天
            let day=now.getDay(); //今天是这周的第几天
            //判断是否为周日,如果为周日，那么就是这周第7天
            day = day == 0 ? 7 : day
            let diffDate = date - day //上周日是这个月的第几天
            return zj.utils.dateToString(now.setDate(diffDate ))

      },
      getLastMonthEndDate(){
            return zj.utils.dateToString(new Date().setDate(0))
      }
    }
}
</script>

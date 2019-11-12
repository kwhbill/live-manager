<template>
    <div class="container">
        <header>本{{timeTypeLabel}}关键指标</header>
        <main>
            <div v-for="item in items" :key="item.indicator">
                <div class="indicator-box">
                    <div class="content">
                        <p> {{item.label}} </p>
                        <h6>{{ addExtra(item.nowData, item.extra) }} </h6>
                    </div>
                    <div class="addition" v-if="avgLevel">
                        <p>
                            <span>{{`${$t('ns.comparator.compared_to')}${avgLevelLabel}`}}</span>
                            <span>{{ addExtra(item.avgData, item.extra) }}</span>
                            <span>
                                <i :class="item.avgDiff<0? 'redFont':'greenFont'" v-html="addExtra( item.avgDiff,item.extra, true)"></i>
                            </span>
                        </p>
                    </div>
                    <div class="addition">
                        <p>
                            <span>{{`${$t('ns.comparator.compared_to_last')}${timeTypeLabel}`}}</span>
                            <span>{{ addExtra(item.lastData, item.extra) }}</span>
                            <span >
                                <i :class="item.lastDiff<0? 'redFont':'greenFont'" v-html="addExtra( item.lastDiff,item.extra, true)"></i>
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
import ViewBase from "./view-base"
let uiType = "view/indicator-compare-panel"

export default {
    mixins: [ViewBase],

    uiRegister(context) {
        // 注册组件，绑定生成对应conf、tpl
        context[uiType] = this
    },

    uiGenConf(options) {
        /*
          生成
          options:
            nameValues:[[name,key,extra]] // 显示的名字和获取的字段
            source: "aaaa"  // 监听的 source name
            timeType: "week"  // week month
            avgLevel: "team"  // team group
            onSourceChange(data){}  // callback, 数据预处理
        */
        let name = options.label
        let conf = {
            uiType,
            timeType: "week", // week month
            avgLevel: "",  // team group
            nameValues: [],
            source: "",

        }
        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-indicator-compare-panel name="${name}"></ns-indicator-compare-panel>`
    },

    data() {
        return {
            nameValuesArr: [],
            items: []
        }
    },
    watch: {
        
    },
    computed: {
        avgLevel(){
            return this.nsget("avgLevel")
        },
        avgLevelLabel(){
            return this.$t(`ns.orgs.${this.avgLevel}`)
        },
        timeType(){
            return this.nsget("timeType")
        },
        timeTypeLabel(){
            return this.$t(`ns.days.${this.timeType}`)
        }
    },
    methods: {
        readyCreated() {
            let nvList = this.nsget('nameValues')
            this.nameValuesArr = _.map(nvList, ([label, value, extra]) => {
                return {
                    label,
                    value,
                    extra
                }
            })
        },
        onSourceChange(data){
            let callback = this.nsget("onSourceChange")
            if(callback){
                _.bind(callback, this)(data)
            }
            this.items = _.map(this.nameValuesArr, (nameValue) => {
                return this.getIndicatorInfo(nameValue , data)
            })
        },
        getIndicatorInfo(nameValue, data){
            let items = _.sortBy(_.get(data, "result.items"), 'timeFrameIdx'),
                indicator = _.get(nameValue, 'value'),
                extra = _.get(nameValue, 'extra', '');


            let nowData = _.get(_.last(items), indicator),
                lastData = _.get(_.first(items), indicator),
                lastDiff = _.round(_.subtract(nowData, lastData), 2);

            let avgItems = _.sortBy(_.get(data, `result.extra.${this.avgLevel}Avgs`), 'timeFrameIdx'),
                avgData = _.get(_.last(avgItems), indicator),
                avgDiff = _.round(_.subtract(nowData, avgData), 2);

            return {
                label: _.get(nameValue, 'label'),
                indicator,
                extra,
                nowData,
                lastData,
                lastDiff: lastDiff ? lastDiff : '-',
                avgData,
                avgDiff: avgDiff ? avgDiff : '-'
            }
        },
        addExtra(data, extra, isNeedSymbol){
            if(data == '-') return data
            if(data>0 && isNeedSymbol) data = `+${data}`
            return data + extra
        }
    }
}
</script>

<style lang="less" scoped>
    @baseColor: #ccc;
    .container{
        border: 1px solid @baseColor;
        margin-bottom: 30px;
        header {
            background: #f2f2f2;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            padding-left: 15px;
            border-bottom: 1px solid @baseColor;
        }
        main {
            display: flex;
            
            &>div{
                flex: 1;
                padding-bottom: 10px;
                position: relative;
                overflow: hidden;
                height: 150px;
                .indicator-box{
                    position: absolute;
                    left: 0;
                    top: 50%;
                    width: 100%;
                    margin-top: -80px;
                }
                &:not(:last-of-type){
                    border-right: 1px solid @baseColor;
                }
                .content{
                    text-align: center;
                    h6 {
                        font-size: 20px;
                        margin: 0;
                        text-align: center;
                    }
                    p {
                        margin: 15px 0 6px;
                        font-size: 16px;
                    }
                }
                .addition{
                    margin-bottom: 15px;
                    p {
                        display: flex;
                        &:not(:last-of-type){
                            text-align: center;
                        }
                        margin: 0;
                        margin-top:10px;
                        overflow: hidden;
                        .diffFont{
                            color: #98c379;
                        }
                        .down{
                            color: #e06c75;
                        }
                        span {
                            // float: left;
                            flex: 1;
                            font-size: 14px;
                            // padding-left:17px;
                            &:nth-of-type(1){
                                text-indent: 1em;
                                // width: 160px;
                            }
                            &:nth-of-type(2){
                                text-align: center;
                                // width: 120px;
                            }
                            &:nth-of-type(3){
                                text-align: center;
                                
                                // width: 62px;
                            }
                            i {
                                font-style: normal;
                                &.redFont {
                                    color: red;
                                }
                                &.greenFont{
                                    color: green;
                                }
                            }
                        }
                    }
                    
                }
                
                
            }
        }
    }
</style>




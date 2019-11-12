<template>
   <div class="chart-box">
       <div class="head" v-if="label">{{label}}</div>
       <div class="chart-content-box">
           <div class="desc-box" v-if="descs">
               <ul class="list"  >
                    <li v-for="item in descs" :key="item.name">
                        <i>{{item.name}} </i>
                        <span>{{item.desc}}</span>
                    </li>
                </ul>
           </div>
            
            <div class="chart" ref="chart"></div>
       </div>
       <div class="no-data" v-show="!hasData">{{$t('ns.pub.no_data')}}</div>
       
   </div>

</template>

<script>
import ViewBase from "../view-base"
import BarRender from "./render_bar"
import LineRender from "./render_line"
import PieRender from "./render_pie"
import MapRender from "./render_map"

import echarts from "echarts"

let uiType = "view/chart"

let renderMap = {
    "line": LineRender,
    "bar": BarRender,
    "pie": PieRender,
    "map": MapRender
}

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
            source: "aaaa"  // 监听的 source name

        */
        let conf = {
            uiType,
            source: ""
        }

        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-chart name="${name}"></ns-chart>`
    },

    data(){
        return {
            chartType: null,
            _chartInst: null,
            descs: null,
            hasData: false
        }
    },
    computed:{
        label(){
            return this.nsget("label")
        }
    },
    methods:{
        ensureChartInst(){
            if(!this._chartInst){
                let chartNode = this.$refs.chart
                this._chartInst = echarts.init(chartNode)
            }
            this._chartInst.clear()
            if(this.descs){
                this._chartInst.resize({
                    width:document.body.clientWidth/2
                })
            }
            
        },
        onSourceChange(data){
            let chartType = _.bind(this.nsget("chartType"), this)()
            let legends = _.bind(this.nsget("legends", _.noop), this)(data)
            let xAxis = _.bind(this.nsget("xAxis", _.noop), this)(data)
            // 描述信息,一般 pie chart 用
            let descs = _.bind(this.nsget("descs", _.noop), this)(data)
            let series = _.bind(this.nsget("series"), this)(data, {chartType, legends, xAxis, descs})
            let isLabelRotate =this.nsget("isLabelRotate")? _.bind(this.nsget("isLabelRotate"), this)(): false
            if(_.isEmpty(series) || _.isEmpty(_.get(series, '0.data'))){
                this.hasData = false
                return 
            }


            let sortRule = this.nsget("sortRule")
            if(_.isFunction(sortRule)){
                sortRule = _.bind(sortRule, this)()
            }
            
            this.descs = descs
            this.ensureChartInst()
            let render = renderMap[chartType]

            render(this._chartInst, {legends, xAxis, series, sortRule,isLabelRotate})
            this.hasData = true
            
        }
    }
}
</script>

<style lang="less">
.chart-box{
    border: 1px solid #dfe6ec;
    position: relative;
    .head{
        background: #f2f2f2;
        padding: 5px  10px;
    }
    .chart-content-box{
        width: 100%;
        display: flex;
        overflow: hidden;
        .desc-box{
            flex: 1.3;
            border-right: 1px solid #dfe6ec;
            min-height: 500px;
            margin: 0 -1px 0 0;
            padding: 0 20px;
            .list{
                margin-top: 20px;
                vertical-align: middle;
                list-style: none;
                padding: 0 20px;
                li{
                    display: flex;
                    line-height: 38px;
                    i{
                        flex: 1;
                        text-align: left;
                        color: #333;
                        font-style: normal;
                    }
                    span{
                        flex: 1;
                        text-align: right;
                        color: #999;
                    }
                }
            }
        }
        
        .chart {
            flex: 1;
            min-height: 500px;
        }
    }
    .no-data {
        min-height: 500px;
        text-align: center;
        line-height: 500px;
        width: 100%;
        color: #5e7382;
        font-size: 14px;
        position: absolute;
        left: 0;
        top: 0;
        z-index: 3;
        background: #fff;
    }
}


</style>

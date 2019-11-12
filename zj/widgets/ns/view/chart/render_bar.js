import colors from "./colors"

function sortChartInfo(chartInfo){
    let {xAxis, seriesData, sortRule} = chartInfo
    let items = _.map(seriesData, (v, i)=>{
        return {
            n: xAxis[i],
            v
        }
    })

    let [sortBy, sortOrder] = sortRule

    let sortKey = sortBy == "name" ? "n" : "v"
    items.sort((a, b)=>{
        if(sortKey == "n"){
            return a.n.localeCompare(b.n, "zh-Hans-CN", {sensitivity: "accent"})
        }else{
            return a.v - b.v
        }
    })

    if(sortOrder == "desc"){
        items = _.reverse(items)
    }
    
    chartInfo.xAxis = _.map(items, "n")
    chartInfo.seriesData = _.map(items, "v")
}

export default function(chart, {legends, xAxis, series, sortRule, isLabelRotate}){
    // 需要排序，仅支持一个legend
    if(sortRule){
        let chartInfo = {
            xAxis,
            seriesData: _.get(series, "0.data"),
            sortRule
        }
        sortChartInfo(chartInfo)
        xAxis = chartInfo.xAxis
        _.set(series, "0.data", chartInfo.seriesData)
    }

    _.each(series, serie =>{
        if(!serie.barMaxWidth){
            serie.barMaxWidth = 60
        }
        if(serie.barWidth){
            delete serie.barWidth
        }
    })
    let  axisLabelOption= {}
    if(isLabelRotate){
        axisLabelOption = {
            interval:0,
            rotate:45,//倾斜度 -90 至 90 默认为0
            margin:2,
            textStyle:{
                fontWeight:"bolder",
                color:"#000000"
            }
        }
    }
    let datas = _.get(_.head(series),'data',[])
    let option = {
        color: colors,
        grid: {
            top: "10%",
            left: "2%",
            right: "8%",
            bottom: "10%",
            containLabel: true
        },
        tooltip: {
            trigger: "axis"
        },
        xAxis: {
            type: "category",
            data: xAxis,
            axisLabel: axisLabelOption
        },
        yAxis: {
            type: "value"
        },
        legend: {
            type: 'scroll',
            data: _.map(legends, (legend)=>{ return legend.label })
        },
        dataZoom: [
            {
                type: "slider",
                show: true,
                xAxisIndex: [0],
                start:0,
                end: (100/(datas.length)*6),
            }
        ],
        series
    }
    chart.setOption(option)
}
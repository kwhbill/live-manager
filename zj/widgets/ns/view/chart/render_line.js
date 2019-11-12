import colors from "./colors"

export default function(chart, {legends, xAxis, series, isLabelRotate}){
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
    let margin = "4%"
    let option = {
        color: colors,
        grid: {
            top: "10%",
            left: "2%",
            right: margin,
            bottom: margin,
            containLabel: true
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: "category",
            data: xAxis,
            axisLabel: axisLabelOption
        },
        yAxis: {
            min:'dataMin',
            max:'dataMax',
            type: "value"
        },
        legend: {
            type: 'scroll',
            data: _.map(legends, (legend)=>{ return legend.label })
        },
        series
    }
    window.option = option
    chart.setOption(option)
}
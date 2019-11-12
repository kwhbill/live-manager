import colors from "./colors"

export default function(chart, {series}){
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
        tooltip : {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series
    }
    chart.setOption(option)
}
import echarts from "echarts"

let chinaJson = null 



async function  loadChinaJson(){
    let res = await zj.net.request({
        url: "/public/zj/assets/map/china.json"
    })
    chinaJson = res.data
    echarts.registerMap("china", chinaJson)
    
}

export default async function(chart, {legends, series}){
    if(!chinaJson){
        await loadChinaJson()
    }

    let fnVmArgValue = (item)=>{
        return item.value[2]
    }

    let vmArgs = [series[0].data, fnVmArgValue]
    let vmMin = fnVmArgValue(_.minBy(...vmArgs))
    let vmMax = fnVmArgValue(_.maxBy(...vmArgs))

    let option = {
        backgroundColor: "#404a59",
        tooltip: {
            trigger: "item",
            formatter: function (params) {
                return params.name + " : " + params.value[2]
            }
        },
        visualMap: {
            min: vmMin,
            max: vmMax,
            calculable: true,
            inRange: {
                color: ["#50a3ba", "#eac736", "#d94e5d"]
            },
            textStyle: {
                color: "#fff"
            }
        },
        geo: {
            map: "china",
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: "#323c48",
                    borderColor: "#111"
                },
                emphasis: {
                    areaColor: "#2a333d"
                }
            }
        },
        series
    }


    chart.setOption(option)
}
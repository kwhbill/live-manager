<template>
    <div>
        <div class="heatmap-legends">
            <span class="task-no"></span>
            <span class="desc">{{$t('ns.task_status.no_task')}}</span>

            <span class="task-ready"></span>
            <span class="desc">{{$t('ns.task_status.not_started')}}</span>

            <span class="task-ing"></span>
            <span class="desc">{{$t('ns.task_status.being_contructed_inspected')}}</span>

            <span class="task-finish"></span>
            <span class="desc">{{$t('ns.task_status.completed')}}</span>
        </div>
        <div class="heatmap-nodata" v-show="columns.length <= 1">{{$t('ns.task_status.no_data')}}</div>
        <div class="heatmap" v-show="columns.length > 1">
            <div class="fixed">
                <div class="column">
                    <div class="cell-head">
                        <span>
                            {{fixedColumn.name}}
                        </span>
                    </div>
                    <div class="cell" v-for="(node, i) in tree" :key="i">
                        <span>
                        {{node.name}}
                        </span>
                    </div>
                </div>
            </div>
            <div class="table">
                <div class="column" v-for="column in contentColumns" :key="column.key">
                    <div class="cell-head" @click="onCellClick(column)">
                        <span class="link">
                            {{column.name}}
                        </span>
                    </div>
                    <div class="cell" v-for="(node, i) in tree" :key="i">
                        <el-tooltip transition="zoom-in-bottom" :open-delay="100" class="item" effect="dark" :content="info.name" placement="top-start" v-for="(info, j) in cellStates(column, node)" :key="`${i}-${j}`">
                            <span :class="info.state"></span>
                        </el-tooltip>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import ViewBase from "./view-base"
let uiType = "view/heatmap"

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
        return `<ns-heatmap name="${name}"></ns-heatmap>`
    },

    data(){
        return {
            tree: [],
            columns: [],
            nodeMap: {}
        }
    },
    computed:{
        fixedColumn(){
           return _.get(this.columns, "0", {
               name: "未定义",
               key: ""
           })
        },
        contentColumns(){
            return _.slice(this.columns, 1)
        }
    },
    methods:{
        cellStates(column, pnode){
            let children = _.isEmpty(pnode.children) ? [pnode] : pnode.children
            return _.map(children, node =>{
                return {
                    state:  `task-${this.cellState(column, node)}`,
                    name: node.name
                }
            })
        },

        cellState(column, node){
            let cKey = column.key 
            let state = _.get(node, ["columnStateMap", cKey], "no")
            if(state) return state
            if(node.isRoot) return "no"
            return this.cellState(column, node.parent)
        },

        onCellClick(column){
            let resolve = this.nsget("onCellClick")
            if(resolve){
                _.bind(resolve, this)(column)
            }
        },


        buildMap(data){
            let build = this.nsget("buildMap")
            if(!_.isFunction(build)) return
            let {columns, tree, nodeMap} = _.bind(build, this)(data)
            this.nodeMap = nodeMap
            this.columns = columns
            this.tree = tree
        },

        onSourceChange(data){
            // fix: table data 变更，会渲染两次，并携带旧变量，延迟即可解决
            _.delay(()=>{
                this.buildMap(data)
            }, 0)
        },
    }
}
</script>


<style lang="less" scoped>

.cell-span(@height: 50px){
    height: @height;
    span {
        display: inline-block;
        padding: 5px 0 0 15px;

        &.link {
            cursor: pointer;
            color: #0288D1;
        }
    }
}

.task(@color: #EFEFEF){
    border: 1px solid #dfe6ec;
    background-color: @color;
    display: inline-block;
    height: 48px;
    width: 20px;
    padding: 0px !important;

    &:hover {
        border: 2px solid #F7BA2A;
        height: 46px;
        width: 18px;
    }
}

.task-no{
    .task(rgba(210,208,208,0.50))
}

.task-ready{
    .task(#FFFFFF)
    
}

.task-ing{
    box-shadow: 0 0 2px 0 #F8B84E;
    .task(#F8B84E)
}

.task-finish{
    box-shadow: 0 0 2px 0 #7BC827;
    .task(#69D196)
}

.heatmap-legends {
    overflow: hidden;
    margin-bottom: 20px;
    span{
        margin-right: 4px;
    }
    .task-no, .task-ready, .task-ing, .task-finish{
        float: left;
        width: 20px;
        height: 20px;
    }
    .desc{
        float: left;
        line-height: 20px;
        margin-right: 20px;
        margin-top: 3px;
    }
}

.heatmap-nodata {
    border: 1px solid #bfcbd9;
    line-height: 200px;
    text-align: center;
}

.heatmap{
    width: 100%;
    display: block;
    background-color: #CECECE;
    border: 1px solid #CECECE;

    .fixed{
        float: left;

        .cell {
            background-color: #ffffff;
        }
    }

    .table{
        margin-left: 100px;
        overflow: auto;
        white-space: nowrap;

        .column:not(last-child){
            margin-right: 15px;
        }
    }

    .column{
        display: inline-block;
        min-width: 100px;
        
        .cell-head{
            background-color: #CECECE;
            .cell-span(30px);
        }

        .cell {
            .cell-span(50px)
        }
    }    
}
</style>

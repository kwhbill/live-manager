<template>
    <el-table
      :fit="true"
      :data="rows"
      @header-click="onHeaderClick"
      @sort-change="onSortChange"
      v-loading="loading"
      style="width: 100%">
      <el-table-column v-for="column in columns" :key="columnKey(column)"
        :label="column.name"
        :render-header="renderHeader(column)"
        :fixed="column.fixed"
        :sortable="column.sortable"
        :prop="transType(column.key)"
        :min-width="column.width">
        <template slot-scope="scope">
            <render-cell :column="column" :row="scope.row" :table="table" @click.native.prevent="onCellClick(column, scope.row)"></render-cell>
        </template>
      </el-table-column>
    </el-table>
</template>


<script>
import ViewBase from "./view-base"
import RenderCell from "./render-cell"
let uiType = "view/table"

export default {
    mixins: [ViewBase],

    components: {
        RenderCell
    },

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
        return `<ns-table name="${name}"></ns-table>`
    },

    data() {
        return {
            columnMap: {},
            columns: [],
            rows: [],
            _rows: [],
            loading: false
        }
    },

    computed:{
        table(){
            return this
        }
    },

    methods: {
        columnKey(column){
            return `${column.key}|${column.name}}`
        },
        transType(key){
            return _.isString(key) ? key : _.toString(key)
        },
        readyCreated(){
            
        },
        transformColumn(column){
            if(!column.width){
                column.width = "130px"
            }
            if(column.sortable){
                column.sortable = "custom"
            }
            return column
        },

        onHeaderClick(column, event){
            column = this.columnMap[column.property]
            if(column && column.clickAble) this.onCellClick(column)  
        },

        renderHeader(column){
            let render = column.header || function(h){
                return (
                    <span>{column.name}</span>
                )
            }
            return _.bind(render, this)
        },

        buildColumns(data){
            let buildColumns = this.nsget("columns")
            if(buildColumns){
                let columns = _.bind(buildColumns, this)(data)
                let columnMap = {}
                this.columns = _.map(columns, (column)=>{
                    column = this.transformColumn(column)
                    columnMap[column.key] = column
                    return column
                })
                this.columnMap = columnMap
            }
        },

        onCellClick(column, row){
            let resolve = this.nsget("onCellClick")
            if(resolve){
                _.bind(resolve, this)(column, row)
            }
        },

        onSourceChange(data){
            this.buildColumns(data)
            // fix: table data 变更，会渲染两次，并携带旧变量，延迟即可解决
            _.delay(()=>{
                let dataToRows = this.nsget("dataToRows")
                let rows = []
                if(!dataToRows){
                    rows = data
                }else{
                    rows = _.bind(dataToRows, this)(data, {columns: this.columns})
                }
                if(rows){ //clone 为了强制刷新内容，即使内容一致
                    rows = _.clone(rows)
                }
                this.rows = rows
                this._rows = this.rows
            }, 0)
        },

        onSortChange(options){
            let {column, prop, order} = options
            if(!order){
                this.rows = _.clone(this._rows)
                return
            }

            let unsortRows = []
            let sortRows = []
            let key = prop 

            _.each(this.rows, (row)=>{
                let v = row[key];
                (v == "-" ? unsortRows : sortRows ).push(row)
            })

            sortRows.sort((a, b)=>{
                a = _.get(a, key)
                b = _.get(b, key)
                if(_.isString(a)){
                    return a.localeCompare(b, 'zh-Hans-CN', {sensitivity: 'accent'})
                }else{
                    return a - b
                }
            })

            if(order == "descending"){
                sortRows = _.reverse(sortRows)
            }

            this.rows = _.concat(sortRows, unsortRows)   
        }
    }
}
</script>
<style lang='less'>
    .cell-warning{
        display: block;
        color: #eb6767;
    }
    .cell-link{
        color: #20a0ff;
        cursor: pointer;
    }
    div.cell{
        span{
            cursor: default;
        }
    }
    .el-table .cell{
        line-height: 40px;
    }
</style>
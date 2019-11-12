<template>
<div class="zj-select-table">
    <el-row :gutter="20">
        <el-col :span="12" class="select-table-box" :class="{
          'select-table-large-box' : boxSize == 'large',
        }">
            <div class="view-header">
                {{title}}{{selectedItems.length}}
                <span class="btn" @click="clearSelectedItems" v-show="selectedItems.length">
                    <el-tooltip class="item" effect="dark" content="全部清空" placement="top">
                        <i class="icon-remove"></i>
                    </el-tooltip>
                </span>
            </div>
            <ul class="select-table" :style="{height: height}">
                <li v-for="(item, index) in selectedItems" :key="index" :title="item.label">
                    <i class="icon-check" style="float:left;margin-top:3px;"></i>
                    <span class="content" :title="item.label">

                        {{item.label}}
                    </span>
                    <span class="btn" @click="unselectedItem(item, index)">
                        <i class="icon-remove"></i>
                    </span>
                </li>
            </ul>
        </el-col>
        <el-col :span="12" class="select-table-box" :class="{
          'select-table-large-box' : boxSize == 'large',
        }">
            <div class="filter-header">
                <el-input v-model="filterStr" size="mini" placeholder="关键字过滤" icon="search">
                </el-input>
            </div>
            <ul class="select-table filter-table" :style="{height: height}">
                <li v-for="item in dataSource" :key="item.label" v-show="canShowItem(item)" @click="addItem(item)" :title="item.label">
                    <span class="content" :title="item.label">
                        {{item.label}}
                    </span>
                    <span class="btn">
                        <!-- <i class="icon-plus"></i> -->
                    </span>
                </li>
            </ul>
        </el-col>
    </el-row>
</div>
</template>

<script>
export default {
    name: 'select-table',
    props: {
        value: {
            type: Array,
            default(){
                return []
            }
        },
        source: {
            type: Array,
            default(){
                return []
            }
        },
        height: {
            type: String,
            default () {
                return '200px'
            }
        },
        title:{
          type: String,
          default () {
              return '已选项：'
          }
        },
        boxSize:{
          type: String,
          default () {
            return 'small'
          }
        },
    },

    watch: {
        value(newData,oldData){
            this.$emit('change',{newData:newData,oldData:oldData})
            this.updateWithValue(newData)
        },
        source(val){
          this.copySource()
        },
        dataSource(){
            this.updateWithDataSource()
        },
        selectedItems(newdata,olddata){
            let vs = _.map(this.selectedItems, (item)=>{
                return item.value;
            })
            if(this.updateSelKeys(vs)){

                this.$emit("input", vs)
            }

        }
    },

    data() {
        return {
            filterStr: '',
            selectedKeys: '',
            selectedItems: [],
            dataSourceMap: {},
            dataSource: []
        }
    },

    created(){
        this.copySource()
    },

    methods: {
        copySource(){
            this.dataSource = _.cloneDeep(this.source)
        },
        addItem(item){
            item._selected = true
            this.selectedItems.unshift(item)
        },
        unselectedItem(item, index){
            item._selected = false
            this.selectedItems.splice(index, 1)
        },
        clearSelectedItems(){
            _.each(this.selectedItems, (item)=>{
                item._selected = false
            })
            this.selectedItems=[];
        },
        canShowItem(item){
            if(item._selected) return false
            if(this.filterStr){
                return item.label.indexOf(this.filterStr) > -1
            }
            return true
        },
        updateSelKeys(vs){
            vs = _.sortedUniq(vs)
            let keys = vs.join('')
            if(this.selectedKeys != keys){
                this.selectedKeys = keys
                return true
            }
            return false
        },
        updateWithDataSource(){
            this.selectedKeys=''
            let srcMap = {}
            _.each(this.dataSource, (item)=>{
                srcMap[item.value] = item
            })
            this.dataSourceMap = srcMap
            this.updateWithValue(this.value)
        },
        updateWithValue(vs){
            if(!this.updateSelKeys(vs)) return
            let newSelItems = []
            let newSelKeyMap = {}
            if(vs.length > 0){
                let srcMap = this.dataSourceMap
                let item = null
                _.each(vs, (v)=>{
                    item = srcMap[v]
                    if(item){
                        item._selected = true
                        newSelItems.push(item)
                        newSelKeyMap[v] = true
                    }

                })
            }
            // 恢复不再选中的项状态
            _.each(this.selectedItems, (item)=>{
                if(!newSelKeyMap[item.value]){
                    item._selected = false
                }
            })
            this.selectedItems = newSelItems
        }
    }
}
</script>


<style lang="less" scoped>
.btn {
    cursor: pointer;
    float: right;
    margin-right: 5px;
    &:hover {
        color: #20A0FF;
    }
}

.zj-select-table {
    .icon-check{
        color: #3BA4FB;
    }
    .el-row{
        margin:0!important;
    }
    .view-header{
        height: 36px;
        line-height: 36px;
        background: #fbfdff;
        margin: 0;
        padding:0px 5px;
        border-bottom: 1px solid #d1dbe5;
        box-sizing:border-box;
        -moz-box-sizing:border-box; /* Firefox */
        -webkit-box-sizing:border-box; /* Safari */
        color: #1f2d3d;
    }
    .filter-table {
        li {
            cursor: pointer;
        }
        .content{
          width: 100%!important;
        }
    }
    .filter-header{
        padding:0 10px;
        height: 36px;
        background: #fbfdff;
        box-sizing:border-box;
        -moz-box-sizing:border-box; /* Firefox */
        -webkit-box-sizing:border-box; /* Safari */
        color: #1f2d3d;
        border-bottom: 1px solid #d1dbe5;
    }
    .select-table {
        overflow: auto;
        list-style: none;
        padding-left: 0;
        color: #636f80;
        margin: 0!important;
        &-box{
            float: left;
            border: 1px solid #d1dbe5;
            background: #fff;
            display: inline-block;
            vertical-align: middle;
            width: 155px;
            padding: 0!important;
            box-sizing:border-box;
            -moz-box-sizing:border-box; /* Firefox */
            -webkit-box-sizing:border-box; /* Safari */
            position: relative;
            &:nth-of-type(1){
                margin-right: 5px;
            }
        }
        &-large-box{
            width: 210px!important;
        }
        li {
            display: block;
            // height: 32px;
            line-height: 20px;
            overflow: hidden;
            padding:4px 5px;
            color: #48576a;
            box-sizing:border-box;
            -moz-box-sizing:border-box; /* Firefox */
            -webkit-box-sizing:border-box; /* Safari */
            &:not(:first-child) {
                border-top: 1px solid #dfe6ec;
            }

            &:hover{
                background-color: #fafafa;
            }

            .content {
                float: left;
                width: 105px;
                margin-left: 4px;
                box-sizing:border-box;
                -moz-box-sizing:border-box; /* Firefox */
                -webkit-box-sizing:border-box; /* Safari */
                // white-space:nowrap;
                // text-overflow:ellipsis;
                // overflow:hidden;
                // -o-text-overflow:ellipsis;
                // -webkit-text-overflow:ellipsis;
                // -moz-text-overflow:ellipsis;
                i {
                    margin-right: 5px;
                }
            }
        }
    }
}
</style>

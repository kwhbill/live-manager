<template>
  <div class="tree-table">
    <div class="header">
      <div class="left-header-box">
        <span v-for="column in firstColumns" :key="column.name" :style="{width: column.width+'px'}" :expand-on-click-node="false">
          {{column.name}}
        </span>
      </div>
      <div class="first-cloumn">
        <tree class="tree-box"  emptyText="" :showCheckbox="false" :load="onTreeLoad"   :is-ready="isReady" ref="src" :render-content="renderTreeContent ? renderTreeContent : null" :show-checkbox="true" :default-checked-keys="defaultCheckedKeys"></tree>
      </div>
      
    </div>
    
    <div class="box">
       <ul class="right-header-box">
        <li v-for="prop in otherColumns" :key="prop.key" :style="{width: prop.width+'px'}">{{prop.name}}</li>
      </ul>
      <tree class="list right-tree-box" sync="src" layout="list" :expand-on-click-node="false" :render-content="renderListContent ? renderListContent : renderListDefaultContent"></tree>
    </div>
  </div>
</template>

<script>
// 引入 zj 的库
import Tree from "zj/widgets/tree/tree"
export default {
  // 页面均要继承BasePage，完成与App的通信工作
  components:{
    Tree
  },
  props: {
    onTreeLoad: {
        type: Function
    },
    renderTreeContent: {
        type: Function
    },
    renderListContent: {
        type: Function
    },
    props: {
      type: Array,
      default(){
          return []
      }
    },
    data: {
      type: Array,
      default(){
          return []
      }
    },
    isReady: {
      type: Boolean,
      default(){
        return false
      }
    }
  },
  data(){
    return {
      defaultCheckedKeys: [1,3],
      firstColumns: {},
      otherColumns: [],
      dataMap: {}
    }
  },
  watch: {
    data(val){
      _.each(val, item=>{
        this.dataMap[item.key] = item
      })
    }
  },
  mounted () {
   this.firstColumns = _.slice(this.props,0, 2) 
    this.otherColumns = _.drop(this.props, 2)
  },
  methods:{
    renderListDefaultContent(h, node){
      let templ = []
      let otherColumns = this.otherColumns;
      let nodeData = this.dataMap[node.key]
      templ = _.map(otherColumns, (column, i)=>{
        return (
          <span><i>{nodeData[column.key]}</i></span>
        )
      })
      return (
        <div class="table-list">
          <div>
            {templ}
          </div>
        </div>
        
      )
    },
    recoverTree(list){

    }
  }
}
</script>


<style lang="less" >
    @bdColor: #dfe6ec;
    .table{
      border-right: 1px solid @bdColor;
    }
    .tree-table{
      border-collapse:separate;
      display: flex;
    }
    
    .tree-table .header{
        flex: 1;
        list-style: none;
        display: inline-block;
        float: left;
        color: #1f2d3d;
        font-weight: 700;
        .left-header-box{
          display: flex;
          border: 1px solid @bdColor;
          border-bottom: 0 none;
          span{
             background: #eef1f6;
              box-sizing: border-box;
              padding-left: 9px;
              height: 32px;
              line-height: 32px;
          }
          span:first-of-type{
            flex: 1;
          }
          span:last-of-type{
            border-left: 1px solid @bdColor;
          }
        }
        .first-cloumn{
            border-left: 1px solid @bdColor;
            display: table-cell;
            .node-content{
              border-bottom: 1px solid @bdColor;
              border-right: 1px solid @bdColor;
            }

        }
      }
    .tree-table .box{
        color: #1f2d3d;
        display: inline-block;
        width: 700px;
        float: left;
        overflow-x: scroll;
        overflow-y: hidden;
        .list{
        }
        .node-content{
          display: block!important;
        }
        ul {
           list-style: none;
           padding-left: 0;
           margin: 0;

        }
        li {
            display: inline-block;
            box-sizing: border-box;
            padding: 5px;
            height: 34px;
            padding-left: 9px;
            font-size: 14px;
            border-top: 1px solid @bdColor;
            border-right: 1px solid @bdColor;
            background: #eef1f6;
        }

        .table-list{
          &>div{
            &>span{
              box-sizing: border-box;
              padding-left: 9px;
              padding-right: 9px;
              width: 100px;
              border-right: 1px solid @bdColor;
              border-bottom: 1px solid @bdColor;
              overflow: hidden;
              i {
                display: inline-block;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                font-style: normal;
              }
            }
          }
        }
    }
    .right-header-box{
      white-space: nowrap;
    }
  
</style>

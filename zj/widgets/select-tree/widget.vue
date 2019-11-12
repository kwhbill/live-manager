<template>
  <div class="el-input">
    <el-select style="width: 100%"
        v-model="selected"
        clearable
        filterable
        :multiple="multiple"
        :multiple-limit="multipleLimit"
        :placeholder="placeholder"
        :size="size"
        no-data-text ="暂无可选项"
        >
      <div v-if = "loadTreeReady">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :node-key="nodekey"
          :expand-on-click-node="false"
          :render-content="renderContent"
          :load="loadNode"
          :lazy="lazy"
          :highlight-current="true"
          class="zj-select-tree"
          >
        </el-tree>
      </div>
    </el-select>
  </div>
</template>



<script>


  export default {
    name: 'select-tree',
    props: {
      treeData:{
        type: Array, //传树结构
        default() {
          return [];
        }
      },
      placeholder:{
        type:String,
        default() {
          return "请选择";
        }
      },
      multiple:{
        type: Boolean,
        default: true
      },
      nodekey:{
        type:String,
        default() {
          return "key";
        }
      },
      multipleLimit:{
        type: Number
      },
      'label-method': Function,
      defaultProps:{
        type: Object,
        default() {
          return {
            children: 'children',
            label: 'label'
          };
        }
      },
      multiple:{
        type: Boolean,
        default: true
      },
      multipleLimit:{
        type: Number
      },
      defaultProps:{
        type: Object,
        default() {
          return {
            children: 'children',
            label: 'label'
          };
        }
      },

      parentNodeSelect:{
        type: Boolean,
        default:true
      },
      loadNode:{
        type: Function,
      },
      lazy:{
        type: Boolean,
        default:false
      },
      optionlabel:{
        type:String,
        default() {
          return "label";
        }
      },
      size:{
        type:String,
        default(){
          return 'small'
        }
      },
      loadTreeReady:{
        type: Boolean,
        default(){
          return true;
        }
      },
      value:{
        type: [String,Number,Array]
      }

    },
    watch:{
      selected(val){
        this.$emit("input", val);
      },
      value(val){
        if(this.multiple && !_.isArray(val)){
          val=[];
        }
        this.selected=val;
      }
    },
    created(){
    },
    data(){
      return {
        selected: this.value,
        popoverVisible: false,
        data: [],
        tree: {_loading: false, _root: true},
        dataLoading: false
      }
    },

    methods: {
      renderContent(h, { node, data, store }) {
       
        let nodekey=this.nodekey;
        let optionlabel=this.optionlabel;
        if(optionlabel=="label"){
          if(this.parentNodeSelect){
            return (
                  <el-option class="el-zj-tree-select-item" value={node.data[nodekey]} label={node.label} disabled={node.data["disabled"]}>
                    <span style="padding-right:30px;"> {node.label}</span>
                  </el-option>);
          }
          return (
          <el-option class="el-zj-tree-select-item" value={node.data[nodekey]} label={node.label}  disabled={node.data["disabled"] || !node.isLeaf}>
              <span style="padding-right:30px;"> {node.label}</span>
          </el-option>);
        }
        else{
          if(this.parentNodeSelect){
            return (
                  <el-option class="el-zj-tree-select-item" value={node.data[nodekey]} label={node.data[optionlabel]} disabled={node.data["disabled"]}>
                    <span style="padding-right:30px;"> {node.label}</span>
                  </el-option>);
          }
          return (
          <el-option class="el-zj-tree-select-item" value={node.data[nodekey]} label={node.data[optionlabel]}  disabled={node.data["disabled"] || !node.isLeaf}>
              <span style="padding-right:30px;"> {node.label}</span>
            </el-option>);
        }


      }
    }
  }
</script>

<style lang="less">
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after {
    top: 10px;
}

.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:before {
    display: none!important;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.hover,
.el-select-dropdown__item.hover {
    background: none;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
    background: none;
}

.zj-select-tree {
  
    .el-tree-node__content {
        position: relative;
    }
    .el-tree-node__expand-icon,
    .el-tree-node__loading-icon {
        position: relative;
        z-index: 2;
    }
    .el-select-dropdown__item.selected:before {
        content: "";
        display: block;
        position: absolute;
        left: 0;
        top: 1px;
        width: 100%;
        background: #3BA4FB;
        height: 100%;
        z-index: 0;
    }
    .el-select-dropdown__item.selected span {
        position: relative;
        z-index: 1;
    }
    .el-select-dropdown__item{
        overflow: visible;
        position: static;
        display: inline-block !important;
        width: 100%;
    }

}
</style>

<style>
    .el-zj-tree-select-item.is-disabled{
        color:#8a8989;
    }
    .el-zj-tree-select-item.is-disabled{
      background-color:transparent !important;
    }
    .el-tree-node__expand-icon {
      border: 8px solid transparent;
    border-right-width: 0;
    border-left-color: #97a8be;
    border-left-width: 9px;

  }
</style>

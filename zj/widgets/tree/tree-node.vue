<template>
  <div class="tree-node" :class="isTreeLayout? 'tree': ''">
    <div :style="isTreeLayout ? nodeStyle: null" :class="node.highlight? `node-highlight node-content`:`node-content`">
      <span class="node-icon" @click="expandNode" v-show="isTreeLayout && !node.isLeaf"  :style="isTreeLayout ? iconStyle: null">
        <i class="el-icon-caret-right expand-icon" :class="node.isExpand? 'expanded': ''"></i>
      </span>
      <el-checkbox :indeterminate="node.isCheckIndeterminate" :disabled="node.disabled" v-model="nodeChecked" v-show="tree.showCheckbox"></el-checkbox>
      <span class="tree-loading" v-if="isTreeLayout &&  node.isLoading"><i class="fa fa-spinner fa-pulse fa-1x fa-fw"></i></span>
      <span class="content" @click="onNodeClick">
        <tree-node-content ></tree-node-content>
      </span>
    </div>
    <div v-if="!node.isLeaf" v-show="node.isExpand">
      <tree-node v-for="child in node.children" :key="child.key" :node="child" :tree="tree"></tree-node>
    </div>
  </div>
</template>

<script>
import TreeNodeContent from "./tree-node-content";
export default {
  name: "tree-node",
  components: {
    TreeNodeContent
  },
  props:{
    node: Object,
    tree: Object
  },
  computed: {
    isTreeLayout(){
      return this.tree.layout == 'tree'
    },
    nodeStyle(){
      return {
        paddingLeft: `${(this.node.level-1) * 20 + 32}px`
      }
    },
    iconStyle(){
      return {
        left: `${(this.node.level-1) * 20 +12 }px`
      }
    },
    nodeChecked: {
      get(){
        return this.node.checked
      },
      set(value){
        this.node.checked = !!value
      }
    }
  },
  methods: {
    expandNode(){
      this.tree.expandNode(this.node)
    },
    onNodeClick(){
      if(this.tree.highlightCurrent)this.tree.setHightlightNode(this.node)
      if(this.tree.expandOnClickNode){
        this.tree.expandNode(this.node)
      }
      this.tree.$emit('node-click',  this.node, this);

    }
  }
}
</script>

<style lang="less" scoped>
  .tree-node {
    line-height: 32px;
    &.tree{
      // padding-left: 20px;
      .node-content{
        position: relative;
        .node-icon{
          position: absolute;
          left: 0;
          top: 0;
        }
      }
      
    }
    display: block;

    .node-content{
      &.node-highlight{
        background: #efefef;
      }
      display: flex;
      .tree-loading {
        display:inline-block;
        padding-left:4px
      }
      .content{
        flex: 1;
        .label{
          padding-left: 10px;
          font-size: 14px;
          cursor: pointer;
        }
      }
    }
    .node-icon{
      cursor: pointer;
      color: #c0c4cc;
      padding:0 2px;
      i{
        font-size: 14px;
      }
    }
    .expand-icon {
        color: #c0c4cc;
        font-size: 12px;
        transform: rotate(0deg);
        transition: transform .3s ease-in-out;
        &.expanded {
            transform: rotate(90deg);
        }
    }
  }
</style>
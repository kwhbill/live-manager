<template>
  <div class="tree-node drag-tree">
    <div :style="isTreeLayout ? nodeStyle: null"
         draggable='true'
         @dragstart='dragStart(node,$event)'
         @dragover='dragOver'
         @dragenter='dragEnter'
         @dragleave='dragLeave(node,$event)'
         @drop='drop(node,$event)'
         @dragend='dragEnd'
         class='treeNodeText'
         :class="node.highlight? `node-highlight node-content`:`node-content`"
        >
      <span class="node-icon" @click="expandNode" v-show="showAddBtn || (!showAddBtn && node.children.length !== 0)"  :style="iconStyle">
        <i class="el-icon-caret-right expand-icon" :style="{color:node.children.length !== 0 ? '#409EFF' : ''}" :class="node.isExpand? 'expanded': ''"></i>
      </span>
      <span v-show="!showAddBtn  && node.children.length == 0" :style="_iconStyle">
      </span>
      <span v-show="!isEditing" class="content" @click="onNodeClick" @dblclick="onNodedDblclick">
        <tree-node-content ></tree-node-content>
      </span>
      <span v-show="isEditing">
        <input type="text" v-model="node.name" :data-id="node.index" class="input-content" ref="content" @blur="isEditing=false">
      </span>
      <span class="del-icon" v-if="showDelBtn"  @click="removeMyself" >&nbsp;x</span>

      <el-tooltip class="item" effect="dark" :content="node.url" placement="right">
        <span style="margin-left: 20px;width: 100px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;" v-if="showUrlTip && node.url!== ''&& node.url!== '-'">url:{{node.url}}</span>
      </el-tooltip>
    </div>
    <div v-if="!node.isLeaf" v-show="node.isExpand">
      <tree-node v-for="child in node.children" :key="child.index" :node="child" :tree="tree"></tree-node>

      <div class='changeTree' v-if="showAddBtn" :style="plusStyle" @click="addChild(node)" @drop='dropPlus(node,$event)' @dragover='dragOverPlus'>
        <el-tooltip class="item" effect="dark" content="可点击添加菜单或拖动其他项菜单到这里" placement="right">
          <span>+</span>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import TreeNodeContent from "./tree-node-content";
import Drag from './model/drag.js'
export default {
  name: "tree-node",
  components: {
    TreeNodeContent
  },
  mixins:[Drag],
  props:{
    node: Object,
    tree: Object
  },
  data(){
    return {
      isEditing: false
    }

  },
  computed: {
    isTreeLayout(){
      return this.tree.layout == 'tree'
    },
    showAddBtn(){
      return this.tree.showAddBtn
    },
    showDelBtn(){
      return this.tree.showDelBtn
    },
    showUrlTip(){
      return this.tree.showUrlTip
    },
    nodeStyle(){
      return {
        paddingLeft: `${(this.node.level-2) * 20 + 12}px`
      }
    },
    iconStyle(){
      return {
        left: `${(this.node.level-1) * 20 +12 }px`
      }
    },
    _iconStyle(){
      return {
        width: `16px`
      }
    },
    plusStyle(){
      return {
        paddingLeft: `${(this.node.level-1) * 20 +16 }px`
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
    },
    onNodedDblclick(){
      if(this.tree.canEditInNode){
        this.isEditing = true
        this.$nextTick(()=>{
          let inputs = document.getElementsByClassName('input-content')
          _.each(inputs,input=>{
            if(input.getAttribute('data-id')==this.node.index){
              input.focus()
            }
          })
        })
      }
      this.tree.$emit('node-dblclick',  this.node, this);
    },
    onWholeNodeClick(ev){
      this.tree.$emit('whole-node-click',ev,  this.node, this);
    },
  }
}
</script>

<style lang="less" scoped>

  .tree-node {
    cursor: pointer;
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
        .label{
          padding-left: 10px;
          font-size: 14px;
          cursor: pointer;
        }
      }
      .del-icon{
        margin-left: 10px;
        font-size: 18px;
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
  .changeTree {
    width: 100%;
    color: #324057;
  }

</style>
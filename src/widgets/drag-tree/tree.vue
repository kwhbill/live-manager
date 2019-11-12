<template>
  <div>
    <tree-node v-for="node in root.children" :key="node.index" :node="node" :tree="tree"></tree-node>
    <div class='changeTree' v-if="showAddBtn"  @click="addChild(root)"  @drop='dropPlus(root,$event)' @dragover='dragOverPlus' @dragenter='dragEnterPlus'>
      <el-tooltip class="item" effect="dark" content="可点击添加菜单或拖动其他项菜单到这里" placement="right">
        <span>+</span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
  import TreeCore from "./model/tree_core"
  import TreeNode from "./tree-node"
  import Drag from './model/drag'

  export default {
    mixins: [TreeCore],
    components: {
      TreeNode
    },
    methods:{

    }
  }
</script>


<style lang="less">
  .tree-empty {
    color: #8492A6;
    padding: 20px;
    font-size: 13px;
  }
  .changeTree {
    font-size: 20px;
    height: 30px;
    color: #324057;
    cursor: pointer;
  }
</style>

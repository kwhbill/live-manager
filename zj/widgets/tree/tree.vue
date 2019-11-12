<template>
  <div>
      <tree-node v-for="node in root.children" :key="node.key" :node="node" :tree="tree"></tree-node>
      <div v-if="root.children.length == 0" class="tree-empty">{{emptyText}}</div>
  </div>
</template>

<script>
import TreeCore from "./model/tree_core"
import TreeNode from "./tree-node"

export default {
    mixins: [TreeCore],
    components:{
        TreeNode
    }
}
</script>


<style lang="less">
.tree-empty{
    color: #8492A6;
    padding: 20px;
    font-size: 13px;
}
</style>

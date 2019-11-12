<template>
  <div >
      <tree-node  v-for="node in root.children" :key="node.key" :node="node" :tree="tree"></tree-node>
      <div v-if="root.children.length == 0">{{emptyText}}</div>
  </div>
</template>

<script>
  import TreeCore from "./model/tree_core"
  import TreeNode from "./tree-node"

  import Emitter from 'element-ui/src/mixins/emitter';
  import { getValueByPath } from 'element-ui/src/utils/util';

  export default {
    mixins: [TreeCore,Emitter],
    data() {
      return {
        index: -1,
        visible: true,
        hitState: false
      };
    },
    name: 'Tree',

    componentName: 'Tree',
    props: {
      value: {
        required: true
      },
      label: [String, Number],
      created: Boolean,
      disabled: {
        type: Boolean,
        default: false
      },
      highlightCurrent: Boolean,
    },
    components: {
      TreeNode
    },
    computed: {
      isObject() {
        return Object.prototype.toString.call(this.value).toLowerCase() === '[object object]';
      },

      currentLabel() {
        return this.label || (this.isObject ? '' : this.value);
      },

      currentValue() {
        return this.value || this.label || '';
      },

      parent() {
        let result = this.$parent;
        while (!result.isSelect) {
          result = result.$parent;
        }
        return result;

      },

      itemSelected() {
        if (!this.parent.multiple) {
          return this.isEqual(this.value, this.parent.value);
        } else {
          return this.contains(this.parent.value, this.value);
        }
      },

      limitReached() {
        if (this.parent.multiple) {
          return !this.itemSelected &&
            this.parent.value.length >= this.parent.multipleLimit &&
            this.parent.multipleLimit > 0;
        } else {
          return false;
        }
      }
    },

    watch: {
      currentLabel() {
        if (!this.created && !this.parent.remote) this.dispatch('ElSelect', 'setSelected');
      },
      value() {
        console.log(val);
        if (!this.created && !this.parent.remote) this.dispatch('ElSelect', 'setSelected');
      }
    },

    methods: {
      isEqual(a, b) {
        if (!this.isObject) {
          return a === b;
        } else {
          const valueKey = this.parent.valueKey;
          return getValueByPath(a, valueKey) === getValueByPath(b, valueKey);
        }
      },

      contains(arr = [], target) {
        if (!this.isObject) {
          return arr.indexOf(target) > -1;
        } else {
          const valueKey = this.parent.valueKey;
          return arr.some(item => {
            return getValueByPath(item, valueKey) === getValueByPath(target, valueKey);
          });
        }
      },

      hoverItem() {
        if (!this.disabled) {
          this.parent.hoverIndex = this.parent.options.indexOf(this);
        }
      },

      selectOptionClick(node) {
        if (this.disabled !== true ) {
          this.dispatch('ElSelect', 'handleOptionClick',this.nodeMap,node);
        }
      },

      queryChange(query) {
        // query 里如果有正则中的特殊字符，需要先将这些字符转义
        let parsedQuery = String(query).replace(/(\^|\(|\)|\[|\]|\$|\*|\+|\.|\?|\\|\{|\}|\|)/g, '\\$1');
        this.visible = new RegExp(parsedQuery, 'i').test(this.currentLabel) || this.created;
        if (!this.visible) {
          this.parent.filteredOptionsCount--;
        }
      },

      resetIndex() {
        this.$nextTick(() => {
          this.index = this.parent.options.indexOf(this);
        });
      }
    },

    created() {
      this.parent.options.push(this);
      this.parent.nodeMap = this.nodeMap;
      this.parent.optionsCount++;
      this.parent.filteredOptionsCount++;
      this.index = this.parent.options.indexOf(this);

      this.$on('queryChange', this.queryChange);
      this.$on('resetIndex', this.resetIndex);
    },

    beforeDestroy() {
      this.dispatch('ElSelect', 'onOptionDestroy', this);
    }
  }
</script>


<style lang="less" scoped>
  .select {
    position: relative;
    .el-input__icon{
      color: #bfcbd9;
      font-size: 12px;
      transition: transform .3s;
      transform: translateY(-50%) rotate(180deg);
      line-height: 16px;
      top: 50%;
      cursor: pointer;
    }
    .el-input__icon.reverse{
      transform: translateY(-50%);
    }
    .el-icon-arrow-up:before {
      content: "\E607";
    }
    .el-input__icon:after {
      content: "";
      height: 100%;
      width: 0;
      display: inline-block;
      vertical-align: middle;
    }
  }


</style>

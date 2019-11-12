import Node from './node'
let fromData = null
let fromParentModelChildren = null
let toData = null

function exchangeData(parent, from, to) {
  let fromIndex = _.indexOf(parent,from)
  let toIndex = _.indexOf(parent,to)
  parent.splice(toIndex,1,from)
  parent.splice(fromIndex,1,to)
}
export default {
  data(){
    return {
      defaultKeyCount : 0,
      fromData:null,
      fromParentModelChildren:null,
      toData:null
    }
  },

  methods: {

    caculateDragNodeList() {  // 将树形结构转成扁平结构
      if(!this.tree.getNodeList) return
      let nodeList = []
      _.each(this.tree.root.children, child => {
        this.appendDragNodeToList(nodeList,child)
      })
      this.tree.$emit('get-node-list',nodeList);
      this.tree.$emit('get-root',this.tree.root);
    },


    appendDragNodeToList(nodeList,node){
      nodeList.push(node)
      _.each(node.children,child=>{
        this.appendDragNodeToList(nodeList,child)
      })
    },

    addChild(parent) {
      if(!this.tree.appName){
        this.$message({
          type:'error',
          message:'请先给应用添加英文名称'
        })
        return false
      }
      if(!parent.canAddChild) return
      let level = parent.level + 1
      let count = parent.children.length
      let index = parent.index
      if(!index) {
        index = `/${this.appName}`
      }else{
        index = `${index}/${level}_${count}`
      }

      let child = new Node({
        index,
        name:`菜单_${level}_${count}`,
        isLeaf:false,
      })
      parent.addChild(child)
      this.caculateDragNodeList()
    },
    removeMyself(){
      let parent = this.node.parent
      parent.delChild(this.node)
      this.caculateDragNodeList()
    },
    dragStart(node,e) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("nottext", e.target.innerHTML);
      fromData = node
      fromParentModelChildren = node.parent.children
      return true
    },
    dragLeave(node,e) {
      e.preventDefault()
      return true
    },
    dragOver(e) {
      e.preventDefault()
      return true
    },
    dragEnter(e) {
      e.preventDefault()
      return true
    },
    dragEnd(e) {
      fromData = null
      toData = null
      fromParentModelChildren = null
      this.caculateDragNodeList()
    },
    drop(node,e) {
      toData = node
      if(_.includes(fromParentModelChildren, toData,fromData)){  // 默认同一层级的才能更换位置
        exchangeData(fromParentModelChildren, fromData, toData)
      }
      e.preventDefault()
    },
    dragOverPlus(e) {
      e.preventDefault()
    },
    dragEnterPlus(e) {
      e.preventDefault()
      return true
    },
    dropPlus(node,e) {
      if(node === fromData.parent){  // 如果目标元素和加号是相同的父元素，默认不做跟换
        e.preventDefault()
        return true
      }
      let _fromData = _.cloneDeep(fromData)
      if(fromData.delMyself){
        fromData.parent.delChild(fromData)
      }
      node.addChild(_fromData)
      this.caculateDragNodeList()
    }
  },
}

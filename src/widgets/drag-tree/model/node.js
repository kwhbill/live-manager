export default class DragNode {
  constructor({index ,name,isExpand, id ,isLeaf, isRoot=false, level = 0, data, url='',order,delMyself = true,canAddChild =true}){
    this.index = index   // 用来构建的索引
    this.order = order
    this.id = id
    this.parent = null
    this.children = []
    this.name = name
    this.level = level
    this.isExpand = !!isExpand
    this.isLeaf = isLeaf
    this.isRoot = isRoot
    this.data = data
    this.highlight = false
    this.url = url
    this.delMyself = delMyself
    this.canAddChild = canAddChild
    this.canEditUrl=false
  }
  delSelf(){
    if(this.parent) this.parent.delChild(this)
  }
  addChild(node){
    if(node.parent == this) return
    this.children.push(node)
    node.parent = this
    node.delMyself = this.delMyself
    node.canAddChild = this.canAddChild
    node.level = this.level +1
    _.each(node.children,child=>{
      child.addChildLevel(node.level)
    })
  }
  addChildLevel(parentLevel){
    this.level =  parentLevel + 1
    _.each(this.children,child=>{
      child.addChildLevel(this.level)
    })
  }
  delChild(node){
    this.children = _.filter(this.children, child => {
      return child != node
    })
  }
  expand(value){
    if(this.isLeaf || this.isExpand === value) return
    this.isExpand = _.isNil(value) ? (!this.isExpand) : value
  }

}

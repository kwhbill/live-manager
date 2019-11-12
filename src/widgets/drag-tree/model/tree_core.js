import Node from "./node"
import Drag from './drag'
export default {
  mixins:[Drag],
  props: {
    emptyText: {
      type: String,
      default() {
        return "没有数据"
      }
    },
    levelName:{
      type: String,
      default() {
        return "根菜单"
      }
    },
    props: {
      default () {
        return {
          index:'index',
          children: "children",
          name: "menu_name",
          id : "menu_id"
        }
      }
    },
    expandOnClickNode: {
      type: Boolean,
      default() {
        return true
      }
    },
    showCheckbox: {
      type: Boolean,
      default() {
        return false
      }
    },
    showUrlTip:{
      type: Boolean,
      default() {
        return false
      }
    },
    showAddBtn:{
      type: Boolean,
      default() {
        return true
      }
    },
    canAddChild:{
      type: Boolean,
      default() {
        return true
      }
    },
    canEditInNode:{
      type: Boolean,
      default() {
        return false
      }
    },

    showDelBtn:{
      type: Boolean,
      default() {
        return true
      }
    },
    delMySelf:{
      type: Boolean,
      default() {
        return true
      }
    },
    layout: {
      type: String,
      default() {
        return 'tree'
      }
    },
    isReady: {
      type: Boolean,
      default: false
    },
    getNodeList:{
      type: Boolean,
      default: false
    },
    load: Function,
    renderContent: Function,
    highlightCurrent: {
      type: Boolean,
      default() {
        return false
      }
    },
    menus:{
      type: Array,
      default() {
        return []
      }
    },
    appName:{
      type: String,
      default:''
    },
  },
  data() {
    return {
      root: new Node({
        isRoot: true,
        name:this.levelName,
        delMyself:this.delMySelf,
        canAddChild:this.canAddChild
      }),
      nodeMap: {},
      defaultKeyCount: 0,
      syncListenerList: [],
      highlightNode: null,
      dataInit: true,
    }
  },
  watch: {
    isReady(value) {
      if (value) this.onReady()
    },
  },
  computed: {
    tree() {
      return this
    }
  },
  created() {
    this.onReady()
  },
  mounted(){


  },
  methods: {
    onReady() {
      this.dataInit = true
      this.root = new Node({
        isRoot: true,
        name:this.levelName,
        delMyself:this.delMySelf,
        canAddChild:this.canAddChild
      })
      this.expandNode(this.root, () => {
        this.caculateDragNodeList()
      })
    },
    expandNode(node, resolve = _.noop) {
      if (this.dataInit) {
        this.packChildrenData(node, _.cloneDeep(this.menus))
        node.expand()
        resolve()
        this.dataInit = false
      } else {
        node.expand()
        resolve()
      }
    },

    packChildrenData(parent, items) {
      items = items.sort((itemA,itemB)=>{
        return itemA.order - itemB.order
      })
      _.each(items, item => {
        this.addChildNode(parent, item)
      })
    },
    getPropWithKey(data, key) {
      let propName
      if (key == "index") {
        propName = _.get(this.props, key,key)
        if (_.isNil(data[propName])) {
          return `$NODE_${this.defaultKeyCount++}`
        }
      } else {
        propName = _.get(this.props, key, key)
      }
      return data[propName]
    },
    addChildNode(parent, data, pos = -1){
      data.index = this.getPropWithKey(data, "index")
      data.name = this.getPropWithKey(data, "name")
      data.id = this.getPropWithKey(data, "id")
      data.delMyself = this.delMySelf
      data.canAddChild = this.canAddChild
      let child = new Node(data)
      parent.addChild(child,pos)
      let itemChildren = this.getPropWithKey(data, "children")
      if (itemChildren) {
        this.packChildrenData(child, itemChildren)
      }
    },
    setHightlightNode(node) {
      let curHightLightNode = this.highlightNode
      if (curHightLightNode) curHightLightNode.highlight = false
      node.highlight = true
      this.highlightNode = node
    }
  }
}

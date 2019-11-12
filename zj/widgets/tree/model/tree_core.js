import Node from "./node"

export default {
    props: {
        props: {
            default () {
                return {
                    children: "children",
                    label: "label",
                    icon: "icon",
                    disabled: "disabled",
                    isLeaf: "isLeaf"
                }
            }
        },
        nodeKey: {
            type: String,
            default () {
                return "key"
            }
        },
        emptyText: {
            type: String,
            default () {
                return "没有数据"
            }
        },
        expandOnClickNode: {
            type: Boolean,
            default(){
                return true
            }
        },
        showCheckbox: {
            type: Boolean,
            default(){
                return false
            }
        },
        layout: {
            type: String,
            default(){
                return 'tree'
            }
        },
        defaultCheckedKeys: Array,
        defaultExpandedKeys: Array,
        isReady: {
            type: Boolean,
            default: false
        },
        load: Function,
        renderContent: Function,
        sync: String,
        highlightCurrent: {
            type: Boolean,
            default(){
                return false
            }
        },
        checkStrictly:  {
            type: Boolean,
            default(){
                return false
            }
        }
    },
    data() {
        return {
            root: new Node({
                isRoot: true
            }),
            nodeMap: {},
            defaultKeyCount: 0,
            syncListenerList: [],
            highlightNode: null
        }
    },
    watch: {
        isReady(value) {
            if (value) this.onReady()
        }
    },
    computed: {
        tree() {
            return this
        }
    },
    created () {
        if(!this.load || this.isReady) this.onReady()
        if(this.sync){
            let treeSource = this.$parent.$refs[this.sync]
            if(treeSource) treeSource.regsiterSyncListner(this)
        }
    },
    methods: {
        onReady() {
            this.expandNode(this.root, ()=>{
                // 初次加载，处理默认选项
                this.setCheckedKeys(this.defaultCheckedKeys, true)
            })
            this.root.isCheckNotBroadcast = this.checkStrictly
        },
        regsiterSyncListner(listener){
            this.syncListenerList.push(listener)
            this.pubSync(listener)
        },
        pubSync(listener){
            listener.root = this.root 
            listener.nodeMap = this.nodeMap
        },
        reset() {
            this.root.children = []
            this.root.isExpand = false
            this.nodeMap = {}
            this.defaultKeyCount = 0

            _.each(this.syncListenerList, listener =>{
                this.pubSync(listener)
            })

            if (this.isready) this.onReady()
        },
        recoverTree(data){
            this.root.children = []
            this.packChildrenData(this.root, data)
        },
        dumpTree(){
            let childrenKey = _.get(this.props, "children", "children")
            return _.map(this.root.children, child =>{
                return child.dump(childrenKey)
            })
        },
        getNodesByKeys(keys) {
            let nodes = []
            _.each(keys, key => {
                let node = this.nodeMap[key]
                if (node) nodes.push(node)
            })
            return nodes
        },
        getNodeByKey(key) {
            return this.nodeMap[key]
        },
        getCheckedKeys(mode="top") {
            return _.map(this.getCheckedNodes(mode), "key")
        },
        getCheckedNodes(mode="top") {
            let resList = []
            this._collectCheckedNodes(this.root, resList, mode)
            return resList
        },
        _collectCheckedNodes(node, resList, mode="top") {
            // mode: top 顶级；all 全部； leaf 叶子
            if(this.checkStrictly) mode = "all"
            if (node.isChecked && !node.isRoot) {
                switch (mode) {
                case "top":
                    resList.push(node)
                    return
                case "leaf":
                    if(node.isLeaf){
                        resList.push(node)
                        return
                    }
                    break
                case "all":
                    resList.push(node)
                    break
                }
            }
            // 非叶子节点，并且其子节点有选中
            if ( node.isRoot || 
                 ( !node.isLeaf && ( this.checkStrictly || node.isChecked || node.isCheckIndeterminate) )
            ) {
                _.each(node.children, child => {
                    this._collectCheckedNodes(child, resList, mode)
                })
            }
        },
        setCheckedKeys(keys, value=true) {
            let nodes = this.getNodesByKeys(keys)
            this.setCheckedNodes(nodes, value)
        },
        setCheckedNodes(nodes, value) {
            _.each(nodes, node => {
                node.check(value)
            })
        },
        clearCheckedNodes(){
            this.checkAllNodes(false)
        },
        checkAllNode(value=true){
            // 兼容，将丢弃，改为用 checkAllNodes
            this.checkAllNodes(value)
        },
        checkAllNodes(value=true){
            let nodes = value ? this.root.children : this.getCheckedNodes("top")
            this.setCheckedNodes(nodes, value)
        },
        expandNodeByKey(key, force){
            let node = this.getNodeByKey(key)
            if(node) {
                this.expandNode(node, _.noop, force)
            }
        },
        expandNode(node, resolve = _.noop, force) {
            if ((node.isLeaf || node.isLoading)&& !force) return
            if ((!node.isExpand && this.load && _.isEmpty(node.children))|| (force && this.load)) {
                node.isLoading = true
                if(force) {
                    node.isLeaf = false
                    node.children = []
                    node.isExpand = false
                }
                this.load(node, items => {
                    this.packChildrenData(node, items)
                    node.isLoading = false
                    node.expand()
                    resolve()
                })
            } else {
                node.expand()
                resolve()
            }
        },
        packChildrenData(parent, items) {
            _.each(items, item => {
                this.addChildNode(parent, item)
            })
        },
        getPropWithKey(data, key) {
            let propName
            if (key == "key") {
                propName = _.get(this, "nodeKey", key)
                if (_.isNil(data[propName])) {
                    return `$NODE_${this.defaultKeyCount++}`
                }
            } else {
                propName = _.get(this.props, key, key)
            }
            return data[propName]
        },
        addChildNode(parent, data, pos=-1){
            data.key = this.getPropWithKey(data, "key")
            data.label = this.getPropWithKey(data, "label")
            data.disabled = this.getPropWithKey(data, "disabled")
            data.isLeaf = this.getPropWithKey(data, "isLeaf")
            data.isCheckNotBroadcast = this.checkStrictly
            let child = new Node(data)
            this.nodeMap[child.key] = child // register
            parent.addChild(child, pos)

            let itemChildren = this.getPropWithKey(data, "children")
            if (itemChildren) {
                this.packChildrenData(child, itemChildren)
            }
        },
        addNeighborNode(node, data, isPrev=false, isNeighbor){
            let parent = node.parent
            let pos = -1
            if(isNeighbor){
                pos = _.indexOf(parent.children, node)
                if(!isPrev) pos++
            }
            this.addChildNode(node.parent, data, pos)
        },
        getNeighborNode(node, isPrev=false){
            let parent = node.parent
            let pos = _.indexOf(parent.children, node)
            isPrev ? pos-- : pos++
            return parent.children[pos]
        },
        delNode(node){
            node.delSelf()
        },
        setHightlightByKey(key){
            let node = this.getNodeByKey(key)
            if(node) this.setHightlightNode(node)
        },
        setHightlightNode(node){
            let curHightLightNode = this.highlightNode
            if(curHightLightNode) curHightLightNode.highlight = false
            node.highlight = true
            this.highlightNode = node
        }
    }
}
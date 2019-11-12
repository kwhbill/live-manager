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
        sync: String
    },
    data() {
        return {
            root: new Node({
                isRoot: true
            }),
            nodeMap: {},
            defaultKeyCount: 0,
            syncListenerList: []
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
        getCheckedKeys() {
            return _.map(this.getCheckedNodes(), "key")
        },
        getCheckedNodes() {
            let resList = []
            this._collectCheckedNodes(this.root, resList)
            return resList
        },
        _collectCheckedNodes(node, resList) {
            if (node.isChecked && !node.isRoot) {
                resList.push(node)
                return
            }
            // 非叶子节点，并且其子节点有选中
            if (node.isRoot || (!node.isLeaf && node.isCheckIndeterminate)) {
                _.each(node.children, child => {
                    this._collectCheckedNodes(child, resList)
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
            let nodes = this.getCheckedNodes()
            this.setCheckedNodes(nodes, false)
        },
        checkAllNode(){
            let nodes = this.root.children
            this.setCheckedNodes(nodes, true)
        },
        expandNode(node, resolve = _.noop) {
            if (node.isLeaf || node.isLoading) return

            if (!node.isExpand && this.load && _.isEmpty(node.children)) {
                node.isLoading = true
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
                item.key = this.getPropWithKey(item, "key")
                item.label = this.getPropWithKey(item, "label")
                item.disabled = this.getPropWithKey(item, "disabled")
                item.isLeaf = this.getPropWithKey(item, "isLeaf")

                let child = new Node(item)
                this.nodeMap[child.key] = child // register
                parent.addChild(child)

                let itemChildren = this.getPropWithKey(item, "children")
                if (itemChildren) {
                    this.packChildrenData(child, itemChildren)
                }
            })
        },
        getPropWithKey(data, key) {
            let propName
            if (key == "key") {
                propName = _.get(this, "node-key", key)
                if (_.isNil(data[propName])) {
                    return `$NODE_${this.defaultKeyCount++}`
                }
            } else {
                propName = _.get(this.props, key, key)
            }
            return data[propName]
        },
        addChildNode(parent,data){
            let child = new Node(data)
            parent.addChild(child)
        }
    }
}
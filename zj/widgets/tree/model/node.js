export default class Node {
    constructor({key, label, disabled, isChecked, isExpand, isLeaf, isRoot, level = 0, data, isCheckNotBroadcast}){
        this.key = key
        this.parent = null
        this.children = []
        this.label = label
        this.level = level
        this.disabled = !!disabled
        this.isChecked = !!isChecked
        this.isCheckIndeterminate = false
        this.isExpand = !!isExpand
        this.isLoading = false
        this.isLeaf = isLeaf
        this.isRoot = isRoot
        this.data = data
        this.highlight = false
        this.isCheckNotBroadcast = isCheckNotBroadcast
    }

    get checked(){
        return this.isChecked
    }

    set checked(value){
        this.check(value)
    }

    dump(childrenKey="children"){
        let data = {}
        let attrs = "key,label,disabled,isChecked,isExpand,isLeaf,data".split(",")
        _.each(attrs, attr =>{
            data[attr] = attr == "data" ? _.clone(this[attr]) : this[attr]
        })

        if(!this.isLeaf){
            data[childrenKey] = _.map(this.children, child => {
                return child.dump(childrenKey)
            })
        }

        return data
    }

    addChild(node, pos=-1){
        if(node.parent == this) return
        if(pos < 0){
            this.children.push(node)
        }else{
            this.children.splice(pos, 0, node)
        }
        node.parent = this
        node.level = this.level + 1
        if(this.isChecked && !this.isCheckNotBroadcast){
            node.isChecked = true
        }
    }

    addNeighbor(node, isPrev=false){
        let parent = this.parent
        let pos = _.indexOf(parent.children, this)
        if(!isPrev) pos++
        parent.addChild(node, pos)
    }

    delChild(node){
        let count = this.children.length
        if(count == 0) return

        this.children = _.filter(this.children, child => {
            return child != node
        })

        if(this.children.length != count && !this.isCheckNotBroadcast){  // 有变化，方变更 checked
            if(this.children.length == 0){ // 无子项
                this.isCheckIndeterminate = false
            }else{
                this.check(this.isChecked, "up")
            }
        }
    }

    delSelf(){
        if(this.parent) this.parent.delChild(this)
    }

    expand(value){
        if(this.isLeaf || this.isExpand === value) return
        this.isExpand = _.isNil(value) ? (!this.isExpand) : value

        if(this.isExpand){ // 若展开，则向上传播
            this.broadcast("expand", this.isExpand, "up")
        }   
    }

    check(value, broadcastDirection){
        switch (broadcastDirection) {
        case "up":
            var isCheckIndeterminate = false
            value = true
            _.each(this.children, child =>{
                if(child.isChecked || child.isCheckIndeterminate) isCheckIndeterminate = true
                value = value && child.isChecked
            })
            this.isCheckIndeterminate = !value && isCheckIndeterminate
            this.isChecked = value
            break
        default:
            if(this.isChecked === value) return
            this.isChecked = _.isNil(value) ? (!this.isChecked) : value
            if(this.isChecked) this.isCheckIndeterminate = false
            break
        }
        if(!this.isCheckNotBroadcast) this.broadcast("check", this.isChecked, broadcastDirection)
    }

    broadcast(method, value, direction){
        if(this.isRoot) return

        if(!direction){
            this.broadcast(method, value, "down")
            this.broadcast(method, value, "up")
            return
        }

        if(direction == "up"){
            let parent = this.parent
            if(parent.isRoot) return
            parent[method](value, direction)
        }else{
            _.each(this.children, child =>{
                child[method](value, direction)
            })
        }
    }
}
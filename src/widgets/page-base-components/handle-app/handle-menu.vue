<template>
  <div style="padding-bottom: 30px">
    <div class="header">
      {{levelMenuMap[level]}}
    </div>
    <div class="contain" style="display: flex">
      <drag-tree
          style="overflow: auto;flex: 1;margin-right: 20px;border: 1px solid #dfe6ec;"
          ref="dragTree"
          :expandOnClickNode="false"
          :menus="menus"
          :appName="appName"
          :level-name="levelMenuMap[level]"
          :highlight-current="true"
          :is-ready="true"
          :prop="dataProps"
          :check-strictly="true"
          :render-content="renderTreeContent"
          :getNodeList="true"
          @get-node-list="getDragNodeList"
      >
      </drag-tree>
      <el-table
          :data="nodeList"
          style="flex: 2">
        <el-table-column
            prop="label"
            label="菜单名称"
        >
          <template slot-scope="scope">
            <div :style="nodeStyle(scope.row)" v-if="curNode !==scope.row">
              {{scope.row.name}}
            </div>
            <el-input v-if="curNode ==scope.row" v-model="curNode.name"></el-input>
          </template>
        </el-table-column>
        <el-table-column
            prop="index"
            label="index"
        >
          <template slot-scope="scope">
            <div :style="nodeStyle(scope.row)" v-if="curNode !==scope.row">
              {{scope.row.index}}
            </div>
            <el-input v-if="curNode ==scope.row" v-model="curNode.index"></el-input>
          </template>
        </el-table-column>
        <el-table-column
            prop="url"
            label="url(叶子节点才需要)"
        >
          <template slot-scope="scope">
            <div v-if="curNode !==scope.row || curNode.children.length !== 0">
              {{scope.row.url }}
            </div>
            <el-input v-if="curNode ==scope.row  && curNode.children.length== 0 && curNode.canEditUrl" v-model="curNode.url"></el-input>
          </template>
        </el-table-column>
        <el-table-column
            width="70"
            prop="address"
            label="操作">
          <template slot-scope="scope">
            <el-button v-if="curNode !==scope.row" type="text" @click="showEditNodeInput(scope.row)">编辑</el-button>
            <el-button v-if="curNode ==scope.row" type="text" @click="comfirmEditNode">确定</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <span class="tip">
        {{errorTips}}
      </span>
    </div>
  </div>
</template>
<script>
  let levelMenuMap = {
    group: '集团层级菜单',
    team: '公司层级菜单',
    project: '项目层级菜单',
  }
  import DragTree from 'src/widgets/drag-tree/tree.vue'

  export default {
    components: {DragTree},
    watch: {},
    created() {
    },
    props: {
      level: {
        type: String,
        default: 'group'
      },
      menus: {
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
        nodeList: [],
        curNode: null,
        levelMenuMap: levelMenuMap,
        errorTips: '',
        dataProps: {
          index: 'index',
          children: "children",
          name: "menu_name",
          id: "menu_id"
        },
      };
    },
    methods: {
      showEditNodeInput(node) {
        this.curNode = node
        if (node.children.length !== 0) {
          node.url = ''
          node.canEditUrl =false
        }else{
          node.canEditUrl = true
        }
      },
      comfirmEditNode() {
        this.curNode = null
      },
      nodeStyle(row) {
        return {
          paddingLeft: `${(row.level - 1 ) * 20 }px`
        }
      },
      getDragNodeList(nodeList) {
        this.nodeList = nodeList
      },
      getDateByWithVal(data, propVal) {
        let _key
        _.each(this.dataProps, (val, key) => {
          if (val === propVal) {
            _key = key
            return
          }
        })
        return data[_key]
      },
      renderTreeContent(h, node) {
        return (
          < span class = "node-block" >
            {node.name}
           </span>
        )
      },
      validateMenus() {  // 验证规则 1 index 必填 2 每一层级的index 不能相同 3 下级的index 需要是上级的延续， 比如 本级index 为 houseqm/issue_manage 那么上级必须是houseqm  4 叶子节点必须有url
        let nodeList = this.nodeList

        let firstLevelMenus = _.filter(nodeList, node => { // 找出第一层级的节点
          return node.level === 1
        })
        //1 验证每一层级是否都有填index
        let noIndexInMenus = _.filter(nodeList, node => {
          return node.index === ''
        })
        if (noIndexInMenus.length !== 0) {
          let errorListnames = _.join(_.map(noIndexInMenus, menu => {
            return menu.name
          }), '，')
          this.showTip(`${errorListnames}未填写索引`)
          return false
        }
        //2 验证每一层级的index 是否相同
        let repeatList = []
        let rootNode = _.get(_.get(firstLevelMenus, '0'), 'parent')

        function getRepeatList(repeatList, sameLevelMenus, parentNode) {
          let indexArr = _.map(sameLevelMenus, menu => {
            return menu.index
          })

          if (_.uniq(indexArr).length !== indexArr.length) {
            repeatList.push(parentNode)
          }
          _.each(sameLevelMenus, menu => {
            getRepeatList(repeatList, menu.children, menu)
          })
        }

        getRepeatList(repeatList, firstLevelMenus, rootNode)
        if (repeatList.length !== 0) {
          let errorListnames = _.join(_.map(repeatList, menu => {
            return menu.name || menu.name
          }), '，')
          this.showTip(`${errorListnames}的子节点有重复的index`)
          return false
        }
        //3 验证下一层层级的index是否紧跟着上一层级
        function getErrorNodeList(errorList, node, parent) {
          let childIndexList = node.index.split('/')
          let parenetIndex = _.join(_.slice(childIndexList, 0, childIndexList.length - 1), '/')
          if (parenetIndex !== _.toString(parent.index)) {
            errorList.push(node)
          }
          _.each(node.children, child => {
            getErrorNodeList(errorList, child, node)
          })
        }

        let errorList = []
        _.each(firstLevelMenus, menu => {
          _.each(menu.children, child => {
            getErrorNodeList(errorList, child, menu)
          })
        })
        if (errorList.length !== 0) {
          let errorListnames = _.join(_.map(errorList, menu => {
            return menu.name
          }), '，')
          this.showTip(`${errorListnames}的index跟它的父节点的index对不上`)
          return false
        }
        //4 验证叶子节点是否有填写url
        function getNoUrlList(noUrlList, menu) {
          if (menu.children.length == 0 && !menu.url ) {
            noUrlList.push(menu)
          }
          _.each(menu.children, child => {
             getNoUrlList(noUrlList, child)
          })
        }

        let noUrlList = []
        _.each(firstLevelMenus, menu => {
          getNoUrlList(noUrlList, menu)
        })
        if (noUrlList.length !== 0) {
          let noUrlListNames = _.join(_.map(noUrlList, menu => {
            return menu.name
          }), '，')
          this.showTip(`${noUrlListNames}的url未填写`)
          return false
        }
        //5 判断所在层级的index是否正确
        let indexNoMatchLevelList = []
        function getIndexNoMatchLevelList(menu,indexNoMatchLevelList){
          let indexLen = _.split(_.trim(menu.index,'/'),'/').length
          if (indexLen !== menu.level) {
            indexNoMatchLevelList.push(menu)
          }
          _.each(menu.children, child => {
            getIndexNoMatchLevelList(child,indexNoMatchLevelList)
          })
        }
        _.each(firstLevelMenus, menu => {
            getIndexNoMatchLevelList(menu,indexNoMatchLevelList)
        })
        if (indexNoMatchLevelList.length !== 0) {
          let noUrlListNames = _.join(_.map(indexNoMatchLevelList, menu => {
            return menu.name
          }), '，')
          this.showTip(`${noUrlListNames}的层级index对应不上`)
          return false
        }

        //6 根菜单是不是以appName开头
        let firstLevelNode = _.head(this.nodeList)
        if(firstLevelNode && firstLevelNode.index !==  `/${this.appName}`){
          this.showTip(`${firstLevelNode.name}的index 必须以应用英文名字开头`)
          return false
        }
        this.hideTip()
        return true
      },
      showTip(tip) {
        this.errorTips = tip
        $('.tip').slideDown(300)
      },
      hideTip() {
        this.errorTips = ''
        $('.tip').slideUp(300)
      },
      getLevelMenus() {
        let firstLevelMenus = _.filter(this.nodeList, node => { // 找出第一层级的节点
          return node.level === 1
        })
        this.orderNodeList(firstLevelMenus)
        return this.nodeList
      },
      orderNodeList(nodeList) {
        _.each(nodeList, (menu, order) => {
          menu.index = this.getDateByWithVal(menu, 'index')
          menu.menu_name = this.getDateByWithVal(menu, 'menu_name')
          menu.menu_id = this.getDateByWithVal(menu, 'menu_id') || 0
          menu.children = this.getDateByWithVal(menu, 'children')
          menu.order = order
          menu.level = this.level
          if (menu.children.length !== 0) {
            menu.url = ''
          }else{
            this.appendPageLevel(menu)
          }
          this.orderNodeList(menu.children)
        })
      },
      appendPageLevel(menu){
        const OrgLevels = {
          group : 'lg',
          team : 'lt',
          project : 'lp'
        }
        let level = menu.level
        let prefix = ''
        switch (level){
          case 'group':
            prefix = OrgLevels.group
            break;
          case 'team':
            prefix = OrgLevels.team
            break;
          case 'project':
            prefix = OrgLevels.project
            break;
        }
        let menuUrl = menu.url
        menuUrl = menuUrl.split('=>')
        if(menuUrl.length == 1){
          menu.url = `${prefix}=>${menu.url}`
        }else{
          if(menuUrl[0].indexOf(prefix) == -1){
            menu.url = `${menuUrl[0]},${prefix}=>${menuUrl[1]}`
          }
        }
      },
    }
  };
</script>

<style lang="less" scoped>
  .header {
    font-size: 15px;
    line-height: 30px;
    font-weight: 400;
  }

  .footer {
    position: absolute;
    height: 30px;
    line-height: 30px;
    width: 80%;
    .tip {
      display: none;
      color: red;
    }
  }
</style>

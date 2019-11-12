<template>
  <el-tabs 
    v-model="activeName" 
    :class="type=='card'?'tab-card':''" 
    :type="type" 
    @tab-click="onTabChange">
    <el-tab-pane 
      :label="tab.label" 
      :name="tab.name" 
      v-for="tab in tabsData" 
      :key="tab.name">
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import PartBase from "./part-base"
import qs from 'qs'

let uiType = "part/tabs"

export default {
  mixins: [PartBase],

  uiRegister(context) {
    // 注册组件，绑定生成对应conf、tpl
    context[uiType] = this
  },

  uiGenConf(options) {
    /*
      生成
      options:
        .data: // tabs 列表
          [
            {label: "文本", name: "key"}
          ]

        .defaultActiveName: // 默认选中名称
        .type: //'card'或默认类型，
        .watchVar: {
            name: "a" // 监控的变量名
            input(v){  // 变量变化后，输入的转换
              return v
            },
            output(v){  // tabs.activeName变化，输出到变量的转换
              return v
            }
          }
    */
    let conf = {
      uiType,
      data: [],
      type: null,
      defaultActiveName: ""
    }

    return _.merge(conf, options)
  },

  uiGenTpl({ name, conf, ui }) {
    return `<ns-tabs name="${name}"></ns-tabs>`
  },

  data() {
    return {
      activeName: "",
      visibleTabNames: []
    }
  },
  computed: {
      type(){
        return this.nsget('type','')
      },
      tabsData(){
        let showTbs = this.getShowTabs()
        this.visibleTabNames = _.map(showTbs, "name")
        return showTbs
      }
  },
  methods: {
    readyCreated() {
      let defaultActiveName = this.nsget("defaultActiveName")
      this.setActiveTab( defaultActiveName)
      this.nswatchVar((name, v) => {
        this.setActiveTab(v)
      })
    },
    setActiveTab(activeName){
      if(activeName && activeName != this.activeName){
        let visibleTabNames = this.visibleTabNames
        let isTabExist = _.includes(visibleTabNames, activeName)
        let firstVisibleTabNames = _.head(visibleTabNames)
        this.activeName = isTabExist ? activeName : firstVisibleTabNames
        if(!isTabExist) this.changeTab(firstVisibleTabNames)
      }
    },
    onTabChange(tab) {
      this.changeTab(tab.name)
    },
    changeTab(name){
      this.nssetVar(name)
    },
    getShowTabs(data){
      let showTabs = this.nsget('data')
      let hideTabs = this.getHideTabs()
      if(!_.isEmpty(hideTabs)){
        showTabs = _.filter(showTabs, (tab)=>{
          return !_.includes(hideTabs, this.getTabHideNameByRule(tab.name))
        })
      }
      return showTabs
    },
    getTabHideNameByRule(name){
      let nameArr = _.split(name, "/")
      _.each(nameArr, (name,index)=>{
        nameArr[index] = _.head(name) + _.last(name) //截取第一个和最后一个字符代替全称，比如使用ow代替overview
      })
      return _.join(nameArr, "/")
    },
    getHideTabs(){
      let hideTabs = qs.parse(_.trimStart(location.search, "?"))
      hideTabs = hideTabs["hd_tbs"]
      
      if(hideTabs){
        hideTabs = _.head(_.split(hideTabs, "#/"))
        hideTabs = _.split(hideTabs, ",")
        return hideTabs
      }
      return []
    }
  }
}
</script>
<style lang="less">
  .tab-card{
    .el-tabs__item{
      font-weight: bold;
      color: #666;
    }
  }

</style>




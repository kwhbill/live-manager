<script>
  import Vue from "vue"
  export default {
    name: 'nav-menu',
    props: ['data', 'index'],

    data(){
      return {
        itemMap: {},
        indexSelected: ''
      }
    },

    watch: {
      data(data){
        if(data){
          this.indexSelected = "";
          _.delay(()=>{
            this.indexSelected = this.index;
          }, 100);
        }
      }
    },

    render(h){
      let node = (
        <el-menu class="nav-menu" theme="dark" default-active={this.indexSelected} unique-opened={true} onSelect={this.onSelect}>
          {this.renderTreeItems(h, this.data)}
        </el-menu>
      )

      if(!_.isEmpty(this.indexSelected)){
          let item = this.itemMap[this.indexSelected]
          if(item){
              let itemPaths = _.map(item.indexPaths, (index)=>{
                  return this.itemMap[index]
              })

              this.$emit("active", item, itemPaths)
          }

      }

      return node
    },

    methods: {
      onSelect(index, indexPaths, item){
        // 额外追加一个参数：url
        let itemPaths = _.map(indexPaths, (indexPath)=>{
          return this.itemMap[indexPath]
        })
        this.$emit('select', _.last(itemPaths), itemPaths);
      },

      iconClass(item){
        return {
          "fa": true,
          [`fa-${item.icon}`]: !!item.icon,
          "fa-4": true
        }
      },

      renderTreeItems(h, items, indexPaths=[]){
        let isNoEn = Vue.i18nGetLocale() != "en"

        return _.map(items, (item, i)=>{
          item.indexPaths = _.concat(indexPaths, item.index)
          this.itemMap[item.index] = item
          if(!item.children){
            // 记录
            return (
              <el-tooltip effect="dark" content={item.name} placement="right" disabled={isNoEn}>
                <el-menu-item index={item.index}>
                  
                  {item.icon ? <i class={this.iconClass(item)}></i> : ""}
                  {item.name}
                </el-menu-item>
              </el-tooltip>
            )
          }else{
            return (
              <el-submenu index={item.index}>
                <template slot="title">
                  {item.icon ? <i class={this.iconClass(item)}></i> : ""}
                  {item.name}
                </template>
                {this.renderTreeItems(h, item.children, item.indexPaths)}
              </el-submenu>
            )
          }
        })
      }
    }
  }
</script>


<style lang="less">
.nav-menu {
  overflow-x: hidden;
  i {
    margin-right: 8px;
  }
  .el-menu-item.is-active{
    background-color: #bfcbd9 !important;
    color: #48576a  !important;
  }
}
</style>

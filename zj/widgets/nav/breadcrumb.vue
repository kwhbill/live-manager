<template>
    <div class="nav-breadcrumb el-breadcrumb">
        <span class="el-breadcrumb__item" v-for="item in mixBreadcrumb" :key="item.name" @click="onClick(item)">
            <span class="el-breadcrumb__item__inner">{{item.name}}</span>
            <span class="el-breadcrumb__separator">/</span>
        </span>
    </div>
</template>


<script>
export default {
  props:{
    title: {
        type: String,
        default: ""
    },
    items: {
        type: Array,
        default(){
            return []
        }
    }
  },
  computed: {
    mixBreadcrumb() {
      return _.concat({ name: this.title },this.items)
    }
  },
  methods:{
      onClick(item){
          if(item.url){
              this.$emit("click", item)
          }
      }
  }
}
</script>

<style lang="less" >
.nav-breadcrumb {
    height: 20px;
}
</style>


<template>
      <router-view></router-view>
</template>

<script>
import PartBase from "./part-base"

let uiType = "part/router"

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
          watchVar: {
            name: "a" // 监控的变量名
            input(v){  // 变量变化后，输入的转换
              return v
            },
            output(v){  // 路由变化，输出到变量的转换
              return v
            }
          }
    */
    let conf = {
      uiType,
      watchVar: ""
    }

    return _.merge(conf, options)
  },

  uiGenTpl({ name, conf, ui }) {
    return `<ns-router name="${name}"></ns-router>`
  },

  methods: {
    readyCreated() {
      this.nswatchVar((name, v) => {
        this.$router.push({ path: v })
      })
      this.nssetVar(this.$route.path)
    }
  }
}
</script>




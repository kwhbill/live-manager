
<script>
  import Cookie from "js-cookie"
  import qs from 'qs'
  // 引入 zj 的库
  var BasePage = zj.widgets.BasePage;

  export default {
    // 页面均要继承BasePage，完成与App的通信工作
    mixins: [BasePage],
    data() {
      return {
        menu:'',
        title: this.$t("p.zj_title"),
        index: "页面索引标识",
        loginpage: true,
        dialogTableVisible: false,
      }
    },
    methods: {
      setup(app) {
        // 框架信息（用户资料等）已加载完毕，此处进行页面的初始化

      },
      changeLanguage(command){
        zj._Vue.i18nSetLocale(command)
      }

    }
  }
</script>
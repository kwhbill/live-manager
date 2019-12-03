<script>
import NsStage from "./ns/stage";
import qs from "qs";

export default {
  mixins: [NsStage],
  beforeCreate() {},
  data() {
    zj.app = this;
    return {
      state: {
        isReady: false, // after app setup, be true
        loadingState: [],
        netErrs: [],
        rootCategory: null,
        rootPartner: null
      },

      page: null,
      pageTitle: "",
      pageBreadcrumb: [],
      pageMap: {},

      accessInfo: {
        user_info: {
          real_name: "",
          user_id: 0,
          user_name: "",
          group_id: 0
        }
      },
      menu: {
        allowIndexMap: {},
        levels: ["group", "team", "project"],
        level: "",
        items: [],
        currentIndex: ""
      },
      sysui: {
        icon: "",
        name: "",
        title: ""
      }
    };
  },
  methods: {
    onPageCreated(page) {
      this.page = page;
      this.setup(() => {
        // layout app 初始化完后，将回调 page 的初始化
        this.nsset("/isReady", true);
        if (this.page.setup) this.page.setup();
      });
    },

    async setup(resolve) {
      resolve();
    },
    loadAccessInfo() {
      // 加载用户及授权相关信息
      let res = zj.net
        .live({
          url: "/manager/info/",
          params: zj.utils.pageParam()
        })
        .then(res => {
          this.sysui.name = res.data.data.managerName;
          localStorage.setItem("schoolId", res.data.data.schoolId);
        })
        .catch(error => {
          let status = _.get(error, "response.data.status");
          if (status == 401) {
            let errMsg = _.get(res, "response.data.message", "");
            this.$confirm(
              `建议刷新页面或重新登录，错误信息 -- ${errMsg}`,
              "加载用户授权信息发生错误",
              {
                confirmButtonText: "刷新",
                cancelButtonText: "切换账号"
              }
            ).then(() => {
                window.location.reload();
              })
              .catch(() => {
                let urlLogin = zj.utils.urlAppendParam("/opms/login.html", {
                  to: window.location.href
                });
                zj.utils.redirect(urlLogin);
              });
            return;
          }
        });
    },
    sortMenuByOrder(data, type = ["desc"]) {
      data = _.orderBy(data, ["order"], type);
      return data;
    },
    async loadProdMenu() {
      this.menu.currentIndex = _.get(this.page, "menu");
      let items = [
        {
          n: "直播后台管理",
          items: [
            {
              n: "课程",
              i: "course",
              u: "course.html"
            },
            {
              n: "教室",
              i: "classroom",
              u: "classroom.html"
            },
            {
              n: "学生",
              i: "student",
              u: "student.html"
            },
            {
              n: "老师",
              i: "teacher",
              u: "teacher.html"
            },
            {
              n: "上课时间表",
              i: "timetable",
              u: "timetable.html"
            }
          ]
        }
      ];
      this.menu.items = this.transformMenuItems(items);
    },

    transformMenuItems(items) {
      // 转换菜单项，并进行权限过滤
      items = _.compact(
        _.map(items, item => {
          let itemNew = {
            icon: item.c,
            url: item.u,
            name: item.n,
            index: item.i || _.uniqueId()
          };
          if (item.items) {
            itemNew.children = this.transformMenuItems(item.items);
            // 有菜单子项，却无权访问任一，不显示该父节点
            if (!item.hole && _.isEmpty(itemNew.children)) return;
          }
          return itemNew;
        })
      );
      return items;
    },

    transformUrl(url) {
      // 转换并返回含指令的url
      if (!url) return url;
      url = url + "?" + "schoolId=" + zj.utils.pageParam().schoolId;
      return url;
    },

    onUrlItemClick(item) {
      let url = item.raw ? item.url : this.transformUrl(item.url);
      if (url) {
        zj.utils.redirect(url);
      }
    }
  }
};
</script>
<style>
/* fix：页面整体下陷  */

.el-loading-mask {
  top: 0 !important;
}
</style>

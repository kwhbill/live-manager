<script>
  import NsStage from "./ns/stage"
  import qs from "qs"

  export default {
    mixins: [NsStage],
    beforeCreate() {
    },
    data() {
      zj.app = this
      return {
        state: {
          isReady: false, // after app setup, be true
          loadingState: [],
          netErrs: [],
          rootCategory: null,
          rootPartner:null
        },

        page: null,
        pageTitle: "",
        pageBreadcrumb: [],
        pageMap:{},

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

      }
    },
    methods: {
      onPageCreated(page) {
        this.page = page
        this.setup(() => { // layout app 初始化完后，将回调 page 的初始化
          this.nsset("/isReady", true)
          if (this.page.setup) this.page.setup()
        })
      },

      setup(resolve) {
        resolve()
      },

      async loadAccessInfo() {
        // 加载用户及授权相关信息
        let res = await zj.net.open({
          url: "/user/detail/",
          params: zj.utils.pageParam()
        })
        if(res.data.result !== 0){
          let errMsg = _.get(res, "data.message", "")
          this.$confirm(
            `建议刷新页面或重新登录，错误信息 -- ${errMsg}`,
            "加载用户授权信息发生错误",
            {
              confirmButtonText: '刷新',
              cancelButtonText: '切换账号',
            }
          ).then(()=>{
            window.location.reload()
          }).catch(()=>{
            let urlLogin = zj.utils.urlAppendParam("/opms/pages/login.html", {
              to: window.location.href
            })
            zj.utils.redirect(urlLogin)
          })
          return
        }
      },
      sortMenuByOrder(data, type = ["desc"]){
        data = _.orderBy(data, ["order"], type);
        return data
      },
      async loadProdMenu() {
        this.menu.currentIndex = _.get(this.page,"menu")
        let menu = {
          "head": [],
          "middle": [{
            n: "直播后台管理",
            items: [
              {
                n: "课程表",
                i: "course",
                u: "course.html"
              }
            ]
          }],
          "foot": []
        }

        // 合并菜单
        let menuHead =  menu.head
        let menuMiddle = menu.middle
        let menuFoot =  menu.foot
        menuHead = this.transformMenuItems(menuHead)
        menuMiddle = this.transformMenuItems(menuMiddle)
        menuFoot = this.transformMenuItems(menuFoot)
        // 移动和植入特定位置
        let items = _.concat(menuHead, menuMiddle, menuFoot)

        menu = {children: items}
        this.menu.items = menu.children
      },


      transformMenuItems(items) {
        // 转换菜单项，并进行权限过滤
        items = _.compact(_.map(items, (item) => {

          let name = this.$t(`menu.${item.n}`)
          let menuPrefix = "menu."
          if(_.startsWith(name, menuPrefix)){
            name = _.map(name.substr(menuPrefix.length).split("_"), word=>{
              return _.upperFirst(word)
            }).join(" ")
          }
          let order = _.get(item, "order", 0)
          let itemNew = {
            icon: item.c,
            url: item.u,
            name,
            index: item.i || _.uniqueId(),
            hole: item.hole,
            jump: item.jump,
            order,
          }
          if (item.items) {
            itemNew.children = this.transformMenuItems(item.items)
            // 有菜单子项，却无权访问任一，不显示该父节点
            if(!item.hole && _.isEmpty(itemNew.children)) return
          }
          return itemNew
        }))
        return this.sortMenuByOrder(items)
      },

      transformUrl(url) {
        // 转换并返回含指令的url
        if (!url) return url

        // 指令处理
        let symbol = "=>"
        let notOldDomain = true
        let pageParam = zj.utils.pageParam()
        let levelId = `${this.menu.level}_id`
        let params = {
          [levelId]: pageParam[levelId]
        }

        // 模板替换
        url = _.template(url)(pageParam)
        let cmds = []

        if (_.includes(url, symbol)) { // 含有指令
          let queryKeyMap = {
            "?g": "group_id",
            "?t": "team_id",
            "?p": "project_id",

            "lg": "group",
            "lt": "team",
            "lp": "project"
          }

         let [cmdNew, urlNew] = _.split(url, symbol)

          url = urlNew
          cmds = _.split(cmdNew, ",")

          _.each(cmds, (cmd) => {
            switch (cmd) {
              case "?g":
              case "?t":
              case "?p":
                // 追加 ? group_id,team_id,project_id
                let key = queryKeyMap[cmd]
                params[key] = pageParam[key]
                break;
              case "lg":
              case "lt":
              case "lp":
                // 追加 ? page_level
                params["page_level"] = queryKeyMap[cmd]
                break;
              case "z3":  // zhijian3 的路径处理
                url = "/v3/" + url
                break
              case "z2": // zhijian2 的路径处理
                url = "/" + url
                break;
              default:   // public 的路径处理
                break;
            }
          })
          notOldDomain = _.isEmpty(_.intersection(cmds, ["z2", "z3"]))
        }

        if (notOldDomain) { // 未做旧域名的处理，为新页面，加public前缀
          url = "/opms/" + url
        }

        // 合并URL
        let r = /\?([^#]+)/
        let query = _.get(url.match(r), "1")

        if (query) { // 有 query，合并 baseQueryMap
          let queryMap = qs.parse(query)
          params = zj.utils.extendNew(queryMap, params)
          params = this.filterParamByPageLevel(params, cmds)
          url = _.replace(url, query, qs.stringify(params))
        } else { // 插入 baseQueryMap
          if (!_.isEmpty(params)) {
            params = this.filterParamByPageLevel(params, cmds)
            url = url + '?' + qs.stringify(params)
          }
        }

        return url
      },

      filterParamByPageLevel(params, cmds){
        // page level 对 group,team,project 的过滤
        let lvKeys = [
          ["lg", "team,project"],
          ["lt", "project"]
        ]
        _.each(lvKeys, ([lv, keys])=>{
          let inCase = _.includes(cmds, lv)
          if(inCase){
            keys = _.split(keys, ",")
            _.each(keys, key => {
              delete params[`${key}_id`]
            })
          }
        })

        return params
      },

      onUrlItemClick(item){
        let url = item.raw ? item.url : this.transformUrl(item.url);
        if(url){
          zj.utils.redirect(url);
        }
      }
    }
  }
</script>
<style>
    /* fix：页面整体下陷  */

    .el-loading-mask {
        top: 0!important;
    }
</style>

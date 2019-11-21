<template>
  <div class="app" :class="[menuHide ? `app-nomenu`:``,menuDisabled ? 'app-disable':'' ]">
    <div class="bg-box" :class="menuDisabled ? 'bg-none':''">
      <div class="mini-nav">
        <span @click="menuHide =true">
          <i class="el-icon-d-arrow-left"></i>
        </span>
      </div>
    </div>
    <div ref="appMenu" class="app-menu">
      <div class="status">
        <div class="sysui-box">
          <div class="sysui-content">
            <div class="">
              <img :src="sysui.icon" alt="">
            </div>
            <span>{{sysui.name}}</span>
          </div>
        </div>
        <nav-level :level="menu.level" :levels="menu.levels"></nav-level>
      </div>
      <div class="menu">
        <nav-menu :data="menu.items" :index="menu.currentIndex" @select="onMenuSelect" @active="onMenuActive"></nav-menu>
      </div>

      <div class="mini-nav" @click="menuHide =true">
        <span>
          <i class="el-icon-d-arrow-left"></i>
        </span>
      </div>
    </div>
    <div class="mini-nav">
      <span @click="menuHide = false">
        <i class="el-icon-d-arrow-right"></i>
      </span>
    </div>

    <div class="app-page">
      <div class="app-top-box">
        <nav-breadcrumb class="zj-breadcrumb breadcrumb" :items="pageBreadcrumb" :title="pageTitle" @click="onBreadcrumbClick"></nav-breadcrumb>
        <div class="nav-right">
          <el-dropdown @command="handleCommand" class="nav-right-item">
            <div class="el-dropdown-link">
              <div class="title">
                <i class="fa fa-user-circle-o fa-2" aria-hidden="true"></i>
                {{accessInfo.user_info.real_name}}
                <i class="fa fa-caret-down"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">{{$t("app.layout.exit")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

      </div>
      <div class="page-box">
        <page class="page" @created="onPageCreated"></page>
      </div>
    </div>

    <nav-dlg-pwd :is-show="dlgPwdShow" @hide="dlgPwdShow = false"></nav-dlg-pwd>
    <nav-return-to></nav-return-to>

    <ns-loading name="appLoading"></ns-loading>
    <notification ref="appNotice" :queue="state.netErrs"></notification>
  </div>
</template>


<script>
import Vue from "vue";
import Cookie from "js-cookie";
import BaseApp from "zj/widgets/base_app";

export default {
  mixins: [BaseApp],
  watch: {
    pageTitle(title) {
      document.title = [this.sysui.title, title].join(" | ");
    }
  },
  data() {
    return {
      dlgPwdShow: false,
      localeMap: Vue.localeMap,
      locale: Vue.localeMap[Vue.i18nGetLocale()],
      menuHide: false,
      menuDisabled: true
    };
  },
  methods: {
    async setup(resolve) {
      // if(location.pathname !=='/opms/pages/login.html'){
      //   await this.loadAccessInfo();
      // }
      this.pageTitle = this.page.title || " ";
      this.menuDisabled = _.get(this.page, "menu.disabled", false);
      if (!this.menuDisabled) {
        await this.loadProdMenu();
      } else {
        document.body.style.background = "#f7f7f7";
      }
      resolve();
    },

    onMenuSelect(item, itemPaths) {
      this.onUrlItemClick(item);
    },

    onMenuActive(item, itemPaths) {
      let titles = _.map(itemPaths, item => {
        return item.name;
      });

      this.pageTitle = _.join(titles, " - ");
    },
    onBreadcrumbClick(item) {
      this.onUrlItemClick(item);
    },
    handlei18n(lang) {
      Vue.i18nSetLocale(lang);
      window.location.reload();
    },
    async handleCommand(command) {
      if (command == "logout") {
        let res = await zj.net.open({
          method: "POST",
          url: "login/logout/"
        });
        if (res.data.result == 0) {
          zj.utils.redirect("/opms/pages/login.html");
        }
      } else {
        this.dlgPwdShow = true;
      }
    },
    handleRight() {
      this.$alert(
        `您暂时没有权限进行该操作，您可以更换帐号，或联系管理员处理`,
        "用户没有授权",
        {
          confirmButtonText: "切换账号",
          callback: action => {
            
            let urlLogin = zj.utils.urlAppendParam("/login", {
            to: window.location.href
          });

          zj.utils.redirect(urlLogin);
          }
        })
    }
  }
};
</script>


<style lang="less">
@menuWidth: 200px;
@pageLeft: 220px;
html {
  height: 100%;
}
body {
  padding: 0px !important;
  margin: 0px !important;
  height: 100%;
  background: #ffffff !important;
}
.left {
  float: left;
}
.net-err-notify {
  .el-notification__content {
    font-size: 12px !important;
    word-wrap: break-word;
    word-break: normal;
  }
}

.app {
  position: relative;
  margin: 0px;
  height: 100%;
  background: #ffffff !important;

  .bg-box {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 200px;
    background: none;
    z-index: 1;
    background: #324057;

    &:hover {
      .mini-nav {
        display: block;
      }
    }
  }
  .bg-none {
    background: none;
  }
  .mini-nav {
    position: fixed;
    z-index: 3;
    left: 200px;
    top: 0px;
    display: none;
    span {
      display: block;
      width: 37px;
      height: 37px;
      text-align: center;
      line-height: 37px;
      background: #324057;
      cursor: pointer;
      i {
        color: #bfcbd9;
        font-size: 14px;
      }
    }
  }
  .app-menu {
    position: absolute;
    z-index: 2;
    &:hover {
      .mini-nav {
        display: block;
      }
    }
  }
  .page-box {
    margin-left: 215px;
    margin-right: 15px;
    margin-top: 20px;
    h3 {
      padding: 0;
      margin: 0;
      font-size: 16px;
      font-weight: normal;
    }
  }
  .sysui-box {
    text-align: left;
    padding: 5px 15px 0;
    background: #293a56;
  }
  .sysui-content {
    display: inline-block;
    overflow: hidden;

    & > * {
      float: left;
    }
    div {
      width: 25px;
      height: 25px;
      overflow: hidden;
      img {
        width: 100%;
        height: auto;
        min-height: 100%;
      }
    }
    span {
      margin-top: 4px;
      margin-left: 3px;
      width: 130px;
      height: 24px;
      line-height: 24px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .app-menu {
    float: left;
    padding: 0px !important;
    width: @menuWidth;
    font-size: 13px;
    color: #bfcbd9;
    background-color: #324057;

    .status {
      position: fixed;
      left: 0px;
      top: 0px;
      width: @menuWidth;
      z-index: 10000;
      background-color: #324057;

      .user {
        padding: 5px 10px 0px 20px;
        height: 30px;
        border-bottom: 1px solid #475669;
        background: #324057;
        .name {
          float: left;
          line-height: 25px;
        }
        .btn {
          float: right;
          button {
            background-color: #324057;
            border-color: #475669;
          }
        }
      }
    }

    .menu {
      margin-top: 40px;
    }
  }

  .app-page {
    // margin-top: 10px;
    width: 100%;
    height: 100%;
    .app-top-box {
      height: 38px;
      box-shadow: 1px 1px 1px #f3f3f3;
      overflow: hidden;
      margin-left: 200px;
      padding-right: 20px;
      padding-left: 20px;
      background: #ffffff;

      .zj-breadcrumb {
        float: left;
        height: 34px;
        line-height: 34px;
        // background: #293a56;
        .el-breadcrumb__item__inner {
          color: #677484;
        }
      }

      .nav-right {
        float: right;
        .nav-right-item {
          float: left;
          margin-right: 20px;

          .title {
            margin-left: 4px;
            margin-top: 6px;
            font-size: 14px;
            color: #677484;
            cursor: pointer;
          }
        }
      }
    }

    .page {
      background: #fff;
      border-radius: 4px;
      padding: 15px;
      //   margin-top: 15px;
    }
    .popover_task {
      float: left;
      margin-right: 20px;
    }
  }
}
.app-nomenu {
  .bg-box,
  .app-menu,
  .app-menu .status {
    display: none;
  }
  .app-page .app-top-box {
    margin-left: 37px;
  }
  .page-box {
    margin-left: 52px;
  }
  & > .mini-nav {
    display: block;
    position: fixed;
    right: auto;
    left: 0;
    top: 0;
    height: 100%;
    background: #1f2d3d;
    span {
      background: #324057 !important;
    }
  }
}

.app-disable {
  .app-menu {
    z-index: 13;
  }
  .bg-box {
    &:hover {
      .mini-nav {
        display: none;
      }
    }
  }
  .sysui-content span {
    color: #ffffff;
  }
  .page-box {
    position: relative;
    z-index: 11;
    margin-left: 0;
    margin-right: 0;
    margin-top: 0px;
    padding-top: 30px;
    padding-bottom: 30px;
    min-height: 100%;
    box-sizing: border-box;
  }
  .app-menu {
    &:hover {
      .mini-nav {
        display: none;
      }
    }
    .status {
      background-color: #293a56;
      padding-left: 20px;
    }
    .menu {
      display: none;
    }
  }
  .nav-level {
    display: none;
  }
  .app-page {
    .page-box {
      background-color: #f7f7f7;
    }
    .page {
      background-color: #f7f7f7;
      margin-right: 200px;
      margin-left: 200px;
      padding-top: 30px;
    }
    .app-top-box {
      box-sizing: border-box;
      background-color: #2a3a56;
      position: fixed;
      z-index: 12;
      width: 100%;
      margin-left: 0;

      .breadcrumb {
        display: none;
      }
      .nav-right {
        .nav-right-item {
          .title {
            color: #ffffff;
            cursor: pointer;
          }
        }
      }
    }
  }

  .all-btn {
    color: #ffffff !important;
  }
}
</style>

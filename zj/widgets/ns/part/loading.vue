<template>
  <div v-show="isShow" class="app-loading">
      <div class="load-3">
        <p>加载中...</p>
        <div class="line-box">
            <div class="k-line k-line-1"></div>
            <div class="k-line k-line-2"></div>
            <div class="k-line k-line-3"></div>
            <div class="k-line k-line-4"></div>
            <div class="k-line k-line-5"></div>
        </div>
        
      </div>
    </div>
</template>

<script>
import PartBase from "./part-base";

let uiType = "part/loading";

export default {
  mixins: [PartBase],

  uiRegister(context) {
    // 注册组件，绑定生成对应conf、tpl
    context[uiType] = this;
  },

  uiGenConf(options) {
    /*
      生成
      options:

    */
    let conf = {
      uiType
    };

    return _.merge(conf, options);
  },

  uiGenTpl({ name, conf, ui }) {
    return `<ns-loading name="${name}"></ns-loading>`;
  },

  data() {
    return {
      isShow: false,
      loadingMap: {},
      hideTimer: null
    };
  },

  methods: {
    readyCreated() {
      this.nswatch("/loadingState", ([reqId, action]) => {
        if (action == "on") {
          this.loadingMap[reqId] = true;
          this.toShow();
        } else {
          delete this.loadingMap[reqId];
          if (_.isEmpty(this.loadingMap)) {
            this.toHide();
          }
        }
      });
    },
    toHide() {
      if (!this.hideTimer) {
        this.hideTimer = setTimeout(() => {
          this.hideTimer = false;
          this.isShow = false;
        }, 1000);
      }
    },
    toShow() {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer);
        this.hideTimer = false;
      }
      this.isShow = true;
    }
  }
};
</script>



<style lang="less" scoped>
@keyframes k-loadingP {
	0% {
	transform:translateY(0)
}
35% {
	transform:translateY(0);
	opacity:.3
}
50% {
	transform:translateY(-20px);
	opacity:.8
}
70% {
	transform:translateY(3px);
	opacity:.8
}
85% {
	transform:translateY(-3px)
}
}

.app-loading {
  width: 100%;
  height: 2px;
  position: fixed;
  top: 0;
  left: 0;
  text-align: center;
  z-index: 99999;
  color: #76c2ff;
  font-size: 14px;
  .k-line {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 10px;
    background-color: #4b9cdb;
}
  .line-box{
      position: absolute;
      left: 50%;
      top: 17px;
      margin-left: -39px;
  }
  .k-line-1 {
      animation: k-loadingP 2s infinite;
  }
  .k-line-2 {
      animation: k-loadingP 2s infinite;
      animation-delay: .15s;
  }
  .k-line-3 {
      animation: k-loadingP 2s infinite;
      animation-delay: .30s;
  }
  .k-line-4 {
      animation: k-loadingP 2s infinite;
      animation-delay: .45s;
  }
  .k-line-5 {
      animation: k-loadingP 2s infinite;
      animation-delay: .60s;
  }
}
</style>

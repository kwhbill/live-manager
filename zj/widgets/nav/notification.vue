<template>
    <div class="">
    </div>
</template>
<script>
import { Notification } from 'element-ui';
import { MessageBox } from 'element-ui';

class SingleErrNotice{
    constructor(){
        this.single = false
    }
    static showNotice(){
        if(!this.single){
            this.single = true
            this.showNoticeOpreate()
        }
    }
    static showNoticeOpreate(){

    }
    static resetErrNotice(){
        this.single = false 
    }
}

class NoRightErrNotice extends SingleErrNotice {
    constructor(){
        super()
    }
    static showNoticeOpreate() {
        MessageBox.alert(
            `您暂时没有权限进行该操作，您可以更换帐号，或联系管理员处理`,
            "用户没有授权",
            {
            confirmButtonText: "切换账号",
            callback: action => {
                if(action == 'cancel'){
                    this.resetErrNotice()
                    return
                }
                let urlLogin = zj.utils.urlAppendParam("/opms/login.html", {
                    to: window.location.href
                });
                zj.utils.redirect(urlLogin);
            }
            }
        );
    }
}

class NormalErrNotice {
    constructor(err){
        this.err = err
    }
   showNotice() {
    Notification.error({
        customClass: "net-err-notify",
        title: "网络错误",
        message: `${this.err.url}\n${this.err.msg}`
    });
  }
}
export default {
  name: "Notification",
  props: ["queue"],
  watch: {
    queue(errs) {
      if (_.isEmpty(errs)) return;

      let err = errs.shift();
      let notice = this.buildErroNoticeErr(err);

    }
  },
  data() {
    return {
    };
  },
  methods: {
    buildErroNoticeErr(err) {
      let cls;
      switch (err.code) {
        case 12:
        case 401:
        case 403:
          cls = NoRightErrNotice;
          break;

        default:
          cls = new NormalErrNotice(err);
          break;
      }
      return cls.showNotice();
    }
  }
};
</script>
<style lang="less">

</style>

<template>
  <section id="login-wrapper">
    <section class="login-contain">
      <div class="login-box">
        <div class="demo-ruleForm login-form">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="0px"
          >
            <el-form-item prop="managerAccount">
              <el-input
                v-model="ruleForm.managerAccount"
                placeholder="请输入用户名"
                auto-complete="on"
              ></el-input>
            </el-form-item>
            <el-form-item prop="managerPassword">
              <el-input
                ref="input"
                type="password"
                v-model="ruleForm.managerPassword"
                auto-complete="on"
                placeholder="请输入密码"
                @keyup.enter.native="submitForm('ruleForm')"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')"
                >登录</el-button
              >
            </el-form-item>
            <el-button type="text" @click="rootToRegister">注册</el-button>
          </el-form>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import BaseLogin from "src/widgets/login-base-components/base_login.vue";
import qs from "qs";
export default {
  // 页面均要继承BasePage，完成与App的通信工作
  mixins: [BaseLogin],
  components: {},
  created() {},
  data() {
    return {
      ruleForm: {
        managerAccount: "",
        managerPassword: ""
      },
      rules: {
        managerAccount: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, message: "用户名长度不能小于3位", trigger: "blur" }
        ],
        managerPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, message: "用户名长度不能小于6位", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
   rootToRegister(){
     zj.utils.redirect("/opms/register.html")
   },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await zj.net.live({
            method: "POST",
            url: "authority/login/",
            data: JSON.stringify(this.ruleForm)
          });

          if (res.data.result === 0) {
            if (zj.pageParam().to) {
              location.href = zj.pageParam().to;
            } else {
              location.href = "/opms/course.html";
            }
          } else {
            this.$message.error(res.data.msg);
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: content-box;
}
.app .app-page .page {
  margin-left: 0;
}

ul,
li {
  list-style: none;
}

a,
a:hover,
a:active {
  text-decoration: none;
  color: #262626;
}
.clearfix ::after,
.clearfix ::before {
  clear: both;
  content: ".";
  display: block;
  width: 0;
  height: 0;
  visibility: hidden;
}

#login-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: url("../../assets/imgs/login_bg.jpg") no-repeat center;
  background-size: cover;
  height: 100%;
  width: 100%;
  .login-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    z-index: 1000;

    a {
      float: left;
      padding: 7px 23px;
      color: #979ca6;
      img {
        display: inline-block;
        vertical-align: middle;
      }
    }
    ul {
      float: right;
      margin-right: 16px;
      li {
        border: solid 1px #0288d1;
        color: #0288d1;
        border-radius: 4px;
        margin-right: 6px;
        margin-top: 14px;
        float: left;
        a {
          color: #0288d1;
          padding: 5px 15px;
          font-size: 12px;
        }
      }
    }
  }
  .login-contain {
    width: 100%;
    height: 100%;
    position: relative;
    .login-box {
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: #ffffff;
      width: 100%;
      max-width: 400px;
      text-align: center;
      transform: translate(-50%, -50%);
      padding: 50px 10px 40px;
      border-radius: 4px;
    }
    .free-try {
      a {
        color: #337ab7;
        font-size: 16px;
        line-height: 30px;
        height: 30px;
      }
    }
  }
  .login-footer {
    text-align: center;
    line-height: 20px;
    width: 100%;
    position: absolute;
    bottom: 40px;
    font-size: 12px;
  }
  .app-dialog {
    width: 1000px;
    margin: 0 auto;
    .modal-content {
      border-radius: 4px;
      height: 100%;
      padding: 0;
      padding-top: 50px;
      padding-bottom: 24px;
      .app-title {
        font-size: 24px;
        color: #263b53;
        line-height: 25px;
        text-align: center;
        .app-subtitle {
          font-size: 16px;
          color: #36afe8;
        }
      }
    }
  }
}
.demo-ruleForm {
  margin: 30px auto 0 !important;
  width: 250px;
}

.el-input__inner {
  margin-bottom: 30px;
}
.el-form-item {
  margin-bottom: 20px;
}
.el-form-item__error {
  top: 60%;
}
.el-checkbox {
  float: left;
  height: 36px;
  margin-top: -4px;
  margin-bottom: 4px;
}
.el-button {
  height: 40px;
  width: 100%;
}
</style>
<style lang="less">
/*遮罩层*/
.el-dialog {
  z-index: 2001;
}
.v-modal {
  z-index: 2000 !important;
}

.el-dialog--small {
  width: 100%;
  top: 0;
}

.el-dialog__wrapper {
  overflow: hidden;
}

.el-dialog__header {
  padding: 0;
}

.app-dialog .modal-body[data-v-4e4075b2] {
  padding-top: 30px;
}

/*语言下拉框*/
.el-dropdown {
  cursor: pointer;
  color: #0288d1;
  font-size: 12px;
  width: 100%;
}

.el-dropdown span {
  display: block;
  height: 100%;
  padding: 5px 15px;
}

.el-dropdown-menu {
  min-width: 120px;
  border-radius: 5px;
}

.el-dropdown-menu__item {
  font-size: 12px;
  padding-left: 15px;
  line-height: 28px;
}
</style>

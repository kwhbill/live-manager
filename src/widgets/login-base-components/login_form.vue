<template>
  <div class="demo-ruleForm login-form">
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="0px" >
      <el-form-item prop="userName">
        <el-input v-model="loginForm.userName" :placeholder="$t('p.username')" auto-complete="on"></el-input>
      </el-form-item>
      <el-form-item prop="passWord">
        <el-input ref="input" type="password" v-model="loginForm.passWord" auto-complete="on" :placeholder="$t('p.password')" @keyup.enter.native="submitForm('loginForm')"></el-input>
      </el-form-item>
      <el-form-item prop="code" v-show="isShowCode">
        <el-input ref="input" v-model="loginForm.group_code" auto-complete="on" :placeholder="$t('p.enterprise_code')" @keyup.enter.native="submitForm('loginForm')"></el-input>
      </el-form-item>
      <el-checkbox-group v-model="loginForm.type">
        <el-checkbox :label="$t('p.stay_signed_in')" name="type"></el-checkbox>
      </el-checkbox-group>
      <el-form-item>
        <el-button type="primary" @click="submitForm('loginForm')">{{$t('p.signed_in')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import qs from "qs";

export default {
  name: "login-base-components-form",
  props:{
    isShowCode:{
      type: Boolean,
      default:false
    }
  },
  data() {
    let validateCode = (rule,value,callback) => {
      let reg = /\w{0,64}/
     
      if(!reg.test(value)){
        return callback(new Error(zj.t('p.code')))
      }else{
       return callback()
      }
    }
    return {
      loginForm: {
        userName: "",
        passWord: "",
        group_code:zj.pageParam().group_code || "",
        type: false
      },
      rules: {
        userName: [
          { required: true, message: this.$t("p.username"), trigger: "blur" },
          { min: 3, message: this.$t("p.do_no_less_3"), trigger: "blur" }
        ],
        passWord: [
          { required: true, message: this.$t("p.password"), trigger: "blur" },
          { min: 6, message: this.$t("p.do_no_less_6"), trigger: "blur" }
        ],
        code:[
            { validator: validateCode, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm(formName) { 
      this.$refs[formName].validate(async valid => {  
        if (valid) {
          let params = {
            username: this.loginForm.userName,
            password: this.loginForm.passWord,
            group_code:this.loginForm.group_code,
            remember_me: this.loginForm.type === true ? 1 : 0
          };
          let res = await zj.net.open({
            method: "POST",
            url: "login/login/",
            data: qs.stringify(params)
          });
          if(res.data.result === 0 ){
            if (zj.pageParam().to) {
              location.href = zj.pageParam().to;
            } else {
              location.href = "/opms/pages/third_app_manage.html";
            }
          }else{
            this.$message.error(res.data.message);
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
.demo-ruleForm {
  margin: 30px auto 0 !important; 
  width: 250px;
}

.el-input__inner {
  margin-bottom: 30px;
}
.el-form-item {
  margin-bottom:20px;
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

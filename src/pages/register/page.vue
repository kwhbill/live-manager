<template>
  <div class="school">
    <div class="school-inner">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="学校" prop="schoolName">
          <el-input v-model="ruleForm.schoolName"></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名" prop="managerName">
          <el-input v-model="ruleForm.managerName"></el-input>
        </el-form-item>
        <el-form-item label="管理员账号" prop="managerAccount">
          <el-input v-model="ruleForm.managerAccount"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" prop="managerPassword">
          <el-input type="password" v-model="ruleForm.managerPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const MANAGER_ROLE = {
  COMMON: 1,
  SUPPER: 2
};
// 引入 zj 的库
export { router } from "./router";
import qs from 'qs';
var BasePage = zj.widgets.BasePage;
import BaseLogin from "src/widgets/login-base-components/base_login.vue";
export default {
  mixins: [BaseLogin],

  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.managerPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      menu: "app_data",
      ruleForm: {
        schoolName: "",
        managerName: "",
        managerPassword: "",
        managerAccount: "",
        checkPass: "",
        schoolId: "",
        managerRole: MANAGER_ROLE.SUPPER
      },
      rules: {
        schoolName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        managerName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ],
        managerAccount: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ],
        managerPassword: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },

  watch: {},
  created() {
   
  },
  methods: {
    
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await zj.net.live({
            url: "/manager/add",
            method: "POST",
            data: JSON.stringify(this.ruleForm)
          });
          if (res.data.result == 0) {
             zj.utils.redirect("/opms/login.html")
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


<style lang="less" scoped>
.school {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background-size: cover;
  height: 100%;
  width: 100%;
  .school-inner {
    width: 40%;
    margin: 5% auto;
  }
}
</style>

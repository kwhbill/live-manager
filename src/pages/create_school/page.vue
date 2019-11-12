<template>
 <div class="school">
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
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 引入 zj 的库
export { router } from "./router";
var BasePage = zj.widgets.BasePage;
import qs from "qs";
export default {
  mixins: [BasePage],
   data() {
    return {
      menu: "app_data",
      ruleForm: {
        schoolName: ""
      },
      rules: {
        schoolName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  watch: {},
  created() {},
   methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await ly.net.fetchApi({
            url: "/live/school/add",
            method: "POST",
            data: JSON.stringify({
              schoolName: this.ruleForm.schoolName,
            })
          });
          if (res.data.code == 200) {
            this.$router.push({ path: `/manager/${res.data.data.schoolId}` ,params: { schoolId:  res.data.data.schoolId}});
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    async login() {
      let res = await ly.net.fetchApi({
        url: "/spring/login",
        method: "POST",
        data: qs.stringify({
          username: this.username,
          password: this.password
        })

      });
    }
  }
};
</script>


<style lang="less" scoped>
.school {
  width: 40%;
  margin: 10% auto;
}
</style>

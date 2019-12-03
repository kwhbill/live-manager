<template>
  <div>
    <el-dialog :title="dlgTitle" @close="closeDlg" :visible.sync="dlgVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="姓名" prop="userName">
              <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
         <el-row>
          <el-col :span="20">
            <el-form-item label="账号" prop="userAccount">
              <el-input v-model="ruleForm.userAccount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="密码" prop="userPassword">
              <el-input v-model="ruleForm.userPassword"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="性别"  prop="userGender">
              <el-select v-model="ruleForm.userGender" placeholder="请选择性别" style="width:100%">
                <el-option label="男" :value="GENDER.BOY"></el-option>
                <el-option label="女" :value="GENDER.GIRL"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item>
              <el-button type="primary" :loading="addLoading" @click="confirm"
                >确定</el-button
              >
              <el-button @click="closeDlg">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
import {GENDER,ROLE} from 'src/common/const';
console.log(GENDER,ROLE);

export default {
  props: ["visible", "form"],
  components: {},
  data() {
    return {
      dlgTitle: "新增学生",
      ruleForm: {
        userName: "",
        userAccount: "",
        userPassword: "",
        userGender: "",
        userRole: "",
        handleType: "add"
      },
      rules: {
        userName: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
         userAccount: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
         userPassword: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        userGender: [
          { required: true,type:'number', message: "请输入性别", trigger: "change" }
        ],
       
      },
      dlgVisible: false,
      addLoading: false,
      GENDER,
      ROLE
    };
  },
  watch: {
    visible(val) {
      this.dlgVisible = val;
      this.ruleForm = _.cloneDeep(this.form);
      this.dlgTitle =
        this.ruleForm.handleType == "edit" ? "编辑学生" : "新增学生";
    }
  },

  methods: {
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },

    confirm() {
      console.log(this.ruleForm);
      
      this.$refs["ruleForm"].validate(async valid => {
        this.ruleForm.schoolId = zj.utils.pageParam().schoolId;
        this.ruleForm.userRole = ROLE.TEACHER;
        if (valid) {
          let url = "/user/add";
          if (this.ruleForm.handleType == "edit") {
            url = "/user/update";
          }
          this.addLoading = true;
          let res = await zj.net.live({
            url,
            method: "POST",
            data: JSON.stringify(this.ruleForm)
          });
          this.addLoading = false;
          if (res.data.result == 0) {
            this.addLoading = false;
            this.$message.success("成功");
            this.$emit("reload");
            this.closeDlg();
          }
        } else {
          return false;
        }
      });
    },
    closeDlg() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.stages-box {
  overflow: hidden;
  display: flex;
  .left-box {
    float: left;
    width: 118px;
    min-width: 100px;
  }
  .right-box {
    padding-left: 10px;
    flex: 1;
    overflow-x: scroll;
  }
}
</style>

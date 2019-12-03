<template>
  <div>
    <el-dialog title="详情" @close="closeDlg" :visible.sync="dlgVisible">
      <el-form
        :model="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-row>
          <el-col :span="20">
            <el-form-item label="姓名" prop="userName">
              {{ruleForm.userName}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="账号" prop="userAccount">
              {{ruleForm.userAccount}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="密码" prop="userPassword">
              {{ruleForm.userPassword}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="性别" prop="userGender">
              {{ruleForm.userGender == GENDER.BOY ? '男生' :'女生'}}
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {GENDER,ROLE} from 'src/common/const';
import qs from "qs";
export default {
  props: ["visible", "form"],
  components: {},
  data() {
    return {
     
      ruleForm: {},
      dlgVisible: false,
      GENDER,

    };
  },
  watch: {
    visible(val) {
      this.dlgVisible = val;
      this.ruleForm = _.cloneDeep(this.form)
    }
  },

  methods: {
   
    closeDlg() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>

</style>


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
            <el-form-item label="课程名称" prop="courseTitle">
              {{ruleForm.courseTitle}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="课程描述" prop="courseTitle">
              {{ruleForm.courseIntroduce}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="学校">
              {{ruleForm.schoolName}}
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  props: ["visible", "form"],
  components: {},
  data() {
    return {
     
      ruleForm: {},
      dlgVisible: false,

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


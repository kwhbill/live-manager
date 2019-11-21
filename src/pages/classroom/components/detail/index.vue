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
            <el-form-item label="教室名称" prop="classroomName">
              {{ruleForm.classroomName}}
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


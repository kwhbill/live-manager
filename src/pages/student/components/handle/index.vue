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
            <el-form-item label="课程名称" prop="courseTitle">
              <el-input v-model="ruleForm.courseTitle"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="课程描述" prop="courseTitle">
              <el-input v-model="ruleForm.courseIntroduce"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item>
             
              <el-button type="primary" :loading="addLoading" @click="confirm">确定</el-button>
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
export default {
  props: ["visible", "form"],
  components: {},
  data() {
    return {
      dlgTitle: "新增课程",
      ruleForm: {
        courseTitle: "",
        courseIntroduce: "",
        schoolId: "",
        handleType: "add"
      },
      rules: {
        courseTitle: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        courseIntroduce: [
          { required: true, message: "请输入账号", trigger: "blur" }
        ]
      },
      dlgVisible: false,
      addLoading: false
    };
  },
  watch: {
    visible(val) {
      this.dlgVisible = val;
      this.ruleForm = _.cloneDeep(this.form)
      this.dlgTitle = this.ruleForm.handleType == "edit" ? "编辑课程" : "新增课程";
    }
  },

  methods: {
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },
    
    confirm() {
      this.$refs["ruleForm"].validate(async valid => {
        this.ruleForm.schoolId = zj.utils.pageParam().schoolId
        if (valid) {
          let url =  "/course/add"
          if(this.ruleForm.handleType == 'edit'){
            url =  "/course/update"
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
            this.$message.success("新增成功");
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


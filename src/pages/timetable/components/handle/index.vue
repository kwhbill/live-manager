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
            <el-form-item label="老师" prop="teacherId">
              <el-select
                v-model="ruleForm.teacherId"
                placeholder="请选择老师"
                style="width:70%"
              >
                <el-option
                  :label="item.userName"
                  :value="item.userId"
                  v-for="item in teacherList"
                  :key="item.teacherId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="教室" prop="classroomId">
              <el-select
                v-model="ruleForm.classroomId"
                placeholder="请选择教室"
                style="width:70%"
              >
                <el-option
                  :label="item.classroomName"
                  :value="item.classroomId"
                  v-for="item in classroomList"
                  :key="item.teacherId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="课程" prop="courseId">
              <el-select
                v-model="ruleForm.courseId"
                placeholder="请选择课程"
                style="width:70%"
              >
                <el-option
                  :label="item.courseTitle"
                  :value="item.courseId"
                  v-for="item in courseList"
                  :key="item.courseId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="学生" prop="userIds">
              <el-select
                style="width:70%"
                :multiple="true"
                v-model="ruleForm.userIds"
                placeholder="请选择学生"
              >
                <el-option
                  :label="item.userName"
                  :value="item.userId"
                  v-for="item in studentList"
                  :key="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="开始时间" prop="timetableBeginTime">
              <el-date-picker
                style="width:70%"
                v-model="ruleForm.timetableBeginTime"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-form-item label="结束时间" prop="timetableFinishTime">
              <el-date-picker
                style="width:70%"
                v-model="ruleForm.timetableFinishTime"
                type="datetime"
                placeholder="选择日期时间"
              >
              </el-date-picker>
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
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    courseList: {
      type: Array,
      default() {
        return [];
      }
    },
    classroomList: {
      type: Array,
      default() {
        return [];
      }
    },
    studentList: {
      type: Array,
      default() {
        return [];
      }
    },
    teacherList: {
      type: Array,
      default() {
        return [];
      }
    },
    form: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {},
  data() {
    return {
      dlgTitle: "新增上课时间表",
      ruleForm: {
        userIds: [],
        teacherId: "",
        courseId: "",
        classroomId: "",
        handleType: "add",
        timetableBeginTime: "",
        timetableFinishTime: ""
      },
      userIds: [],
      rules: {
        courseTitle: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ],
        teacherId: [
          {
            required: true,
            type: "number",
            message: "请选择老师",
            trigger: "changer"
          }
        ],
        courseId: [
          {
            required: true,
            type: "number",
            message: "请选择",
            trigger: "changer"
          }
        ],
        classroomId: [
          {
            required: true,
            type: "number",
            message: "请选择教室",
            trigger: "changer"
          }
        ],
        userIds: [
          {
            required: true,
            type: "array",
            message: "请选择教室",
            trigger: "changer"
          }
        ],
        timetableBeginTime: [
          {
            required: true,
           type: 'date', 
            message: "请选择时间",
            trigger: "changer"
          }
        ],
        timetableFinishTime: [
          {
            required: true,
            type: 'date', 
            message: "请选择时间",
            trigger: "changer"
          }
        ]
      },

      dlgVisible: false,
      addLoading: false
    };
  },
  watch: {
    visible(val) {
      this.dlgVisible = val;

      if (this.form.handleType == "edit") {
        this.ruleForm = _.cloneDeep(this.form);
        console.log(_.split(this.ruleForm.userIds, ","));

        this.ruleForm.userIds = _.map(
          _.split(this.ruleForm.userIds, ","),
          item => {
            return +item;
          }
        );
        console.log(this.ruleForm.userIds, "this.ruleForm.userIds");

        this.dlgTitle = "编辑上课时间表";
      } else {
        this.ruleForm = {
          userIds: [],
          teacherId: "",
          courseId: "",
          classroomId: "",
          timetableBeginTime: "",
          timetableFinishTime: "",
          handleType: "add"
        };
        this.dlgTitle = "新增上课时间表";
      }
    }
  },

  methods: {
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },

    confirm() {
      this.$refs["ruleForm"].validate(async valid => {
        if (valid) {
          let ruleForm = _.cloneDeep(this.ruleForm);
          ruleForm.userIds = _.join(ruleForm.userIds, ",");
          console.log(ruleForm.timetableBeginTime);
          console.log(ruleForm.timetableFinishTime);
          
          let timetableBeginTime = _.isNumber(ruleForm.timetableBeginTime) ? ruleForm.timetableBeginTime: ruleForm.timetableBeginTime.getTime();
          let timetableFinishTime =_.isNumber(ruleForm.timetableFinishTime) ? ruleForm.timetableFinishTime :ruleForm.timetableFinishTime.getTime();

          if (timetableBeginTime > timetableFinishTime) {
            this.$message.error("结束时间不能小于开始时间");
            return;
          }
          ruleForm.timetableBeginTime = timetableBeginTime;
          ruleForm.timetableFinishTime = timetableFinishTime;
          ruleForm.schoolId = zj.pageParam().schoolId
          let url = "/timetable/add";
          if (ruleForm.handleType == "edit") {
            url = "/timetable/update";
          }
          this.addLoading = true;
          let res = await zj.net.live({
            url,
            method: "POST",
            data: JSON.stringify(ruleForm)
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

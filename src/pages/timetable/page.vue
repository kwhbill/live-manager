<template>
  <div class="course">
    <div class="header" style="margin-bottom:10px">
      <el-button type="primary" @click="onAddBtnClick">新增</el-button>
    </div>
    <el-table :data="timetableList" border style="width: 100%">
      <el-table-column fixed prop="courseName" label="课程">
        <template slot-scope="scope">
          {{ getName(scope.row, "course") }}
        </template>
      </el-table-column>
      <el-table-column fixed prop="teacherName" label="老师">
        <template slot-scope="scope">
          {{ getName(scope.row, "teacher") }}
        </template>
      </el-table-column>
      <el-table-column fixed prop="classroomName" label="课室">
        <template slot-scope="scope">
          {{ getName(scope.row, "classroom") }}
        </template>
      </el-table-column>
      <el-table-column fixed prop="studentName" label="学生">
        <template slot-scope="scope">
          {{ getStudentNames(scope.row) }}
        </template>
      </el-table-column>
      <el-table-column fixed prop="timetableBeginTime" label="开始时间">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.timetableBeginTime) }}
        </template>
      </el-table-column>
      <el-table-column fixed prop="timetableFinishTime" label="结束时间">
        <template slot-scope="scope">
          {{ formatDateTime(scope.row.timetableFinishTime) }}
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="OnEditBtnClick(scope.row)" type="text" size="small"
            >编辑</el-button
          >
          <el-button
            @click="OnDeleteBtnClick(scope.row)"
            type="text"
            size="small"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top:10px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="beginPos"
      :page-size="pageSize"
      :page-sizes="[5, 10, 20, 30]"
      layout="total, prev, pager, next"
      :total="total"
    >
    </el-pagination>
    <handle-dlg
      :visible="addDlgVisible"
      :courseList="courseList"
      :classroomList="classroomList"
      :studentList="studentList"
      :teacherList="teacherList"
      @close="addDlgVisible = false"
      @reload="loadCourseList"
      :form="curItem"
    ></handle-dlg>
    <detail-dlg
      :visible="detailDlgVisible"
      :courseMap="courseMap"
      :classroomMap="classroomMap"
      :studentMap="studentMap"
      :teacherMap="teacherMap"
      @close="detailDlgVisible = false"
      :form="detailForm"
    ></detail-dlg>
  </div>
</template>

<script>
// 引入 zj 的库
export { router } from "./router";
var BasePage = zj.widgets.BasePage;
import qs from "qs";
import HandleDlg from "./components/handle";
import DetailDlg from "./components/detail";
import { GENDER, ROLE } from "src/common/const";
export default {
  mixins: [BasePage],
  components: {
    HandleDlg,
    DetailDlg
  },
  props: {},
  created() {},

  data() {
    return {
      menu: "timetable",
      timetableList: [],
      courseList: [],
      courseMap: [],
      classroomList: [],
      classroomMap: [],
      studentList: [],
      studentMap: [],
      teacherList: [],
      teacherMap: [],
      addDlgVisible: false,
      curItem: {},
      detailDlgVisible: false,
      detailForm: {},
      beginPos: 1,
      pageSize: 5,
      total: 0
    };
  },

  computed: {},
  mounted() {},
  watch: {},
  methods: {
    setup() {
      this.loadTimetableList();
      this.loadCourseList();
      this.loadClassroomList();
      this.loadStuentList();
      this.loadTeacherList();
    },
    OnEditBtnClick(row) {
      this.curItem = row;
      this.curItem.handleType = "edit";
      this.addDlgVisible = true;
    },
    getName(item, type = "course") {
      let map = this[`${type}Map`];
      let id = item[`${type}Id`];
      return map[id];
    },
    getStudentNames(item) {
      let ids = _.split(item.userIds, ",");
      let list = _.map(ids, id => {
        return this.studentMap[id];
      });
      return _.join(list, ",");
    },
    formatDateTime(time) {
      return zj.utils.formatDateTime(time);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadTimetableList();
    },
    handleCurrentChange(val) {
      this.beginPos = val;
      this.loadTimetableList();
    },
    async OnDetailBtnClick(row) {
      let res = await zj.net.live({
        method: "GET",
        url: "/course/detail",
        params: zj.utils.pageParam({
          courseId: row.courseId
        })
      });
      this.detailForm = res.data.data;
      this.detailDlgVisible = true;
    },
    async loadTimetableList() {
      let res = await zj.net.live({
        method: "GET",
        url: "/timetable/list",
        params: zj.utils.pageParam({
          pageSize: this.pageSize,
          beginPos: (this.beginPos - 1) * this.pageSize
        })
      });
      this.timetableList = res.data.data.items;
      this.total = res.data.data.totalCount;
    },
    async loadCourseList() {
      let res = await zj.net.live({
        method: "GET",
        url: "/course/list",
        params: zj.utils.pageParam()
      });
      this.courseList = res.data.data.items;
      this.courseMap = this.getMapFormList(this.courseList, "course");
    },
    getMapFormList(list, className = "") {
      let map = {};
      _.each(list, item => {
        _.set(
          map,
          item[`${className}Id`],
          item[`${className}Name`] || item[`${className}Title`]
        );
      });
      return map;
    },
    async loadClassroomList() {
      let res = await zj.net.live({
        method: "GET",
        url: "/classroom/list",
        params: zj.utils.pageParam()
      });
      this.classroomList = res.data.data.items;
      this.classroomMap = this.getMapFormList(this.classroomList, "classroom");
    },
    async loadStuentList() {
      let res = await zj.net.live({
        method: "GET",
        url: "/user/list",
        params: zj.utils.pageParam({
          userRole: ROLE.STUDENT
        })
      });
      let list = res.data.data.items;
      this.studentList = res.data.data.items;
      this.studentMap = this.getMapFormList(this.studentList, "user");
    },
    async loadTeacherList() {
      let res = await zj.net.live({
        method: "GET",
        url: "/user/list",
        params: zj.utils.pageParam({
          userRole: ROLE.TEACHER
        })
      });
      let list = res.data.data.items;
      this.teacherList = res.data.data.items;
      this.teacherMap = this.getMapFormList(this.teacherList, "user");
    },
    onAddBtnClick() {
      this.addDlgVisible = true;
      this.curItem = {};
    },
    OnDeleteBtnClick(row) {
      this.$confirm(`是否删除课程`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          let res = await zj.net.live({
            url: "/course/delete",
            method: "POST",
            data: JSON.stringify(
              zj.utils.pageParam({
                courseId: row.courseId
              })
            )
          });
          if (res.data.result == 0) {
            this.$message.success("删除成功");
            this.loadCourseList();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped></style>

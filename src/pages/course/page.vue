<template>
   <div class="course">
    <div class="header">
      <el-button type="primary" @click="onAddBtnClick">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="courseTitle" label="课程名称" width="150"></el-table-column>
      <el-table-column fixed prop="courseIntroduce" label="课程描述" maxWidth="400"></el-table-column>

      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="OnEditBtnClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="OnDeleteBtnClick(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <course-handle-dlg
      :visible="addDlgVisible"
      @close="addDlgVisible = false"
      @reload="loadCourse"
      :form="curItem"
    ></course-handle-dlg>
  </div>
</template>


<script>
// 引入 zj 的库
export { router } from "./router";
var BasePage = zj.widgets.BasePage;
import qs from "qs";
import CourseHandleDlg from "./components/course_handle";
export default {
  mixins: [BasePage],
  menu: "course",
  menu: "course",
  components: {
    CourseHandleDlg
  },
  props: {},
  created() {
    console.log(zj.utils.pageParam(),'ly.utils.pageParam()');
    this.loadCourse()
  },
  
  data() {
    return {
      tableData:[],
      addDlgVisible: false,
      curItem: {},
    };
  },

  computed: {},
  mounted() {},
  watch: {},
  methods: {
    async loadCourse() {
      let res = await zj.net.live({
        method: "GET",
        url: "/course/list",
        params: zj.utils.pageParam()
      });
      this.tableData = res.data.data;
    },
    OnEditBtnClick(row) {
      this.curItem = row
      this.curItem.handleType = "edit";
      this.addDlgVisible = true
    },
    onAddBtnClick() {
      this.addDlgVisible = true
      this.curItem = {}
    },
    OnDeleteBtnClick() {}
  }
};
</script>
<style lang="less" scoped>
.course {
  .header{
    margin: 20px;
  }
  width: 60%;
  margin: 2% auto;
}
</style>



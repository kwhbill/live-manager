<template>
  <div class="classroom">
    <div class="header" style="margin-bottom:10px">
      <el-button type="primary" @click="onAddBtnClick">新增</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column
        fixed
        prop="classroomName"
        label="教室名称"
      ></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click="OnDetailBtnClick(scope.row)"
            type="text"
            size="small"
            >详情</el-button
          >
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
      @close="addDlgVisible = false"
      @reload="loadClassroom"
      :form="curItem"
    ></handle-dlg>
    <detail-dlg
      :visible="detailDlgVisible"
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
export default {
  mixins: [BasePage],

  components: {
    HandleDlg,
    DetailDlg
  },
  props: {},
  created() {
   
  },

  data() {
    return {
      menu: "classroom",
      tableData: [],
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
    setup(){
       this.loadClassroom();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.loadClassroom();
    },
    handleCurrentChange(val) {
      this.beginPos = val;
      this.loadClassroom();
    },
    async OnDetailBtnClick(row) {
      let res = await zj.net.live({
        method: "GET",
        url: "/classroom/detail",
        params: zj.utils.pageParam({
          classroomId: row.classroomId
        })
      });
      this.detailForm = res.data.data;
       
      this.detailDlgVisible = true;
    },
    async loadClassroom() {
      let res = await zj.net.live({
        method: "GET",
        url: "/classroom/list",
        params: zj.utils.pageParam({
          pageSize: this.pageSize,
          beginPos: (this.beginPos - 1) * this.pageSize
        })
      });
      this.tableData = res.data.data.items;
       this.total =  res.data.data.totalCount
    },
    OnEditBtnClick(row) {
      this.curItem = row;
      this.curItem.handleType = "edit";
      this.addDlgVisible = true;
    },
    onAddBtnClick() {
      this.addDlgVisible = true;
      this.curItem = {};
    },
    OnDeleteBtnClick(row) {
      this.$confirm(`是否删除教室`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(async () => {
          let res = await zj.net.live({
            url: "/classroom/delete",
            method: "POST",
            data: JSON.stringify(
              zj.utils.pageParam({
                classroomId: row.classroomId
              })
            )
          });
          if (res.data.result == 0) {
            this.$message.success("删除成功");
            this.loadClassroom();
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

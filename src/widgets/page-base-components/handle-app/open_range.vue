<template>
    <div style="border:1px solid #dfe6ec;overflow: hidden;padding: 10px 0 0;">
      <el-col :span="12">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input placeholder="请输入集团名称或ID"  @keyup.enter.native="searchOrg" v-model="serachContent"></el-input>
          </el-col>
          <el-col :span="8">
            <el-button type="primary" @click="searchOrg">搜索</el-button>
          </el-col>
        </el-row>
        <div class="table">
          <el-table
              ref="appTable"
              :data="customList"
              @selection-change="handleSelectionChange"
              border
              style="width: 100%">
            <el-table-column
                prop="name"
                min-width="110"
                label="">
              <template scope="scope">
                <el-checkbox v-model="scope.row.checked" @change="selectChange(scope.row)"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column
                prop="name"
                min-width="110"
                label="集团名称">
            </el-table-column>
            <el-table-column
                prop="org_id"
                min-width="110"
                label="集团ID">
            </el-table-column>
          </el-table>
        </div>
        <div class="block" style="padding: 20px 0;">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[10, 20, 50,100]"
              :page-size="pageSize"
              layout="total,sizes, prev, pager, next"
              :total="customCount">
          </el-pagination>
        </div>
      </el-col>
      <el-col :span="12">
        <el-row :gutter="20">
          <div>已选客户</div>
        </el-row>
        <div class="table">
          <el-table
              ref="appTable"
              :data="selectCustomList"
              @selection-change="handleRightSelectionChange"
              border
              style="width: 100%">
            <el-table-column
                prop="name"
                min-width="110"
                label="集团名称">
            </el-table-column>
            <el-table-column
                prop="org_no"
                min-width="110"
                label="集团ID">
            </el-table-column>
            <el-table-column
                label="操作"
                width="80">
              <template scope="scope">
                <el-button
                    @click="deleteRow(scope.row,)"
                    type="text"
                    size="small">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>

    </div>
</template>

<script>
  import {ORGTYPE} from 'src/common/const'
  export default {
    components: {},
    watch: {
      selectCustomList(vals){
        this.showCheckedItems(this.customList)
        this.$emit('get-select',vals)
      },
      selectOrgList(vals){
        if(vals.length > 0){
          this.loadSelectOrgList(vals)
        }
      }
    },
    props:['selectOrgList'],
    created() {
      this.loadCustomList()
    },
    data() {
      return {
        serachContent:'',
        customCount: 0,
        currentPage:1,
        pageSize:10,
        customList:[],
        selectCustomList:[],
      };
    },
    methods: {
      async loadSelectOrgList(list){
        let org_id = _.join(_.map(list,item=>item.org_id),',')
        let params = zj.utils.pageParam({
          org_id,
          org_no:0,
          org_type: ORGTYPE.CUSTOM,
        })
        let res =await zj.net.w.open({
          url:'/org/list/',
          params
        })
        this.selectCustomList = res.items
      },
      async loadCustomList(){
        let params = zj.utils.pageParam({
          org_id: 0,
          org_no:0,
          org_type: ORGTYPE.CUSTOM,
          name:'',
          like_text:this.serachContent,
          page:this.currentPage,
          perpage:this.pageSize
        })
        let res =await zj.net.w.open({
          url:'/org/search_page/',
          params
        })
        let customList = res.items
        _.each(customList,item=>{
          item.checked = false
        })
        this.showCheckedItems(customList)
        this.customList = customList
        this.customCount = res.count
      },
      handleSelectionChange(val){
        let selectCustomList = _.concat(val,this.selectCustomList)
        this.selectCustomList = _.uniqBy(selectCustomList,(item)=>{
          return item.org_id
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.loadCustomList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadCustomList()
      },
      searchOrg(){
        this.currentPage = 1
        this.loadCustomList()
      },
      handleRightSelectionChange(val){
        this.tempRemoveCustomList= val
        this.tempRemoveCustomCount = val.length
      },
      selectChange(item){
        if(item.checked){
          if(!_.find(this.selectCustomList,org=>org.org_id === item.org_id)){
            this.selectCustomList.unshift(item)
          }
        }else{
          this.selectCustomList = this.selectCustomList.filter(org=>{
            return org.org_id !== item.org_id
          })
        }
      },
      deleteRow(item){
        this.selectCustomList = _.remove(this.selectCustomList,org=>{
          return org.org_id !== item.org_id
        })
        this.showCheckedItems(this.customList)
      },
      showCheckedItems(list){
        let selectIds = _.map(this.selectCustomList,item=>{
          return item.org_id
        })
        _.each(list,item=>{
          if(_.indexOf(selectIds,item.org_id) !== -1){
            item.checked = true
          }else{
            item.checked = false
          }
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .table{
    margin-top: 10px;
    padding-top: 0px;
    max-height: 400px;
    overflow-y: scroll;
    border-top:1px solid #dfe6ec;
  }
</style>

<template>
  <div>
    <div class="header">
      <el-form s :inline="true" :model="form" class="demo-form-inline pull-right">
        <el-form-item label="上架状态">
          <el-select v-model="form.status" clearable placeholder="请选择">
            <el-option v-for="statu in appStatuList" :label="statu.label" :value="statu.key" :key="statu.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        <el-input style="width: 200px;" v-model="form.searchInfo" placeholder="请输入应用名称、开发者"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" class="pull-left" @click="showAddAppPage">新增应用</el-button>
    </div>
    <div class="table" style="padding-top: 10px;">
      <el-table
          ref="appTable"
          :data="appList"
          border
          style="width: 100%">
        <el-table-column
            prop="name"
            min-width="110"
            label="应用名称">
        </el-table-column>
        <el-table-column
        prop="org_name"
        min-width="120"
        label="应用开发者">
        </el-table-column>
        <el-table-column
            prop="app_key"
            label="appKey">
        </el-table-column>
        <el-table-column
            prop="app_secret"
            label="appSecret">
        </el-table-column>
        <el-table-column
            prop="status"
            width="100"
            label="上架状态">
          <template slot-scope="scope">
            <span>{{formateAppStatus(scope.row).label}}</span>
          </template>
        </el-table-column>
        <el-table-column
            v-if="appType !== 'default'"
            prop="count"
            width="100"
            label="使用客户">
        </el-table-column>
        <el-table-column
            label="操作"
            width="100">
          <template slot-scope="scope" >
          <div>
            <el-button type="text" class="handle-btn" @click="showEditAppPage(scope.row)">编辑</el-button>
          </div>
            <div>
              <el-button type="text" :disabled="formateAppStatusBtnDisabled(scope.row)"  @click="changeAppStatus(scope.row,formateBtnAppStatus(scope.row))">{{formateBtnAppStatus(scope.row)}}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="block" style="padding: 20px 0;">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 50,100]"
            :page-size="pageSize"
            layout="total,sizes, prev, pager, next"
            :total="appCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

  import {APPSTATUS} from 'src/common/const'
  import AppStatusBase from './app-status-base.vue'
  import qs from 'qs'
  export default {
    mixins:[AppStatusBase],
    data() {
      return {
        appStatuList:[
          {key: APPSTATUS.UNUPPER, label: '未上架'},
          {key: APPSTATUS.UPPERING, label: '上架中'},
          {key: APPSTATUS.UPPERED, label: '已上架'},
          {key: APPSTATUS.LOWERING, label: '下架中'},
          {key: APPSTATUS.LOWERED, label: '已下架'}
        ],
        rangeList:[

        ],
        form: {
          status:'',
          range: '',
          searchInfo:''
        },
        appList:[],
        appRelationOrgList:[],
        appCount: 0,
        currentPage:1,
        pageSize:10,

      }
    },
    props:{
      appType : String,
    },
    created(){

    },
    methods: {
      search() {
        this.loadAppList()
      },
      async loadAppList(){
        let status = this.form.status === '' ? 0 : this.form.status
        let params = zj.utils.pageParam({
          app_type:this.appType,
          like_text:this.form.searchInfo,
          status,
          org_id: 0,
          page:this.currentPage,
          perpage:this.pageSize
        })
        let res = await zj.net.w.open({
          url:'/app/search_page/',
          params
        })
        this.appCount = res.count
        let appList = res.items
        this.$emit('get-count',res.items.length)
        let appKeys = _.join(_.map(appList,app=>{
          return app.app_key
        }),',')
        if(this.appType !=='custom'){
          if(appKeys){
            let appRelationOrgList =await this.loadAppRelationOrgList(appKeys)
            let appRelationAppKeyList =await this.loadAppRelationAppKeyList(appKeys)
            _.each(appList,app=>{
              _.each(appRelationOrgList,appRelationOrg=>{
                if(app.app_key === appRelationOrg.app_key){
                  app.count = appRelationOrg.count
                }
              })
              _.each(appRelationAppKeyList,appRelation=>{
                if(app.app_key === appRelation.app_key){
                  app.app_secret = appRelation.app_secret
                }
              })
            })
          }
        }
        this.appList = appList
      },
      async loadAppRelationOrgList(appKeys){
        let res =await zj.net.w.open({
          url:'/app/app_org_relation_count_list/',
          params:{app_keys:appKeys}
        })
        return res.items
      },
      async loadAppRelationAppKeyList(appKeys){
        let res =await zj.net.w.open({
          url:'/app/secret/',
          params:{app_keys:appKeys}
        })
        return res.items
      },
      bindOrgToApp(row){
        let count = 0
        _.each(this.appRelationOrgList,org=>{
          if(org.app_key == row.app_key){
            count = org.count
            return
          }
        })
        return count
      },
      showAddAppPage(){
        this.$router.push({name:'addApp',params:{ appType: this.appType}})
      },
      showEditAppPage(row){
        this.$router.push({name:'editApp',params: { appKey:row.app_key }})
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.loadAppList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadAppList()
      },
      formateAppStatus(row){
        let statuItem = {}
        _.each(this.appStatuList,item=>{
          if(item.key==row.status){
            statuItem =  item
          }
        })
        return statuItem
      },

    }
  }
</script>

<style lang="less">
.handle-btn.el-button{
  padding:5px 0px;
}
</style>

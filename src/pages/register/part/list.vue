<template>
  <div>
    <div class="header">
      <el-form  :model="form" label-width="80px">
        <el-row :gutter="30" >
          <el-col :span="8">
            <el-form-item label="选择环境">
              <el-select style="width: 100%;" v-model="form.enterprise" placeholder="请选择">
                <el-option
                    v-for="item in enterpriseList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30" >
          <el-col :span="8">
            <el-form-item label="应用名称">
              <el-input placeholder="请输入" v-model="form.searchInfo"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <div class="table" style="padding-top: 10px;">
      <el-table
          ref="appTable"
          :data="filterAppList"
          border
          style="width: 100%">
        <el-table-column
            prop="name"
            min-width="110"
            label="应用名称">
        </el-table-column>

        <el-table-column
            label="操作"
            width="100"d>
          <template slot-scope="scope" >
            <div>
              <el-button type="text" class="handle-btn" @click="showEditPage(scope.row)">详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {ORGTYPE,APPSTATUS} from 'src/common/const'
  import axios from 'axios'
  export default {
    data() {
      return {
        enterpriseList:[],
        appList:[],
        form:{
          enterprise:'',
          searchInfo:''
        },
        filterAppList:[]
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.loadEnterpriceList()
      })
    },
    created(){
      this.searchApp = _.throttle(this.searchApp,2000)
    },
    watch:{
      ['form.enterprise'](val){
        this.loadAppList()
      },
      ['form.searchInfo'](val){
        this.searchApp()
      },

    },
    methods: {
      showEditPage(row){
        this.$router.push({name:'detail',params: { app:row,enterpriseCode:this.form.enterprise}})
      },
      searchApp() {

        if(!this.form.searchInfo){
          this.filterAppList = this.appList
        }
        this.filterAppList = _.filter(this.appList,app=>{
          return app.name.indexOf(this.form.searchInfo)!== -1
        })

      },

      async loadEnterpriceList(){
        let res =await zj.net.w.open({
          url:'/discovery/enterprise_list/',
        })
        this.enterpriseList = res.enterprise_list
        this.form.enterprise = _.get(res.enterprise_list[2],'code')
      },
      async loadAppList(){
        let res =await zj.net.w.open({
          url:'/discovery/app_list/',
          params:{
            enterprise_code : this.form.enterprise,
            app_name:''
          }
        })
        this.appList = res.app_list
        this.form.searchInfo = ''
        this.filterAppList = res.app_list
      }
    }
  }
</script>
<style lang="less">
  .handle-btn.el-button{
    padding:5px 0px;
  }
</style>

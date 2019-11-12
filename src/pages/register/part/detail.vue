<template>
  <div>
    <h4>{{app.name}}</h4>
    <div class="header">
      <el-form s :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="客户名称">
          <el-input style="width: 200px;" v-model="form.searchInfo" placeholder="请输入全名"></el-input>
        </el-form-item>
        <el-form-item label="开通状态" v-if="enterpriseCode == ENV.PUB">
          <el-select v-model="form.status" clearable placeholder="请选择">
            <el-option v-for="statu in statuList" :label="statu.label" :value="statu.key" :key="statu.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">筛选</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table" style="padding-top: 10px;">
      <el-table
           ref="appTable"
           v-loading.body="loading"
          :data="enterpriseList"
          border
          @sort-change="onSortChange"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="客户名称">
        </el-table-column>
        <el-table-column
            v-if="enterpriseCode == ENV.PUB"
            prop="status"
            label="状态">
          <template slot-scope="scope">
            <span>{{formateUsedStatus(scope.row).label}}</span>
          </template>
        </el-table-column>
        <el-table-column
            v-if="enterpriseCode == ENV.PUB"
            prop="enable_date"
            label="开始使用日期"
            sortable
        >
        </el-table-column>
        <el-table-column
            prop="yesterday_app"
            label="昨日客户端访问量"
            sortable
        >
        </el-table-column>
        <el-table-column
            prop="yesterday_web"
            label="昨日PC端访问量"
            sortable
        >
        </el-table-column>
        <el-table-column
            prop="seven_app"
            label="近7日客户端访问"
            sortable
        >
        </el-table-column>
        <el-table-column
            prop="seven_web"
            label="近7日PC端访问"
            sortable
        >
        </el-table-column>

      </el-table>
      <div class="block" style="padding: 20px 0;">
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[ 20,50,100,200,500,1000]"
            :page-size="pageSize"
            layout="total,sizes, prev, pager, next"
            :total="enterpriseCount">
        </el-pagination>
      </div>
    </div>

    <div class="trend" style="overflow: hidden">
      <h4>应用趋势</h4>

      <div style="overflow: hidden">
        <el-form :inline="true" :model="trendForm" class="demo-form-inline pull-right">
          <el-form-item>
            <el-select v-model="trendForm.group_id"
                       clearable
                       filterable
                       :loading="loading"
                       placeholder="请选择集团">
              <el-option v-for="org in filterOrgList"
                         :key="org.group_id"
                         :label="org.name"
                         :value="org.group_id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="trendForm.dateSelect" placeholder="请选择时间段">
              <el-option-group
                  v-for="group in dateOptions"
                  :key="group.label"
                  :label="group.label">
                <el-option
                    v-for="item in group.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-option-group>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div id="main" style="min-height: 400px"></div>
      <el-table
          ref="appTable"
          :data="groupList"
          border
          style="width: 100%">
        <el-table-column
            prop="date"
            label="时间">
        </el-table-column>
        <el-table-column
            prop="app_c"
            sortable
            label="客户端入口访问量">
        </el-table-column>
        <el-table-column
            sortable
            prop="web_c"
            label="PC端入口访问量">
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
  import qs from 'qs'
  import {USEDSTATUS} from 'src/common/const'
  import echarts from 'echarts'
  import fecha from 'fecha'
  const ORDER = {
    DOWN: 0 ,
    UP : 1
  }
  const ENV = {
    PUB:'pub'
  }
  const  MaxCount = 500
  export default {
    data(){
      return {
        ENV:ENV,
        app:{
          app_name:'',
          name:''
        },
        enterpriseCode:'',
        form:{
          status:'',
          searchInfo:'',
        },
        trendForm:{
          group_id:0,
          dateSelect:"day_7",
        },
        group_id:[],


        statuList: [
          {key: USEDSTATUS.UNOPEN, label: '未开通'},
          {key: USEDSTATUS.OPENING, label: '开通中'},
          {key: USEDSTATUS.OPENED, label: '已开通'},
          {key: USEDSTATUS.CLOSING, label: '关闭中'},
          {key: USEDSTATUS.CLOSED, label: '已关闭'}
        ],
        countList:[],
        orgList:[],
        filterOrgList:[],
        groupList:[],
        enterpriseCount: 0,
        currentPage:1,
        pageSize:20,

        type:'',
        dateOptions: [{
          label: '天',
          options: [{
            value: 'day_7',
            label: '近7天'
          },{
            value: 'day_14',
            label: '近14天'
          },{
              value: 'day_30',
              label: '近30天'
          }]
        }, {
          label: '周',
          options: [{
            value: 'week_4',
            label: '近4周'
          },{
            value: 'week_12',
            label: '近12周'
          }]
        },{
          label: '月',
          options: [{
            value: 'month_6',
            label: '近6月'
          },{
            value: 'month_12',
            label: '近12月'
          }]
        },
          {
            label: '季',
            options: [{
              value: 'quarter_4',
              label: '近4季'
            },{
              value: 'quarter_12',
              label: '近12季'
            }]
          },
        ],
        loading:false,
        enterpriseList:[],

      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.app= to.params.app || {}
        vm.enterpriseCode = to.params.enterpriseCode
        vm.initDate()
      })
    },
    beforeRouteLeave(to, from, next){
      next()
    },
    watch:{
      ['trendForm.dateSelect'](){
        this.loadGroupList()
      },
      ['trendForm.group_id'](){
        this.loadGroupList()
      },
    },
    created(){

    },

    methods:{
      search(){
        this.loadEnterpriseList()
      },
      initDate(){
        this.loadEnterpriseList()
        this.loadOrgList()
        this.loadGroupList()
      },

      async loadEnterpriseList(){
        let params = {
          enterprise_code: this.enterpriseCode,
          app_name: this.app.app_name,
          name:'',
          status:this.form.status,
          like_text:this.form.searchInfo,
          page:this.currentPage,
          perpage:this.pageSize,
        }
        this.loading = true
        let res =await zj.net.w.open({
          url:'/discovery/enterprise_relation_search_page/',
          params
        })
        let enterpriseList = res.enterprise_list
        _.each(enterpriseList,item=>{
          item.enable_date = item.enable_date ? zj.timestampToDateString(item.enable_date) : '无'
        })
        let enterpriseIds = _.join(_.map(enterpriseList,item=>item.group_id),',')
        let statisticFileds = ['seven_app','seven_web','yesterday_app','yesterday_web']
        statisticFileds = _.chain(statisticFileds)
        await this.loadCountList(enterpriseIds,statisticFileds,enterpriseList)
        this.enterpriseList = enterpriseList
        this.enterpriseCount = res.count
        this.loading = false
      },
      async loadCountList(groupIds,statisticFileds,enterpriseList){
        let item = statisticFileds.next()
        if(item.done) return
        let orderby = item.value
        let params = {
          enterprise_code: this.enterpriseCode,
          app_name: this.app.app_name,
          group_ids: groupIds,
          orderby,
          sortby:0,
        }
        let res =await zj.net.w.open({
          url:'/discovery/statistics_count_list/',
          method:"POST",
          data:qs.stringify(params)
        })
        _.each(enterpriseList,itemA=>{
          _.each(res.count_list,itemB=>{
            if(itemA.group_id == itemB.group_id){
              itemA[orderby] = itemB.c ? itemB.c : 0
            }
          })
        })
        await this.loadCountList(groupIds,statisticFileds,enterpriseList)
      },

      async loadOrgList(orgText){
        if(!this.enterpriseCode) return
        let params ={
          enterprise_code: this.enterpriseCode,
          group_id:0,
          name:'',
          like_text: orgText || '',
        }
        let res =await zj.net.w.open({
          url:'/discovery/enterprise_search/',
          params
        })


        let orgList = res.enterprise_list
        if(!orgText){
          orgList.unshift({
            name:"全部客户",
            group_id :  0
          })
        }

//        this.orgList = orgList


        this.filterOrgList = orgList
      },
      formateUsedStatus(row){
        let statuItem = {}
        _.each(this.statuList,item=>{
          if(item.key==row.status){
            statuItem =  item
          }
        })
        return statuItem
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.loadEnterpriseList()
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.loadEnterpriseList()
      },

      onSortChange(options){
        let {column, prop, order} = options
      },
      async loadGroupList(orgText){
        let dateList = _.split(this.trendForm.dateSelect,'_')

        let params ={
          enterprise_code: this.enterpriseCode,
          group_id:this.trendForm.group_id,
          type:_.head(dateList),
          recent_date:_.toNumber(_.last(dateList)),
          app_name:this.app.app_name,
        }
        let res =await zj.net.w.open({
          url:'/discovery/statistics_group_list/',
          params
        })
        let groupList = res.group_list
        this.initChart(groupList)
        this.groupList = groupList
      },
      initChart(groupList){
        var myChart = echarts.init(document.getElementById('main'));
        let xAxisData = _.map(groupList,group=>{
          return group.date
        })
        let seriesData = [
          {
            name : '客户端入口访问量',
            key:'app_c',
            type:'line',
            data:[]
          },
          {
            name : 'PC端入口访问量',
            key:'web_c',
            type:'line',
            data:[]
          }
        ]
        _.each(seriesData,serie=>{
          serie.data = _.map(groupList,group=>{
            return group[serie.key]
          })
        })

        var option = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data:['客户端入口访问量','PC端入口访问量']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxisData
          },
          yAxis: {
            type: 'value'
          },
          series: seriesData
        };
        myChart.setOption(option);
      }
    },
    components:{

    },

  }
</script>


<template>
  <div class="">
    <el-popover
      ref="popoverTask"
      placement="bottom"
      width="476"
      trigger="click"
      class="popover_task_content"
      >
        <div class="task-list">
          <el-table
          :data="taskData"
          v-loading="loading"
          height = '300'
          style="width: 100%">
          <el-table-column
            prop="name"
            label="任务名称">
          </el-table-column>
          <el-table-column
            label="状态">
            <template slot-scope="scope">
              <span :class="scope.row.class">{{scope.row.statusFont}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <a  v-if="scope.row.down_url" :href="scope.row.down_url" target="_blank">下载</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <p class="update-btn">
          <el-button size="small" type="primary" @click="loadTaskData"><i class="icon-refresh icon-large"></i> 更新数据</el-button>
      </p>
    </el-popover>
    <el-button v-popover:popoverTask class="all-btn"  type="text"><i class="el-icon-time"></i>任务记录</el-button>
  </div>
</template>
<script>
let taskStatus = zj.consts.TASK_STATUS
let colorMap = {
  QUEUEING: "",
  BEING: "colorInfo",
  COMPLETE: "colorSuccess",
  FAILURE: "colorWarning"
}

export default {
    name: 'TaskWindow',
    props: [],
    data() {
        return {
            'taskData':[],
            'loading':false
        }
    },
    mounted() {
//      this.loadTaskData();
    },
    methods: {
      async loadTaskData(){
        //加载任务数据
        this.loading = true
        let datas =await zj.net.w.papi({
          method: 'GET',
          url: 'v3/bgtask/bgtask/my_tasks/?size=12',
        })
        let tasks = _.get(datas,'items',[])
        
        _.each(tasks,(task)=>{
          _.each(taskStatus, (status,key)=>{
            if(status == task.status) {
              task.statusFont = zj.t('task_status_font.'+key)
              task.class = colorMap[key]
              return
            }
          })
        })
        this.taskData = tasks
        this.loading = false
      }
    }
}
</script>
<style lang="less">
.all-btn{
  color: #677484!important;
  .el-icon-time{
    padding-right:4px;
  }
}
.el-popover[x-placement^=bottom] .popper__arrow:after{
  border-bottom-color: #eef1f6;
}
.el-tabs--border-card>.el-tabs__content{
  padding:10px;
}
.el-popover{
  padding:0;
}
.el-tabs__item.is-active {
  .icon{
    color: #20a0ff;
  }
}
.el-table__row{
  a{
    color: #20a0ff;
    text-decoration: none;
    font-size: 14px;
  }
}
</style>
<style lang="less" scoped>
  .colorInfo {
    color: #50bfff;
  }
  .colorSuccess {
    color: #13ce66;
  }
  .colorWarning {
    color: #ff4949;
  }
  .update-btn{
      padding: 8px 0;
      margin: 0;
      overflow: hidden;
      button {
          float: right;
          margin-right: 15px;
      }
  }
</style>

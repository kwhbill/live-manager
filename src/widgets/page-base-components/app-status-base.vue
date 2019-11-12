<script>
  import qs from 'qs'
  import {USEDSTATUS, APPSTATUS} from 'src/common/const.js'

  export default {
    components: {},
    watch: {},
    created() {
    },
    data() {
      return {
        isEditing:false,
        statuList: [
          {key: USEDSTATUS.UNOPEN, label: '未开通'},
          {key: USEDSTATUS.OPENING, label: '开通中'},
          {key: USEDSTATUS.OPENED, label: '已开通'},
          {key: USEDSTATUS.CLOSING, label: '关闭中'},
          {key: USEDSTATUS.CLOSED, label: '已关闭'}
        ],
        appStatuList: [
          {key: APPSTATUS.UNUPPER, label: '未上架'},
          {key: APPSTATUS.UPPERING, label: '上架中'},
          {key: APPSTATUS.UPPERED, label: '已上架'},
          {key: APPSTATUS.LOWERING, label: '下架中'},
          {key: APPSTATUS.LOWERED, label: '已下架'}
        ],
      };
    },
    methods: {
      formateAppStatus(row,type = 'app_status') {
        let statuItem = {}
        _.each(this.appStatuList, item => {
          if (item.key == row[type]) {
            statuItem = item
          }
        })
        return statuItem
      },
      formateBtnAppStatus(row,type) {
        let item = this.formateAppStatus(row,type)
        let label
        switch (item.key) {
          case APPSTATUS.UPPERING:
            label = '确认上架'
            break
          case APPSTATUS.UPPERED:
            label = '下架'
            break
          case APPSTATUS.LOWERING:
            label = '确认下架'
            break
          case APPSTATUS.LOWERED:
            label = '上架'
            break
        }
        return label
      },
      async changeAppStatus(row, type) {
        let url, successMessage;
        if (type == '上架') {
          url = '/app/restart/'
          successMessage = '上架成功'
        } else if (type == '下架') {
          url = '/app/remove/'
          successMessage = '下架成功'
        } else if (type == '确认上架') {
          url = '/app/put/'
          successMessage = '确认上架成功'
        } else if (type == '确认下架') {
          url = '/app/pull/'
          successMessage = '确认下架成功'
        }
        this.isEditing = true
        let res = await zj.net.open({
          url,
          method: "POST",
          data: qs.stringify({
            app_key: row.app_key
          })
        })

        if (res.data.result == 0) {
          this.loadAppList()
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
        this.isEditing = false
      },

      async changeUsedStatus(appForm, type) {
        let params = _.cloneDeep(appForm)
        let url, successMessage
        if (type == '开通') {
          url = '/app/enable/'
          successMessage = '开通成功'
        } else if (type == '关闭') {
          url = '/app/disable/'
          successMessage = '关闭成功'
        } else if (type == '确认开通') {
          url = '/app/conform_enable/'
          successMessage = '确认开通成功'
        } else if (type == '确认关闭') {
          url = '/app/conform_disable/'
          successMessage = '确认关闭成功'
        }
        if(!params.end_time){
          params.end_time = 0
        }else{
          params.end_time = new Date(params.end_time).getTime()/1000
        }
        if(this.appType === 'appList'){

        }
        this.isEditing = true
        let res = await zj.net.open({
          url,
          method: "POST",
          data: qs.stringify({
            app_key: params.app_key,
            org_id: this.org.orgId,
            end_time: params.end_time
          })
        })
        if (res.data.result == 0) {
          this.$message({
            type: "success",
            message: successMessage
          })
          if (this.loadAppList) await this.loadAppList()
          if (this.loadAppDetail) await this.loadAppDetail()
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          })
        }
        this.isEditing = false

      },
      formateDate(time){
        return zj.formatDateTime(time)
      },
      formateUsedStatus(row,type='status') {
        let statuItem = {}
        _.each(this.statuList, item => {
          if (item.key == row[type]) {
            statuItem = item
            return
          }
        })
        return statuItem
      },

      formateBtnUsedStatus(row,type) {
        let item = this.formateUsedStatus(row,type)
        let label
        switch (item.key) {
          case USEDSTATUS.OPENING:
            label = '确认开通'
            break
          case USEDSTATUS.OPENED:
            label = '关闭'
            break
          case USEDSTATUS.CLOSING:
            label = '确认关闭'
            break
          case USEDSTATUS.CLOSED:
            label = '开通'
            break
        }
        return label
      },
      formateBtnUsedDisable(row) {
        if(this.isEditing) return true
      },
      formateAppStatusBtnDisabled(row){
        if(this.isEditing) return true
      },
      _formateAppStatusBtnDisabled(row){
        const disabledStatusList = [APPSTATUS.UPPERING,APPSTATUS.LOWERING]
        if(_.includes(disabledStatusList,row.app_status)){
          return true
        }else{
          return false
        }
      },

    }
  };
</script>

<style lang="less">

</style>

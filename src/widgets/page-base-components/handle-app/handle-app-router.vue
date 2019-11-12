
<script>
  export default {
    beforeRouteEnter(to, from, next) {
      next(vm => {
        let handleAppComponent = vm.$refs['handleApp']
        handleAppComponent.appType = to.params.appType
        if(to.params.appKey){  // 如果有 appKey 说明应用已经开通，所以此时是编辑状态
          handleAppComponent.appForm.app_key = _.cloneDeep(to.params.appKey)
          handleAppComponent.handleType = 'updating'
          handleAppComponent.appFormRules.app_name = null
          handleAppComponent.loadappRequiredUrlList()
          handleAppComponent.loadAppDetail()
        }else{
          handleAppComponent.handleType = 'creating'
        }
        handleAppComponent.org = to.params.org
        if(to.params.org){   // 如果有传org ，说明是添加客户应用

        }else{  // 如果没有传org ，说明是说明是在添加第三方应用

          handleAppComponent.loadOrgList()
        }

      })
    },
    beforeRouteLeave (to, from, next) {
      next()
      this.$destroy()
    },
  }
</script>

<style lang="less">

</style>

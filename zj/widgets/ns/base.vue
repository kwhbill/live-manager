<script>
import qs from "qs"

export default {
  props: {
    name: {
      type: String,
      default: ""
    }
  },
  data() {
    // 防抖动，延迟100ms再调用，期间有触发继续延迟，除非超过600ms
    let loadDataFromRemoteDebounce = _.debounce((callback)=>{
      this._loadDataFromRemote(callback)
    }, 100, {
      trailing: true,
      maxWait: 600
    })

    return {
      stage: {},
      unwatchList: [],
      loadDataFromRemoteDebounce
    }
  },
  created() {
    this.stage = this.findStage(this)

    if(this == this.stage){ // stage 组件
      this.noticeStageReady()
    }else{  // stage 下子组件
      // 订阅所属stage的ready变化
      this.stage.subscribeStageReady(()=>{
        this.readyCreated()
      })
    }
  },
  destroyed() {
    // 取消组件的nswatch绑定
    _.each(this.unwatchList, (unwatch) => {
      unwatch()
    })
    this.unwatchList = []
  },
  methods: {
    noticeStageReady(){
      // stage 重写
    },
    subscribeStageReady(resolve){
      // stage 重写
    },
    readyCreated(){
      // stage ready 后，调用
    },
    findStage(parent) {
      if (!parent || !parent.nsType) return {}
      if (parent.nsType == "stage") return parent
      return this.findStage(parent.$parent)
    },

    withActualPath(path, resolve) {
      if (!path) return
      let prefix = _.first(path)
      let actualPath = path.substr(1)
      let state = this.stage.state
      let vm = this.stage

      switch (prefix) {
        case "/":
          vm = zj.app
          state = zj.app.state
          break;
        case "#":
          break;
        default:
          actualPath = `${this.nsType}.${this.name}.${path}`
          break;
      }
      /*
      *
      * path- /rootCategory
        actualPath- rootCategory


      * path- chartType
        actualPath- view.summaryChart.chartType

        path- #form
        actualPath- form



        nsType : source || view || form
        name : 每个组件的name


      *
      *
      *
      * */

      resolve(actualPath, state, vm)
    },

    nsgetVar(){
      let name = this.nsget("watchVar.name")
      if (!name) return
      let input = this.nsget("watchVar.input")
      let v = this.nsget(`#vars.${name}`)
      return input ? _.bind(input, this)(v) : v
    },

    nssetVar(v) {
      let name = this.nsget("watchVar.name")
      if (!name) return

      let output = this.nsget("watchVar.output")
      if (output) {
        v = _.bind(output, this)(v)
      }
      this.nsset(`#vars.${name}`, v)
    },

    nswatchVar(resolve) {
      let name = this.nsget("watchVar.name")
      if (!name) return

      let input = this.nsget("watchVar.input")
      if (input) {
        input = _.bind(input, this)
      }

      this.nswatch(`#vars.${name}`, (v) => {
        if(input) v = input(v)
        resolve(name, v)
      }, {deep: true})
    },

    hasNsWatchVar(){
      let name = this.nsget("watchVar.name")
      return !!name
    },

    nswatch(path, resolve, options={}) {
      /* 
        依路径，监听状态信息

        path 寻址路径：
            /xxxx  <=  app
            #xxxx  <=  父stage
            xxx    <=  自身

        options:
          firstCall:  强制回调一次
          deep:       是否深度监听
      */
      let firstCall = _.get(options, "firstCall")
      if(firstCall){
        resolve(this.nsget(path))
      }
      
      this.withActualPath(path, (actualPath, state, vm) => {
        let unwatch = vm.$watch(`state.${actualPath}`, resolve, {deep: _.get(options, "deep")})
        this.unwatchList.push(unwatch)
      })
    },

    nsset(path, val) {
      /* 
        依路径，设置状态信息

        path 寻址路径：
            /xxxx  <=  app
            #xxxx  <=  父stage
            xxx    <=  自身
      */
      this.withActualPath(path, (actualPath, state) => {
        // fix: _.isObject([]) => true
        if (_.isObject(val) && !_.isArray(val)) {
          let oldVal = _.get(state, actualPath)
          let newVal =  zj.utils.extendNew(oldVal, val)

          let parent = state
          let tailKey = actualPath
          let lastIndex = _.lastIndexOf(actualPath, ".")
          if (lastIndex > 0) { // 有1~N个 "." ， 重新获取 parent 和 tailKey
            let parentPath = actualPath.substr(0, lastIndex)
            parent = _.get(state, parentPath)
            tailKey = actualPath.substr(lastIndex + 1)
          }
          parent[tailKey] = newVal
          return
        }
        _.set(state, actualPath, val)
      })
    },

    nsget(path, defaultVal) {
      /* 
        依路径，获取状态信息，找不到返回 defaultVal

        path 寻址路径：
            /xxxx  <=  app
            #xxxx  <=  父stage
            xxx    <=  自身
      */

      let result = defaultVal

      this.withActualPath(path, (actualPath, state) => {
        result = _.get(state, actualPath, defaultVal)
      })

      return result
    },

    nsgetFormValueMap(names){
      // 返回指定names的Map {name: value}
      // 若不指定 names，则返回全部
      let form = this.nsget("#form")
      if(!names) names = _.keys(form)
      let result = {}
      _.each(names, (name)=>{
        result[name] = _.get(form, `${name}.value`)
      })
      return result
    },

    nsgetFormValues(names){
      let fvMap = this.nsgetFormValueMap(names)
      return _.map(names, (name)=>{
        return fvMap[name]
      })
    },

    buildReqFromRemote(remote){
      let req = null
      switch (remote.type) {
        case "gapi":
          var defVars = {} 
          _.each(remote.defaultVars, (item,key)=>{
              defVars[key] = _.isFunction(item) ? item() : item
          })
          let vars = {}
          _.each(remote.varKeys, key =>{
            let v = remote.vars[key]
            if(!_.isUndefined(v)) vars[key] = v
          })
          req = zj.net.w.gapi({
            url: remote.url,
            query: remote.query,
            vars: zj.utils.extendNew(defVars, vars)
          })
          break
        case "papi":
          req = zj.net.w.papi({
            method: remote.method,
            url: remote.url,
            params: remote.params,
            data: remote.data ? qs.stringify(remote.data) : null
          })
          break
        default:
          return Promise.reject(`unknow remote type ${remote.type}`)
      }
      return req
    },

    loadDataFromRemote(callback){
      this.loadDataFromRemoteDebounce(callback)
    },

    _loadDataFromRemote(callback){
      let remote = this.nsget("remote")
      let isReady = this.nsget("/isReady")

      if(!(isReady && remote)) return

      if(_.isFunction(remote)){
        remote = _.bind(remote, this)()
      }

      if(!callback){
        callback = _.bind(
          this.onRemoteChange,
          this
        )
      }

      // 进行全局loading监控
      let origCallback = callback
      callback = (state, context)=>{
        switch (state) {
          case "before": 
            context.reqId = `${(new Date).getTime()}|${Math.random()}`
            this.nsset("/loadingState", [context.reqId, "on"])
            break;
          default: // 其余均为结束状态
            if(context.reqId) this.nsset("/loadingState", [context.reqId, "off"])
            break;
        }
        origCallback(state, context)
      }


      let context = {
        params: {},   // 回调间共享请求参数地方
        cancel: false, // 设置为 true，则停止处理
        remote,
        data: null,
        error: null
      }

      callback("before", context)
      if(context.cancel){
        callback("cancel", context)
        return 
      } 

      let req = this.buildReqFromRemote(remote)
      req.then(data =>{
        context.data = data
        callback("success", context)
      }).catch(err =>{
        context.error = err
        callback("error", context)
      })
    },
    onRemoteChange(state, context){
      /* 当remote获取数据有变化时回调
          state: before | sucess | error
          context:
            cancel  是否停止往下处理
            remote  remote
            data    返回的呃数据集
            error   请求发生错误
      */
       
       // 继承的子组件，可重写该方法控制remote

        let onChange = this.nsget("onRemoteChange")
        if (onChange) {
            _.bind(onChange, this)(state, context)
        }
        if (state == "success") {
            this.nsset("data", context.data)
        }
        
    }
  }
}
</script>

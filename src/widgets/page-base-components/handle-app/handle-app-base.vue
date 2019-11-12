<template>
  <div style="max-width: 1400px">
    <el-form :model="appForm" :rules="appFormRules" label-position="left" label-width="125px" ref="appForm">
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="应用logo" prop="logo">
            <el-upload
                class="avatar-uploader"
                action="/op_open/img/upload/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
              <img v-if="appForm.logo" :src="appForm.logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <div class="img-tip" style="color:#666">上传尺寸512*512px，大小200k以内，JPG、NPG格式，建议使用直角图标</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="应用中文名称" prop="name">
            <el-input placeholder="请输入"  v-model="appForm.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="应用英文名称" prop="app_name">
            <el-input placeholder="请输入" :disabled="handleType=='updating'" v-model="appForm.app_name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="应用简介" prop="abstract">
            <el-input :rows="3" type="textarea" v-model="appForm.abstract" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30" v-if="appType!=='custom'">
        <el-col :span="12">
          <el-form-item label="应用开发商" prop="org_id">
            <el-select style="width: 100%" v-model="appForm.org_id" :disabled="handleType=='updating'"
                       placeholder="请选择">
              <el-option v-for="item in orgList" :label="item.name" :value="item.org_id" :key="item.org_id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <h4>应用入口url（留空则对应端不显示入口）：</h4>
      <h5>App端入口：</h5>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="集团入口" prop="app_org_url">
            <el-input placeholder="请输入" v-model="appForm.app_org_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="分公司入口" prop="app_company_url">
            <el-input placeholder="请输入" v-model="appForm.app_company_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="项目入口" prop="app_project_url">
            <el-input placeholder="请输入" v-model="appForm.app_project_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="关注栏目" prop="follow_url">
            <el-input placeholder="请输入" v-model="appForm.follow_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="接口访问权限：" prop="requiredUrls">
            <el-button
                size="mini"
                type="text"
                style="cursor:pointer;"
                @click="addRequiredUrl"
            >
              <i class="el-icon-plus"></i>
            </el-button>
            <el-row :gutter="20" v-for="(required, requiredIndex) in requiredUrlList"
                    :key="requiredIndex"
                    style="margin-bottom: 5px;">
              <el-col :span="12">
                <el-input v-model="required.url" placeholder="请输入url,如/open/app/list/"></el-input>
              </el-col>
              <el-col :span="1">
                <el-button type="text" v-show="requiredUrlList.length > 1"
                           @click="removeRequiredUrl(requiredIndex)">
                  <i class="el-icon-close"></i>
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="回调接口" prop="callback_url">
            <el-input placeholder="请输入" v-model="appForm.callback_url"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="30" v-if="appType !== 'custom'">
        <el-col :span="24">
          <el-form-item label="应用开放范围" prop="is_limit">
            <el-radio-group v-model="appForm.is_limit">
              <el-radio :label="item.key" :key="item.key" v-for="item in openRange">{{item.value}}</el-radio>
            </el-radio-group>
            <open-range v-show="appForm.is_limit === OPENRANGE.PART" @get-select="getSelectOrg" :selectOrgList = "selectOrgList"></open-range>
          </el-form-item>
        </el-col>
      </el-row>
      <handle-menu ref="Menu" :level="item.level" :appName="appForm.app_name" :menus="item.menus" v-for="item in menuDatas"></handle-menu>
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item class="btn-form-item">
            <el-button type="primary" @click="submitHandleForm('appForm')" >保存</el-button>
            <el-button  @click="cancelHandleForm('appForm')" >取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>
</template>

<script>
  import HandleMenu from './handle-menu.vue'
  import OpenRange from './open_range.vue'

  import qs from 'qs'
  const OPENRANGE = {
    ALL: 0,
    PART: 5
  }
  import {ORGTYPE} from 'src/common/const'
  async function validateName(params) {
    let data = {
      name: '',
      app_name: '',
      not_app_key:''
    }
    params = _.assign(data, params)
    let res = await zj.net.open({
      url: '/app/count/',
      params
    })
    if (res.data.result == 0) {
      if (res.data.data.item == 0) {
        return true
      } else {
        return false
      }
    } else {
      this.$message({
        type: 'error',
        message: res.data.message
      })
    }
  }

  export default {
    components: {
      HandleMenu,
      OpenRange
    },
    data() {
      var validatorRequestUrl = (rule, value, callback) => {
        let igValid = true;
        let errorIndex = []
        let UrlReg = /^\/[\w\d_\/]+\/$/;
        _.each(this.requiredUrlList, (item, index) => {

          if (item.url.length && !UrlReg.test(item.url)) {
            errorIndex.push(index + 1)
            igValid = false;
          }
        })
        if (!igValid) {
          return callback(`第 ${_.join(errorIndex, ',')} 行的接口地址出错了`);
        }
        return callback();
      };
      var validatorCallbackUrl = (rule, value, callback) => {

        let reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
        if (!value) return callback();
        if (reg.test(value)) {
          return callback();
        } else {
          return callback(`这网址不是以http://https://开头，或者不是网址！`);
        }
      }
      var validatorAppChinaName = async (rule, value, callback) => {
        let chinaReg = /[\u4e00-\u9fa5]/
        if (value.length === 0 || !chinaReg.test(value)) {
          return callback('请输入中文名称');
        }
        if (value.length > 10) {
          return callback('名称长度不能超过10');
        }
        var result = await validateName({name: value,not_app_key:this.appForm.app_key})
        if (result) {
          return callback();
        } else {
          return callback(`名称已存在，请换名称`);
        }
      }
      var validatorAppEngName = async (rule, value, callback) => {
        let engReg = /[a-z]/
        let capitalReg = /[A-Z]/
        if(value.length === 0 ){
          return callback('请输入英文名称');
        }
        if (!engReg.test(value)) {
          return callback('请输入英文名称');
        }
        if (capitalReg.test(value)) {
          return callback('不能有大写字母');
        }

        if (value.length > 100) {
          return callback('名称长度不能超过100');
        }
        var result = await validateName({app_name: value,not_app_key:this.appForm.app_key})
        if (result) {
          return callback();
        } else {
          return callback(`名称已存在，请换名称`);
        }
      }
      var validatorOrgId = (rule, value, callback) => {
        if (_.isNumber(value)) {
          return callback();
        } else {
          return callback(`请选择应用开发商`);
        }
      }


      return {
        handleType: '',
        orgList: [],
        appType:'',
        appForm: {
          app_key:'',
          app_name: '',
          name: '',
          app_type: '',
          logo: '',
          abstract: '',
          required_urls: '',
          org_id: '',
          callback_url: '',
          app_org_url: '',
          app_company_url: '',
          app_project_url: '',
          follow_url: '',
          pc_org_url: '',
          pc_company_url: '',
          pc_project_url: '',
          is_limit:OPENRANGE.ALL,
          org_limits:'',
        },
        OPENRANGE:OPENRANGE,
        openRange:[
          {key:OPENRANGE.ALL,value:'全部客户'},
          {key:OPENRANGE.PART,value:'部分客户'},
        ],
        orgLimits:[],
       
        menuDatas: [],
        requiredUrlList: [{
          url: ''
        }],
        org: null,
        appFormRules: {
          requiredUrls: {validator: validatorRequestUrl, trigger: 'blur'},
          org_id: {validator: validatorOrgId, trigger: 'blur'},
          callback_url: {validator: validatorCallbackUrl, trigger: 'blur'},
//          follow_url: {validator: validatorCallbackUrl, trigger: 'blur'},
          app_name: {required: true, validator: validatorAppEngName, trigger: 'blur'},
          name: {required: true, validator: validatorAppChinaName, trigger: 'blur'},
          abstract: {max: 30, message: '长度不能大于30', trigger: 'blur'},
        },
        selectOrgList:[],

      }
    },
    created() {
    },
    mounted() {
    },
    watch: {
      org(val) {
        if (val) {
          this.appForm.org_id = val.orgId
        }
      },
      handleType(val) {
        if (val == 'creating') {
          this.menuDatas = [
            {level: 'group', menus: []},
            {level: 'team', menus: []},
            {level: 'project', menus: []}
          ]
        }
      },
    },
    methods: {
      urlAppendParam(url, extraParams={},lastParam){
        let r = /\?([^#]+)/
        let query = _.get(url.match(r), "1")

        if(query){ // 有 query，合并 baseQueryMap
          let queryMap = qs.parse(query)

          queryMap = _.assignIn({},queryMap, extraParams)

          if(lastParam && queryMap[lastParam]){
            var value = queryMap[lastParam]
            delete queryMap[lastParam]
          }
          url = _.replace(url, query, qs.stringify(queryMap))
          url = `${url}&${lastParam}=${value}`
        }else{ // 插入 baseQueryMap
          url = url + "?" + qs.stringify(extraParams)
        }

        return url
      },
      dealWithMenu(menus) {
        menus = _.groupBy(menus, 'level')
        let initMenus = {
          group: [],
          team: [],
          project: []
        }
        menus = _.merge(initMenus, menus)
        return _.map(menus, (levelMenus, level) => {
          // 根据 index 算出 parnentIndex
          _.each(levelMenus, item => {
            let indexList = item.index.split('/')
            let indexLength = indexList.length
            let parnentIndex = indexLength == 1 ? '' : _.join(_.slice(indexList, 0, indexLength - 1), '/')
            item.parnentIndex = parnentIndex
          })
          // 构建树
          _.each(levelMenus, itemA => {
            if (!itemA.children) itemA.children = []
            _.each(levelMenus, itemB => {
              if (itemB.parnentIndex == itemA.index) {
                itemA.children.push(itemB)
                itemB.parent = itemA
              }
            })
          })

          // 找出每一层级的根菜单
          let rootMenu = []
          _.each(levelMenus, item => {
            if (!item.parent) rootMenu.push(item)
          })
          return {
            menus: rootMenu,
            level
          }
        })
      },
      handleAvatarSuccess(res, file) {
        if(res.result === 902503){
          this.$message({
            type : 'error',
            message:'图片尺寸必须为512 * 512 px'
          })
          return
        }
        this.appForm.logo = res.data.file
      },
      async loadAppDetail() {
        let res = await zj.net.w.open({
          url: '/app/detail/',
          params: {
            app_key: this.appForm.app_key
          }
        })
        this.appForm = res.app
        this.selectOrgList = res.org_limits
        this.menuDatas = this.dealWithMenu(res.menu)
      },
      beforeAvatarUpload(file) {
        const isCorrectType = file.type === 'image/jpeg' || file.type === 'image/png';

        const isLt2M = file.size / 1024 < 200;

        if (!isCorrectType) {
          this.$message.error('上传头像图片只能是 JPG 和 PNG 格式!');
        }
        return isCorrectType;
      },
      async loadappRequiredUrlList() {
        let params = {
          app_key: this.appForm.app_key,
          url: ''
        }
        let res = await zj.net.w.open({
          url: '/app/app_required_url_list/',
          params
        })

        let requiredUrlList = _.map(res.items, item => {
          return {
            url: item.url
          }
        })
        if (requiredUrlList.length == 0) requiredUrlList = [{url: ''}]
        this.requiredUrlList = requiredUrlList
      },
      async loadOrgList() {
        let org_type = this.appType
        if(org_type === 'zjself' || org_type ==='default') {
          org_type = 'zhijian'
        }
        let params = {
          org_id: 0,
          org_no: 0,
          org_type
        }
        let res = await zj.net.w.open({
          url: '/org/list/',
          params
        })
        this.orgList = res.items
      },

      addRequiredUrl() {
        this.requiredUrlList.push({url: ''})
      },
      removeRequiredUrl(index) {
        this.requiredUrlList.splice(index, 1)
      },
      cancelHandleForm() {
        this.$router.push('/list')
      },
      submitHandleForm(formName) {
        // 验证菜单
        let isValidate = true
        _.forEach(this.$refs['Menu'], menuComponent => {
          let result = menuComponent.validateMenus()
          if (result === false) {
            isValidate = false
            return false
          }
        })
        if (!isValidate) {
          this.$message({
            type:'error',
            message:'请检查信息填写是否有无'
          })
          return false
        }
        let menuList = []
        _.each(this.$refs['Menu'], menuComponent => {
          let _menuList = menuComponent.getLevelMenus()
          menuList = _.concat(menuList, _menuList)
        })

//        let replaceReg = /^\/key_procedure/g
//        let replaceName = '/gxgl'
//        _.each(menuList,menu=>{
//          menu.index = menu.index.replace(replaceReg,replaceName)
//        })

//
//        const zjAppType  = ['zhijian','default','zjself']
//        let appName = this.appForm.app_name
//        if(_.indexOf(zjAppType,this.appType) == -1){  // 添加 app_name
//          _.each(menuList,menu=>{
//            if(menu.children.length === 0){
//              menu.url = this.urlAppendParam(menu.url,{app_name:appName},'app_name')
//            }
//          })
//        }
        let menus = _.map(menuList,menu=>{
          return {
            index:menu.index,
            menu_name:menu.menu_name,
            menu_id:menu.menu_id,
            level:menu.level,
            order:menu.order,
            url:menu.url,
          }
        })

        menus = JSON.stringify(menus)
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let params = {}
            _.assign(params, this.appForm)
            params.app_type = this.appType
            params.menus = menus
            params.required_urls = _.join(_.compact(_.map(this.requiredUrlList, item => {
              return item.url
            })), ',')
            if(params.is_limit === OPENRANGE.ALL){
              params.org_limits = ''
            }
            let url, successMessage;
            if (this.handleType == 'creating') {
              url = "/app/create"
              successMessage = '新建应用成功'
            } else if (this.handleType == 'updating') {
              url = "/app/update"
              successMessage = '编辑应用成功'
            }
            let res = await zj.net.open({
              url,
              method: 'POST',
              data: qs.stringify(params)
            })
            if (res.data.result === 0) {
              this.$message({
                type: 'success',
                message: successMessage
              })
              _.delay(() => {
                this.$router.push({name: 'list', params: {org: this.org}})
              }, 1000)
            } else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          } else {
            this.$message({
              type:'error',
              message:'请检查信息填写是否有无'
            })
            return false;
          }
        });
      },
      getSelectOrg(orgList){
        this.appForm.org_limits = _.join(_.map(orgList,org=>{
          return org.org_id
        }),',')
      }
    }
  }
</script>


<style lang="less">
  .avatar-uploader .el-upload {
    width: 150px;
    height: 150px;
    display: block;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }

  .avatar {
    width: 100%;
    height: 100%;
    display: block;
  }

  .btn-form-item .el-form-item__content {
    margin-left: 0 !important;
  }

</style>

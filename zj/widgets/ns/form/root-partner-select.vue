<template>
    <div class="cell">
        <div class="form-label">
            <span style="width: 100px;display: inline-block">{{label}}</span>
            <el-select v-model="selectedPartnerKey" placeholder="请选择">
                <el-option
                    v-for="item in partnerList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/root-partner-select"
let localCache = zj.utils.loadLocalCache("rootPartner")

export default {
    mixins: [FormBase],

    uiRegister(context) {
        // 注册组件，绑定生成对应conf、tpl
        context[uiType] = this
    },

    uiGenConf(options) {
        /*
          生成
          options:
            .label: // 按钮文本
        */
        let name = options.label
        let conf = {
            uiType,
            data: {},
            label: ''
        }
        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-root-partner-select name="${name}"></ns-root-partner-select>`
    },

    data() {
        let label = zj.t('ns.inspection.CHOOSE_ORG')
        return {
            label: label,
            icon: "",
            selectedPartnerKey: "",
            partnerList: [],
            partnerMap: {}
        }
    },
    watch: {
        selectedPartnerKey(val,oldVal){
            let selectedKey = this.selectedPartnerKey
            let partner = this.partnerMap[selectedKey]
            if(val != ''){
                localCache.set("rootPartner", partner).save()
                oldVal == '' ? this.nsset('/rootPartner', partner) : window.location.reload()
            }
        }
    },
    methods: {
        readyCreated() {
            this.nswatch("data", (data)=>{
                this.partnerList = data.result
                this.buildPartnerMap()
            })

            this.loadDataFromRemote()
        },
        buildPartnerMap(){
            _.each(this.partnerList, (partner)=>{
                this.partnerMap[partner.key] = partner
            })
            this.setSeletedPartner()
        },
        setSeletedPartner(){
            let partnerObject = localCache.get("rootPartner")
            let key = _.get(partnerObject, 'key')
            if(!this.partnerMap[key]) key = null
            if(!key){
                partnerObject =  _.head(this.partnerList)
                key = _.get( partnerObject, 'key')
            }

            this.selectedPartnerKey = key
        }
    }
}
</script>






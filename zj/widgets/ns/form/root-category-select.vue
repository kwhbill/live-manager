<template>
    <div class="cell">
        <div class="form-label">
            <span style="width: 100px;display: inline-block">{{label}}</span>
            <el-select v-model="selectedCategoryKey" placeholder="请选择">
                <el-option
                    v-for="item in categoryList"
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
let uiType = "form/root-category-select"
let localCache = zj.utils.loadLocalCache("rootCategory")

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
        return `<ns-root-category-select name="${name}"></ns-root-category-select>`
    },

    data() {
        let label = zj.t('ns.inspection.INSPECTION')
        return {
            label: label,
            icon: "",
            selectedCategoryKey: "",
            categoryList: [],
            categoryMap: {}
        }
    },
    watch: {
        selectedCategoryKey(val,oldVal){
            let selectedKey = this.selectedCategoryKey
            let category = this.categoryMap[selectedKey]
            if(val != ''){
                localCache.set("rootCategory", category).save()
                oldVal == '' ? this.nsset('/rootCategory', category) : window.location.reload()
            }
        }
    },
    methods: {
        readyCreated() {
            this.nswatch("data", (data)=>{
                this.categoryList = data.result
                this.buildCategoryMap()
            })
            this.loadDataFromRemote()
        },
        buildCategoryMap(){
            _.each(this.categoryList, (category)=>{
                this.categoryMap[category.key] = category
            })
            this.setSeletedCategory()
        },
        setSeletedCategory(){
            let categoryObject = localCache.get("rootCategory")
            let key = _.get(categoryObject, 'key')
            if(!this.categoryMap[key]) key = null
            if(!key){
                categoryObject =  _.head(this.categoryList)
                key = _.get( categoryObject, 'key')
            }
            this.selectedCategoryKey = key
        }
    }
}
</script>






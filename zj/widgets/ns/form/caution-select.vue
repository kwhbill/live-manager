<template>
    <div class="cell">
        <div class="form-label">
            <span>{{label}}</span>
            <el-select v-model="comparator.field" placeholder="请选择" class="sub-cell" v-if="showFieldSelect">
                <el-option
                    v-for="item in comparatorFieldList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <span v-else class="fieldFont">{{fieldName}}</span>
            <el-select v-model="comparator.typ" placeholder="请选择" class="sub-cell">
                <el-option
                    v-for="item in comparatorTypMap"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <el-input-number v-model="comparator.num" :min="1" class="sub-cell number-cell">
            </el-input-number>
        </div>
    </div>
</template>

<script>
import FormBase from "./form-base"
let uiType = "form/caution-select"

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
            .nameValues: //指标列表
            .defaultSelectedTpye: //选中的比较方式，高于higher或者低于lower，可不选。默认为空
            .defaultSelectedValue://默认选中的指标
            .value: //选中的值
            .custom //时段是否自定义
        */
        let name = options.label
        let conf = {
            uiType,
            label: '',
            defaultSelectedValue: "",
            nameValues: [],
            value: null,
            custom: false
        }
        return _.merge(conf, options)
    },

    uiGenTpl({ name, conf, ui }) {
        return `<ns-caution-select name="${name}"></ns-caution-select>`
    },

    data() {
        return {
            label: "警示：",
            icon: "",
            comparatorFieldList: [],
            comparatorTypMap: [{
                value: 'higher',
                label:zj.t('ns.comparator.not_less_than')
                },{
                value: 'lower',
                label:zj.t('ns.comparator.less_than')
                }
            ],
            comparator:{
                field: null,
                typ: '',
                num: 1
            },
            fieldName: '',
            showFieldSelect: true
            
        }
    },
    watch: {
        'comparator':{
                handler(val,oldVal){
                    let nowVl = _.values(val)
                    let isExist = true
                    isExist = _.every(nowVl, function(item){
                        return item
                    })
                    if(!isExist){
                        return 
                    }
                    this.nsset("value", val)
                    this.nssetVar(val)   

                },
                deep:true
        }
    },
    methods: {
        readyCreated() {
            let custom = this.nsget('custom')
            this.label = this.nsget('label')
            _.setWith(this.comparator, 'typ', this.nsget("defaultSelectedTpye",'lower'), Object)

            this.nswatch("nameValues", ()=>{
                    this.buildList()
                    if(!custom) this.comparator.field = _.get(this.comparatorFieldList, "0.value")
                }, {firstCall: true})

            if(!custom) {
                let defaultSelectedValue = this.nsget("defaultSelectedValue")
                if (defaultSelectedValue) {
                    this.comparator.field = defaultSelectedValue
                    this.fieldName = this.getFieldName(defaultSelectedValue)
                }
            }
            else{
                this.setByCustom()
            }
            

        },
        buildList(){
            let fieldList = this.nsget("nameValues")
            this.comparatorFieldList = _.map(fieldList, (field)=>{
                return {
                    label: field[0],
                    value: field[1]
                }
            })
            
        },
        setByCustom(){
            if (!this.hasNsWatchVar()) {
                return 
            }
            
            let value = _.get(this.nsgetVar(), 'field')
            this.comparator.field = value
            this.fieldName = this.getFieldName(value)

            this.nswatchVar((name, v) => {
                let field = _.get(v, 'field')
                if(this.comparator.field != field && field) {
                    this.comparator.field = field
                    this.fieldName = this.getFieldName(field)
                }
            })



            this.showFieldSelect = false
        },
        getFieldName(field){
            let list = this.comparatorFieldList
            let index = _.findIndex(list, function(o) { return o.value == field })
            if(index > -1) return _.get(list[index], 'label')
            return ''
        }
    }
}
</script>
<style lang="less" scoped>
    .sub-cell{
        float: left;
        margin-right: 10px;
    }
    
</style>
<style lang="less">
    .form-row .cell .form-label .sub-cell span{
        margin-top: 0px;
    }
    .number-cell .el-input-group>.el-input__inner{
        padding-right: 106px;
    }
    .number-cell {
        .el-input-group__append{
            position: absolute;
            right: -31px;
            top: 0;
            height: 34px;
            width: 10px;
            line-height: 34px;
            color: #333;
        }
    }
    .fieldFont{
        float: left;
        padding-right: 10px;
        margin-top:6px;
    }
</style>





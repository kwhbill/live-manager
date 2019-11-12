<script>
import Base from "./base"
import {components} from "./help"

export default {
    mixins: [Base],
    components,
    data() {
        return {
            state: {},
            readySubs: [], // subscribeStageReady 注册的订阅回调列表
            isStageReady: false,
            nsType: "stage"
        }
    },
    methods:{
        noticeStageReady(){
            let readyProbe = this.nsget("#readyProbe")
            this.nswatch("/isReady", (isReady)=>{
                if(isReady) {
                    if(_.isFunction(readyProbe)){
                        _.bind(readyProbe, this)(
                            _.bind(this.noticeAllSubs, this)
                        )
                    }else{
                        this.noticeAllSubs()
                    }
                }
            }, {firstCall: true})
        },
        subscribeStageReady(resolve){
            if(this.isStageReady){ // 若已就绪，则直接回调
                resolve()
            } else { // 加入回调列表
                this.readySubs.push(resolve)
            }
        },
        noticeAllSubs(){
            this.isStageReady = true
            _.each(this.readySubs, (fn)=>{
                fn()
            })
        }
    }
}
</script>


<style lang="less">
.ns-stage {
    .ns-header {
        margin-top: 40px;
    }

    .ns-view {
        margin-top: 30px;
    }
    .data-update-tip{
        color: #999;
        font-size: 14px; 
        margin-top: 13px;
    }
}
.form-row{
    width: 100%;
    overflow: hidden;
    .cell{
        padding-right: 15px;
        box-sizing: border-box;
        float: left;
        margin:0 0 15px;
        &>div{
            width: 100%;
            
        }
        
        .form-label {
            display: flex;
            span{
                margin-top: 6px;
            }
            &>div {
                flex:1;
            }
        }

    }
}
.org-select-box{
    display: inline-block;
}
.stage-box{
    margin-bottom: 100px;
}
</style>

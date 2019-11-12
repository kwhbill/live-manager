<template>
  <div class="rank-table">
    <div class="rank-head">
      <span class="title">{{title}}</span>
      <el-button type="text" @click="dialogVisible = true">查看更多</el-button>
    </div>
    <div class="rank-body">
      <el-row>
        <el-col :span="6" v-for="(items,index) in tableList" :key="index">
          <div class="rank-title">
            <span>{{items.name}}</span>
            <span>{{items.changName}}</span>
          </div>
          <div class="rank-team" v-for="(team,i) in items.children" :key="i">
            <span :class="items.rankType">{{i + 1}}</span>
            <span>{{team.entityName}}</span>
            <span >{{team.rate}}</span>
            <span v-show="index == 0 || index == 1" :class="{down:team.rateChange.slice(0,1)=='-'}">{{team.rateChange}}</span>
            <span v-show="index == 2 || index == 3" :class="{down:team.rankChange.toString().slice(0,1)=='-'}">{{team.rankChange>=0 ? `+`: ``}}{{team.rankChange}}</span>
          </div>
        </el-col>
      </el-row>
    </div>

    <rank-table-dialog v-model="dialogVisible" 
      :title="title" 
      :entityLabel = "entityLabel"
      :name="indicatorName" 
      :isShow="dialogVisible" 
      :tableData="dialogTableList">
    </rank-table-dialog>

  </div>
</template>

<script>
    import ViewBase from "../view-base"
    import RankTableDialog from "./dialog"
    let theLastRankNum = 999
    let uiType = "view/rank-table"
    export default {
        mixins: [ViewBase],
        components: {
            RankTableDialog
        },
        uiRegister(context) {
            // 注册组件，绑定生成对应conf、tpl
            context[uiType] = this
        },
        uiGenConf(options) {
            /*
              生成
              options:
                source: "aaaa"  // 监听的 source name
                title: "" //表头名称
                indicatorName: "" //显示的指标名称
                firstColumn: {
                  label: //对比实体的名称
                  field: //实体数据的字段
                }
            */
            let conf = {
                uiType,
                source: ""
            }
            return _.merge(conf, options)
        },
        uiGenTpl({ name, conf, ui }) {
            return `<ns-rank-table name="${name}"></ns-rank-table>`
        },
        data() {
            return {
                title: '',
                indicatorName: '',
                tableList: [
                  {rankType: 'mostHigh', name: '排名最高', children:[], changName: '对比上月'},
                  {rankType: 'mostLow', name: '排名最低', children:[], changName: '对比上月'},
                  {rankType: 'mostUp', name: '排名上升最多', children:[], changName: '排名变化'},
                  {rankType: 'mostDown', name: '排名下降最多', children:[], changName: '排名变化'}
                ],
                dialogVisible: false,
                dialogTableList: [],
                entityLabel: ''

            };
        },
        methods: {
            readyCreated(){
                this.title = this.nsget('title', '')
                this.indicatorName = this.nsget('indicatorName', '')
                this.entityLabel = this.nsget("firstColumn.label")
            },
            onSourceChange(data){
                this.handleData(data.result.items)
            },
            handleData(data) {
                let field = this.nsget("firstColumn.field")
                let teamList = []
                let entityName, rank, rate, rankChange, rateChange
                teamList = _.map(data, item => {
                    entityName = _.get(item, field, '');
                    item.lastRate = item.lastRate * 100
                    item.rate = item.rate * 100
                    rate = this.formatterContent(item.rate, `%`)
                    rankChange = !item.lastRank || !item.rank ? 0 : item.lastRank - item.rank
                    rateChange = _.toNumber(item.rate) - _.toNumber(item.lastRate)
                    rateChange = rateChange == 0 ? rateChange : rateChange.toFixed(2)
                    rateChange = rateChange >= 0 ? `+${rateChange}%` : `${rateChange}%`
                    rank = this.formatterContent(item.rank)
                    return {
                        entityName,
                        rank,
                        rate,
                        rankChange,
                        rateChange
                    }
                })
                let tableList = this.tableList
                tableList[0].children = teamList.sort((itemA, itemB) => {
                    if(itemA.rank == '-') itemA.rank = theLastRankNum 
                    if(itemB.rank == '-') itemB.rank = theLastRankNum
                    return itemA.rank - itemB.rank
                }).slice(0,3)
                tableList[1].children = teamList.sort((itemA, itemB) => {
                    if(itemA.rank == '-') itemA.rank = theLastRankNum
                    if(itemB.rank == '-') itemB.rank = theLastRankNum
                    return itemB.rank - itemA.rank
                }).slice(0,3)
                tableList[2].children = teamList.sort((itemA, itemB) => {
                    return itemB.rankChange - itemA.rankChange
                }).slice(0,3)
                tableList[3].children = teamList.sort((itemA, itemB) => {
                    return itemA.rankChange - itemB.rankChange
                }).slice(0,3)
                this.dialogTableList = teamList
            },
            formatterContent(data, extra){
                if(!data) return '-'
                data = _.round(data,2)
                if(extra) return `${data}${extra}`
                return `${data}`
                
            }
        }
    }
</script>

<style lang="less">
  .rank-table {
    border: 1px solid rgba(0,0,0,.12);
    .rank-head {
      background: rgb(215,215,215);
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding-left: 10px;
      padding-right: 10px;
      .title{
        float: left;
      }
      .el-button{
        float: right;
      }
    }
    .rank-body{
      .el-col{
        padding:10px;
        border-right: 1px solid rgba(0,0,0,.12);
        &:last-child{
          border-right:none;
        }
      }
      .rank-title{
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        overflow: hidden;
        span{
          width: 75%;
          float: left;
          &:last-of-type{
            width: 25%;
            text-align: left;
            font-size: 14px;
            color: #6d6d6d;
          }
        }
      }
      .rank-team{
        span{
          text-align: left;
          display: inline-block;
          vertical-align: middle;
        }
        :nth-child(1){
          width: 5%;
          font-size: 20px;
        }
        :nth-child(2){
          font-size: 14px;
          width: 40%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          height: 20px;
        }
        :nth-child(3){
          font-weight: 700;
          width: 25%;
          font-size: 16px;
        }
        :nth-child(4),:nth-child(5){
          width: 20%;
          color: #98c379;
          font-size: 14px;
        }
        .mostHigh{
          color: rgb(184,49,0);
        }
        .mostUp{
          color: rgb(184,49,0);
        }
        .mostLow{
          color: #666;
        }
        .mostDown{
          color:  #666;
        }
        .down{
          color: #e06c75;
        }
      }


    }


  }
</style>

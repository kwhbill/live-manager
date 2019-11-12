<template>
  <el-dialog :title="title" v-model="dialogVisible">
      <el-table
      :data="items"
      height="250"
      border
      :default-sort = "{prop: 'rate', order: 'descending'}"
      style="width: 100%">
      <el-table-column
        prop="entityName"
        :label="entityLabel"
        width="180">
      </el-table-column>
      <el-table-column
        prop="rate"
        :label="name"
        sortable
        :sort-method= "sortFun"
        width="180">
      </el-table-column>
      <el-table-column
        prop="rank"
        sortable
        :sort-method= "sortRnkFun"
        label="排名">
      </el-table-column>
      <el-table-column
        prop="rankChange"
        sortable
        label="本月排名变化">
        <template slot-scope="scope">
          <span :class="{down:scope.row.rankChange.toString().slice(0,1)=='-'}">{{scope.row.rankChange}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
let theLastRankNum = 999
export default {
  props: ["tableData", "isShow", "title", "name", "entityLabel"],
  computed:{
    dialogVisible: {
      get: function () {
        return this.isShow
      },
      set: function (v) {
        this.$emit("input",v);
      }
    },
    items(){
      _.each(this.tableData, (data)=>{ 
        if(data.rank == theLastRankNum)  data.rank = '-'
      })
      return this.tableData
    }
  },
  methods:{
    sortFun(a, b){
      let firstRate = _.toNumber(_.head(_.split(a.rate, '%')))
      let secondRate = _.toNumber(_.head(_.split(b.rate, '%')))
      if(a.rate == '-') firstRate = 0
      if(b.rate == '-') secondRate = 0
      if(firstRate > secondRate) return true
    },
    sortRnkFun(a, b){
      if(a.rank == '-') a.rank = theLastRankNum
      if(b.rank == '-') b.rank = theLastRankNum
      let firstRnk = _.toInteger(a.rank)
      let secondRank = _.toInteger(b.rank)
      if(firstRnk < secondRank) return true
    }
  }
}
</script>

<style lang="less" scoped>
  .cell{
    span {
       color: #98c379;
    }
    .down{
      color: #e06c75;
      
    }
  }
  
</style>

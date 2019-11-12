<script>
export default {
  props: ["table", "column", "row"],
  render(h){
      if(_.isFunction(this.column.render)){
          let v = this.row[this.column.key]
          return _.bind(this.column.render,this.table)(h, v, this.row)
      }
      return (
        <div domPropsInnerHTML={this.renderCellHTML()}></div>
      )
  },
  methods:{
    renderCellHTML(){
        let column = this.column
        let row = this.row
        let html = column.html
        let cellValue = _.get(row, column.key)
        if(_.isFunction(html)){
            return _.bind(html, this.table)(cellValue, row, column)
        }
        return cellValue
    }
  }
}
</script>

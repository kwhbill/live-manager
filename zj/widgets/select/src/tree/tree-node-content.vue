<script>
export default {
  render(h){
      let node = this.$parent.node
      let renderContent = this.$parent.tree.renderContent || this.renderLabel
      return _.bind(renderContent, this)(h, node)
  },
  methods:{
    renderLabel(h, node){
        return (
            <span class="label">{node.label}</span>          
        )
    }
  }
}
</script>

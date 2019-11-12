
<script>
import Base from "../base"
export default {
  mixins: [Base],
  data () {
      return {
          nsType: "view",
          loading2: true
      }
  },
  created(){
      let sourceName = this.nsget("source")
      this.nswatch(`#source.${sourceName}.data`, (data)=>{
          this.onSourceChange(data)
      })
    this.nswatchVar((name, v) => {
        let data = this.nsget(`#source.${sourceName}.data`)
        if(!_.isEmpty(data)){
            this.onSourceChange(data)
        }
    })
  },
  methods:{
    onSourceChange(data){

    }
  }
}
</script>
<style>
    /* fix：页面整体下陷  */

    .loading-box{
        width: 100%;
        height: 100%;
    }
</style>

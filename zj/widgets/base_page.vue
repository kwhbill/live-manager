<script>
export default {
    created() {
        this.$emit("created", this)
    },

    methods: {
        setup() {
            // app layout 相关初始化完毕，回调页面setup方法
        }
    }
}
</script>

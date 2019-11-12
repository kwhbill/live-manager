<template>
    <div class="return-top" v-show="showReturn" @click="returnTop()">
        <i class="fa fa-rocket"></i>
    </div>
</template>


<script>
export default {
    data () {
        return {
            showReturn: false
        }
    },
    created() {
        window.addEventListener('scroll', this.handleScroll)
    },
    methods: {
        returnTop() {
            window.scrollTo(0, 0)
        },
        handleScroll() {
            let scrolled = window.scrollY;
            if (scrolled > 100) {
                this.showReturn = true
            }
            else {
                this.showReturn = false
            }
        }
    }
}
</script>


<style lang="less">
.return-top{
    position: fixed;
    cursor: pointer;
    right: 20px;
    bottom: 60px;
    width: 50px;
    height: 50px;
    z-index: 999;
    background: rgba(34, 56, 93, 0.73);
    color: #fff;
    border-radius: 25px;
    text-align: center;
    line-height: 50px;
    font-size: 24px;
    transform:rotate(-45deg);
    -ms-transform:rotate(-45deg); 	/* IE 9 */
    -moz-transform:rotate(-45deg); 	/* Firefox */
    -webkit-transform:rotate(-45deg); /* Safari 和 Chrome */
    -o-transform:rotate(-45deg); 	/* Opera */
}
</style>

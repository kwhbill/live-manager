<template>
    <div class="nav-level">
        <div class="progress-block" :style="{width: levelPercent}"></div>
    </div>
</template>

<script>
export default {
    props: {
        level: {
            type: String,
            default: ""
        },
        levels: {
            type: Array,
            default(){
                return []
            }
        }
    },
    computed: {
        levelPercent() {
            let percent = 0

            if(this.levels.length){
                let index = _.indexOf(this.levels, this.level) + 1
                percent = 100 * index / this.levels.length
            }

            return `${percent}%`;
        }
    }
}
</script>


<style lang="less">
.nav-level {
    background-color: #475669;
    .progress-block {
        background-color: #20a0ff;
        height: 3px;
    }
}
</style>


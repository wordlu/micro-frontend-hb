<template>
    <div class="ph-cell" :style="style">
        <span v-if="state === 'loading'">loading</span>
        <span v-if="state !== 'loading'">{{value}}</span>
    </div>
</template>
<script>

export default {
    data() {
        return {

        }
    },
    computed: {
        style: function() {
            let tmp = ""
            let itemWidth = this.cellWidth
            let itemHeight = this.cellHeight
            let dtype = this.dtype
            tmp = "width: " + itemWidth + 'px;'
            tmp += "height: " + itemHeight + 'px;'
            if (dtype === "Text") {
                tmp += "text-align: left;"
            }
            if(this.state === "reverse") {
                tmp += "color: #bbb"
            }
            return tmp
        }
    },
    components: {

    },
    props: {
        state: {
            type: String,
            default: "loading"
        },
        value: {
            type: String,
            default: ""
        },
        cellWidth: {
            type: Number,
            default: 118
        },
        cellHeight: {
            type: Number,
            default: 24
        },
        dtype: {
            type: String,
            default: "Number"
        }
    },
    beforeMount() {},
    mounted() {},
    methods: {},
    watch: {}
};
</script>
<style lang="scss" scoped>
    .ph-cell {
        font-size: 12px;
        border: #CFCFCF 1px solid;
        box-sizing: border-box;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
</style>

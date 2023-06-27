<template>
    <div class="progress-bar">
        <div class="header">
            <span class="title">进度</span>
            <img :src="close_icon" class="close_icon" alt="" v-show="progressOver" @click="closeProgress">
        </div>
        <div class="bar">
            <div class="pro_bar" :style="{width: barWidth + 'px'}"></div>
            <span class="per">{{percent}}%</span>
        </div>
    </div>
</template>
<script>
import { staticFilePath } from "../config/envConfig"

export default {
    data: () => {
        return {
            close_icon: `${staticFilePath}` + "/icon_close.svg",
            barWidth: 0,
            percent: 0
        }
    },
    props: {
        progressOver: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.percent = 0
        this.barWidth = 0
        this.progress()
    },
    watch: {
        progressOver() {
            this.progress()
        }
    },
    methods: {
        progress() {
            let that = this
            const interval = setInterval(() => {
                //接到消息，直接结束
                if(this.progressOver) {
                    //循环结束
                    that.percent = 100
                    that.barWidth = 300
                    clearInterval(interval)
                }
                if(that.percent >= 99) {
                    clearInterval(interval)
                }
                that.barWidth = that.barWidth + 1
                that.percent = Math.floor(that.barWidth / 3)
            },1000) 
        },
        closeProgress() {
            this.$emit("closeProgress")
        }
    }
}
</script>
<style scoped lang="scss">
    .progress-bar {
        box-sizing: border-box;
        width: 370px;
        height: 114px;
        background: #FFFFFF;
        border: 1px solid #979797;
        position: absolute;
        bottom: 20px;
        right: 290px;
        z-index: 5;
        padding: 20px;
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            .title {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #000000;
                font-weight: 500;
            }
            .close_icon {
                width: 24px;
                height: 24px;
                cursor: pointer;
            }
        }
        .bar {
            width: 300px;
            height: 14px;
            background: #E9ECFF;
            border-radius: 7px;
            display: flex;
            align-items: center;
            flex-wrap: npwrap;
            .pro_bar {
                height: 14px;
                background: #6E7CD9;
                border-radius: 7px;
            }
            .per {
                font-family: PingFangSC-Medium;
                font-size: 10px;
                color: #000000;
                text-align: center;
                font-weight: 500;
                position: absolute;
                right: 20px;
            }
        }
    }
</style>

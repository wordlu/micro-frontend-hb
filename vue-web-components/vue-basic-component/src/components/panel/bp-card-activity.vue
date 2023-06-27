<template>
<div class="content-active-panel" @click="toActivityPage">
    <div class="active-img">
        <img class="active-img-bgc" :src="imgPath(bgImgs, 'cover')" alt="">
        <img class="above-data-logo" v-if="logoImg" :src="imgPath(logoImg)" alt="">
    </div>
    <div class="active-info">
        <div class="home-avtive-names">
            <span class="active-logo">{{logoText}}</span>
            <span class="active-title">{{title}}</span>
        </div>
        <span class="position-info">{{transDate()}}  {{city}}</span>
    </div>
</div>
</template>

<script>
import { staticFilePath } from '../../config/envConfig'

export default {
    components: {},
    data() {
        return {
            language: '中文',
            translation_basedata: {
                cn: {
                    boyunhui: "伯云论坛",
                    "Above Data": "Above Data",
                    industry: "行业活动"
                },
                en: {
                    boyunhui: "Boyun Forum",
                    "Above Data": "Above Data",
                    industry: "Event"
                }
            }
        }
    },
    created() {
        this.language = window.localStorage.getItem('lang')
    },
    computed: {
        translation_data: function() {
            if (this.language === '中文') {
                return this.translation_basedata.cn
            } else if (this.language === 'English') {
                return this.translation_basedata.en
            }
        },
        logoText: function() {
            return this.translation_data[this.type]
        }
    },
    methods: {
        transDate() {
            let date = new Date(this.date)

            let y = date.getUTCFullYear()
            let d = date.getUTCDate()
            let m = date.getUTCMonth()

            m = m + 1 < 10 ? "0" + (m+1) : m+1
            d = d < 10 ? "0"+ d : d   
            return y + "-" + m + "-" + d
        },
        imgPath(...params) {
            if ( params.length === 2 && params[1] === "cover") {
                const arr = params[0]
                const cover = arr.find(it => it.tag === "cover")
                return cover.path
            } else if (params[0]) {
                const ipath =  params[0]
                return ipath;
            } 
        },
        toActivityPage() {
            let curType = ""
            
            if (this.type === "Above Data") {
                curType = "above-data-detail"
            } else if (this.type === "industry") {
                curType = "industry-activity-detail"
            } else if (this.type === "boyunhui") {
                curType = "boyunhui"
            }
            this.$emit('toActivityPage', curType, this.curIndex)
        }
    },
    props: {
        id: String,
        bgImgs: Object,
        logoImg: String,
        title: String,
        date: Date,
        city: String,
        type: String,
        curIndex: Number
    }
}
</script>

<style lang="scss" scoped>
* {
    letter-spacing: .4px;
    line-height: 1.6;
    box-sizing: border-box;
}
.content-active-panel {
    height: 367px;
    width: 279px;
    position: relative;
    margin-right: 8px;
    box-shadow: 0 6px 8px 0 rgba(22, 28, 57, 0.15);
    background: #FFF;
    border-radius: 2px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    align-items: stretch;
    justify-content: flex-start;
    cursor: pointer !important;

    .active-img {
        height: 240px;
        width: 279px;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: stretch;
        justify-content: flex-start;
        align-content: flex-start;

        .active-img-bgc {
            background-size: cover;
            width: 100%;
            height: 100%;
            border-radius: 2px 2px 0 0;
            z-index: 2;
            object-fit: cover; //保持图片宽高比并填充整个内容框
            cursor: pointer !important;
            pointer-events: none; //target鼠标事件
        }

        .above-data-logo {
            width: 72px!important;
            height: 72px!important;
            border-radius: 2px 2px 0 0;
            z-index: 2;
            object-fit: fill;
            bottom: 0;
            left: 32px;
            position: absolute;
            background-color: #fff;
            padding: 10px;
            opacity: .9;
        }
    }

    .active-info {
        height: 127px;
        width: auto;
        position: relative;
        background: 0 0;
        padding: 24px 32px 0;
        display: flex;
        flex-direction: column;
        align-content: flex-start;
        align-items: stretch;
        justify-content: flex-start;
        .home-avtive-names {
            width: 100%;
            height: 42px;
            margin-bottom: 4px;
            display: flex;
            flex-direction: column;
            align-content: flex-start;
            align-items: stretch;
            justify-content: flex-start;
            .active-title {
                width: auto;
                height: auto;
                background: 0 0;
                white-space: pre-line;
                overflow: hidden;
                -webkit-line-clamp: 2;
                font-size: 14px;
                color: #2d334d;
                letter-spacing: .35px;
                font-weight: 700;
                padding: 0;
            }
            .active-logo {
                display: none;
                height: auto;
                width: auto;
                background: 0 0;
                margin-bottom: 8px;
                color: #454A61;
                letter-spacing: 1px;
                font-size: 12px;
                padding: 0;
            }
        }
        .position-info {
            position: absolute;
            bottom: 30px;
            height: auto;
            width: auto;
            background: 0 0;
            font-size: 12px;
            color: #a2a5b0;
            padding: 0;
        }
    }
}
</style>

<template>
    <div class="bp-report-list">
        <div class="report-list-header">
            <bpImg :src="reportListHeader" class="above-data-detail-header-img"></bpImg>
            <bpText class="ph-body-small-inverse top-breadcrumb">
                <span class="mr-0" @click="linkToPage('home')">{{translation_data.home}}</span>
                <span class="mr-0">/</span>
                <span>{{translation_data.report}}</span>
            </bpText>
            <bpText class="ph-H-xLarge-inverse">{{translation_data.pressRelease}}</bpText>
            <bpText class="ph-H-Large-2-inverse">{{translation_data.topDesc}}</bpText>
        </div>
        <div class="report-list-content">
            <div class="report-list-content-each" 
                v-for="(item,index) in allData.reportsList"
                :key="index" @click="linkToPage('download-report', index)">
                <div class="report-list-content-left">
                    <div class="report-list-imgcontainer">
                        <bpImg class="report-list-img" :src="imgPath(item.cover.get('path'))"></bpImg>
                        <div class="report-list-img-mask"></div>
                    </div>
                </div>
                <div class="report-list-content-right">
                    <div class="main-flex-start" v-if="index == 0">
                        <bpText class="latest-release">{{translation_data.latest}}</bpText>
                    </div>
                    <bpText class="ph-H-Large_2">{{item.title}}</bpText>
                    <bpText class="ph-body-small">{{transDate(item.date)}}</bpText>
                    <bpText class="report-list-content-desc">{{item.description}}</bpText>
                    <div class="main-flex-start">
                        <bpText class="ph-H-Small">{{translation_data.download}}</bpText>
                        <bpImg class="report-list-button-go" :src="iconGo"></bpImg>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bpText from '../bp-text'
import bpImg from '../bp-img'
import { staticFilePath } from '../../config/envConfig'
import bpButton from '../bp-button'
export default {
    name: "report-list",
    components: {
        bpText,
        bpImg,
        bpButton
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    data() {
        return {
            language: '中文', // 中英切换
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            response: false,
            responseMini: false,
            reportListHeader: `${staticFilePath}` + "/img_report-list_hero_bg.jpg",
            iconGo: `${staticFilePath}` + "/icon_go.svg",
            translation_basedata: {
                cn: {
                    home: "主页",
                    report: "行业报告",
                    pressRelease: "行业报告",
                    topDesc: "深度医药市场行业分析报告，时刻关注行业动态发展",
                    latest: "最新发布",
                    download: "获取报告"
                },
                en: {
                    home: "Home",
                    report: "Released Reports",
                    pressRelease: "Released Reports",
                    topDesc: "In-depth Industry Analysis Report of Pharmaceutical Market",
                    latest: "Latest Released",
                    download: "DOWNLOAD"
                }
            }
        }
    },
    computed: {
        translation_data: function() {
            if (this.language === '中文') {
                return this.translation_basedata.cn
            } else if (this.language === 'English') {
                return this.translation_basedata.en
            }
        }
    },
    watch: {
        windowWidth(val) {
            if(val < 1100) {
                this.response = true
            } else {
                this.response = false
            }
            if(val <= 549) {
                this.responseMini = true
            } else {
                this.responseMini = false
            }
        }
    },
    created() {
        window.addEventListener('beforeunload', e => {
            window.scrollTo(0,0)
        });
        let originalSetItem = localStorage.setItem,
            lang = window.localStorage.getItem('lang')
        if (!lang) {
            lang = navigator.language || navigator.userLanguage
            if (lang === 'English') {
                localStorage.setItem('lang', 'English')
            } else {
                localStorage.setItem('lang', '中文')
            }
        } else {
            this.language = lang
        }
        localStorage.setItem = function(key,newValue){
            let event = new Event("setItemEvent");
            event.key = key;
            event.newValue = newValue;
            window.dispatchEvent(event);
            originalSetItem.apply(this,arguments);
        }
    },
    mounted() {
        const that = this;
        if(this.windowWidth < 1100) {
            this.response = true
        } else {
            this.response = false
        }
        if(this.windowWidth <= 549) {
            this.responseMini = true
        } else {
            this.responseMini = false
        }
        window.onresize = () => {
            return (() => {
                window.windowWidth = document.body.clientWidth;
                window.windowHeight = document.body.clientHeight;
                that.windowWidth = window.windowWidth;
                that.windowHeight = window.windowHeight;
            })()
        }
        window.addEventListener('setItemEvent', function(e) {
            that.language = e.newValue
        })
    },
    methods: {
        linkToPage(value, idx) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    name: value,
                    index: idx
                }
            }
            this.$emit('event', event)
            // this.returnToTop()
        },
        returnToTop() {
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
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
        transDate(param) {
            let date = new Date(param)
            let y = date.getUTCFullYear()
            let d = date.getUTCDate()
            let m = date.getUTCMonth()
            return y + "年" + (m+1) + "月" + d + "日"
        }
    }
}
</script>
<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    .bp-report-list {
        width: 100%;
        min-width: 375px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .report-list-header {    
            height: 600px;
            width: 100%;
            background: 0 0;
            background-image: linear-gradient(rgba(22,28,57,.5),rgba(22,28,57,.5));
            padding: 0 100px;
            background-size: cover;
            display: flex;
            justify-content: center;
            flex-direction: column;
            .above-data-detail-header-img {
                height: 600px;
                width: 100%;
                position: absolute;
                z-index: -2;
                left: 0;
                object-fit: cover;
            }
            .ph-body-small-inverse {
                opacity: .7;
                font-size: 14px;
                color: #FFF;
                cursor: pointer!important;
            }
            .top-breadcrumb {
                position: absolute;
                top: 104px;
            }
            .mr-0 {
                margin-right: 2px;
            }
            .ph-H-xLarge-inverse {
                font-size: 40px;
                color: rgba(255,255,255,.9);
                margin-bottom: 16px;
                margin-top: 70px;
            }
            .ph-H-Large-2-inverse {
                font-size: 24px;
                color: rgba(255,255,255,.9);
                margin-bottom: 40px;
                margin-top: 8px;
            }
        }
        .report-list-content {
            width: 100%;
            align-items: center;
            display: flex;
            flex-direction: column;
            .report-list-content-each {
                margin-top: 64px;
                padding-bottom: 63px;
                width: 83%;
                border-bottom: 1px solid rgba(22,28,57,.12);height: auto;
                background: 0 0;
                display: flex;
                flex-direction: row;
                cursor: pointer!important;
                .report-list-content-left {
                    width: 40%;
                    height: 330px;
                    align-items: center;
                    display: flex;
                    flex-direction: column;
                    .report-list-imgcontainer {
                        height: 330px;
                        object-fit: fill;
                        width: auto;
                        background: 0 0;
                        display: flex;
                        .report-list-img {
                            width: 225px;
                            height: 318px;
                            border-radius: 2px;
                            object-fit: cover;
                        }
                        .report-list-img-mask {
                            width: 201px;
                            height: 315px;
                            position: absolute;
                            border-radius: 2px;
                            background: #747789;
                            z-index: -1;
                            box-shadow: 0 5px 7px 0 rgba(22, 28, 57, 0.36);
                            transform-origin: 0 242px;
                            transform: rotate(4deg) translateX(6px);
                        }
                    }
                }
                .report-list-content-right {
                    width: 40%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    .main-flex-start {
                        display: flex;
                        .latest-release {
                            background-image: linear-gradient(204deg,#FCEB6F 0,#F7D450 88%);
                            width: auto;
                            height: 24px;
                            margin-bottom: 16px;
                            padding: 0 5px;
                            font-size: 12px;
                            color: #2D334D;
                            letter-spacing: .4px;
                            text-align: center;
                            line-height: 24px;
                            font-weight: 600;
                        }
                    }
                    .ph-H-Large_2 {
                        margin-bottom: 16px;
                        font-size: 24px;
                        color: #2D334D;
                    }
                    .ph-body-small {
                        margin-bottom: 16px;
                        font-size: 14px;
                        color: #747789;
                    }
                    .report-list-content-desc {
                        height: 65px;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 3;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        margin-bottom: 40px;
                        font-size: 14px;
                        color: #747789;
                    }
                    .ph-H-Small {
                        font-size: 14px;
                        color: #2D334D;
                        letter-spacing: .35px;
                        font-weight: 700;
                    }
                    .report-list-button-go {
                        width: 21px;
                        height: 21px;
                        margin-left: 8px;
                        object-fit: cover;
                    }
                }
            }
        }
        @media (max-width: 768px) {
            .report-list-content-left {
                margin-right: 10px;
            }
            .report-list-content-right {
                margin-left: 10px;
            }
        }
        @media (max-width: 549px), (width: 549px) {
            .report-list-header {
                padding: 0 24px !important;
            }
            .report-list-content .report-list-content-each {
                width: 90% !important;
                flex-direction: column;
                align-items: center;

                .report-list-content-left {
                    width: 100% !important;
                    align-items: center;
                    justify-content: flex-start;
                    margin-bottom: 40px;
                }

                .report-list-content-right {
                    width: 100% !important;
                }
            }
        }
    }
</style>
<template>
    <div class="bp-industry-activity-detail">
        <!-- eventAll: {{allData.eventAll}}
        data: {{allData.data}}
        participantList: {{allData.participantList}}
        galleryShow: {{allData.galleryShow}}
        galleryList: {{allData.galleryList}}
        imageList: {{allData.imageList}} -->
        <div class="industry-activity-detail-header" v-for="(activity,index) in allData.data" :key="index + '1'">
            <bpImg class="industry-activity-detail-header-img" :src="imgPath(activity.gallery, 'cover')"></bpImg>
            <bpText class="ph-body-small-inverse top-breadcrumb">
                <span class="mr-0" @click="linkToPage('home')">{{translation_data.home}}</span>
                <span class="mr-0">/</span>
                <span class="mr-0" @click="linkToPage('activity-list')">{{translation_data.activityList}}</span>
                <span class="mr-0">/</span>
                <span>{{activity.title}}</span>
            </bpText>
            <div class="header-img-mask">
            </div>
            <bpText class="ph-H-xLarge-inverse">{{activity.title}}</bpText>
            <bpText class="ph-H-Large-2-inverse">{{activity.subTitle}}</bpText>
            <div class="industry-activity-detail-header-info-row">
                <div class="industry-activity-detail-header-divider">
                    <div class="date">
                        <div class="icon_date"></div>
                        <bpText class="ph-H-Medium-inverse">{{transDate(activity.startDate, 0)}}</bpText>
                    </div>
                    <div class="address">
                        <div class="icon_location"></div>
                        <bpText class="ph-H-Medium-inverse">{{activity.location}}</bpText>
                    </div>
                </div>
            </div>
        </div>
        <div class="industry-activity-detail-desc" v-for="(activity,index) in allData.data" :key="index + '2'">
            <bpImg :src="lineImg" class="industry-activity-detail-img"></bpImg>
            <bpText class="ph-H-Large_2">{{activity.contentTitle}}</bpText>
            <bpText class="ph-body-medium">{{activity.contentDesc}}</bpText>
        </div>
        <div class="main-flex-start">
            <bpImg class="line-img" :src="lineImg"></bpImg>
        </div>
        <div class="main-flex-start">
            <bpText class="ph-H-Large_2">{{translation_data.speaker}}</bpText>
        </div>
        <div class="industry-activity-detail-speaker-container">
            <div class="industry-activity-detail-speaker" v-for="(speaker, index) in allData.eventAll" :key="index" :class="[index == 0?'self-cross-flex-end':'self-cross-flex-start']">
                <div class="speaker-info-left">
                    <div class="pharbers-speaker-bg"></div>
                    <bpImg class="pharbers-speaker-avatar" :src="speaker.image.path"></bpImg>
                    <bpText class="ph-H-Medium">{{speaker.speaker}}</bpText>
                </div>
                <div class="speaker-info-right">
                    <bpImg class="quotation-marks-img" :src="quotataion"></bpImg>
                    <bpText class=" ph-H-Large_brand activity-speaker-content">{{speaker.event.title}}</bpText>
                    <bpText class="ph-body-small activity-speaker-content">{{speaker.event.description}}</bpText>
                </div>
            </div>
        </div>
        <div class="main-flex-start">
            <bpImg class="line-img" :src="lineImg"></bpImg>
        </div>
        <div class="main-flex-start">
            <bpText class="ph-H-Large_2 mb-64">{{translation_data.gallery}}</bpText>
        </div>

        <bpPhoto :galleryShow="allData.galleryShow[0]" :galleryList="allData.galleryList"></bpPhoto>
    </div>
</template>
<script>
import bpText from '../bp-text'
import bpImg from '../bp-img'
import bpButton from '../bp-button'
import { staticFilePath } from '../../config/envConfig'
import bpPhoto from '../panel/bp-gallery-image'

export default {
    name: "",
    components: {
        bpText,
        bpImg,
        bpButton,
        bpPhoto
    },
    data() {
        return {
            language: '中文', // 中英切换
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            response: false,
            responseMini: false,
            headerImg: `${staticFilePath}` + "/photo_events_nanjing_2019-10-23_00001.jpg",
            lineImg: `${staticFilePath}` + "/img_connect_line.svg",
            headTest: `${staticFilePath}` + "/avatar_cl.png",
            quotataion: `${staticFilePath}` + "/img_bg_view.svg",
            translation_basedata: {
                cn: {
                    home: "主页",
                    activityList: "活动资讯",
                    speaker: "法伯讲者",
                    gallery: "精彩回顾"
                },
                en: {
                    home: "Home",
                    activityList: "Events",
                    speaker: "Speaker",
                    gallery: "Gallery"
                }
            }
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    "galleryShow": []
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
        transDate(param, type) {
            let date = new Date(param)
            let y = date.getUTCFullYear()
            let d = date.getUTCDate()
            let m = date.getUTCMonth() 

            if(type == 1) {
                let hour = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours()
                let minute = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes()
                return hour + ":" + minute
            } else if(type == 0) {
                m = m + 1 < 10 ? "0" + (m+1) : m+1
                d = d < 10 ? "0"+ d : d   
                return y + "-" + m + "-" + d
            }
            
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
    .bp-industry-activity-detail {
        width: 100%;
        min-width: 375px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .industry-activity-detail-header {
            height: 600px;
            width: 100%;
            background: 0 0;
            background-image: linear-gradient(rgba(22,28,57,.5),rgba(22,28,57,.5));
            padding: 0 100px;
            background-size: cover;
            display: flex;
            justify-content: center;
            flex-direction: column;
            .industry-activity-detail-header-img {
                object-fit: cover;
                height: 600px;
                width: 100%;
                position: absolute;
                z-index: -2;
                left: 0;
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
            .header-img-mask {
                height: 600px!important;
                width: 100%!important;
                position: absolute;
                z-index: -1;
                left: 0;
                background: rgba(22,28,57,.5)!important;
                display: flex;
            }
            .ph-H-xLarge-inverse {
                margin-bottom: 32px!important;
                font-size: 40px;
                color: rgba(255,255,255,.9);
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                overflow: hidden;
            }
            .ph-H-Large-2-inverse {
                width: 771px;
                margin-top: 8px;
                font-size: 24px;
                color: rgba(255,255,255,.9);
            }
            .industry-activity-detail-header-info-row {
                display: flex;
                flex-direction: row;
                .industry-activity-detail-header-divider {
                    padding-top: 38px;
                    margin-top: 40px;
                    border-top: 1px solid rgba(255,255,255,.2);
                    display: flex;
                    flex-direction: column;
                    .date {
                        display: flex;
                        flex-direction: row;
                        margin-bottom: 16px;
                        .icon_date {
                            background: url("data:image/svg+xml,%3Csvg width='1024' height='1024' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M810.667 147.2H768V64h-85.333v83.2H341.333V64H256v83.2h-42.667c-47.36 0-84.906 37.44-84.906 83.2L128 812.8c0 45.76 37.973 83.2 85.333 83.2h597.334C857.6 896 896 858.56 896 812.8V230.4c0-45.76-38.4-83.2-85.333-83.2zm0 665.6H213.333V355.2h597.334v457.6zm-512-374.4H512v208H298.667v-208z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important;
                            width: 24px;
                            height: 24px;
                        }
                    }
                    .address {
                        display: flex;
                        flex-direction: row;
                        .icon_location {
                            background: url("data:image/svg+xml,%3Csvg width='1024' height='1024' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M500.136 64c-94.976 0-189.952 36.224-262.4 108.736-145.024 144.896-145.024 379.84 0 524.736L500.136 960l262.4-262.528c145.088-145.024 145.088-379.968 0-524.736C690.152 100.224 595.112 64 500.136 64zm0 512c-35.328 0-67.328-14.4-90.496-37.504-23.168-23.104-37.504-55.104-37.504-90.496 0-70.72 57.28-128 128-128s128 57.28 128 128c0 35.392-14.4 67.392-37.504 90.496S535.464 576 500.136 576z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E") no-repeat center/100% !important;
                            width: 24px;
                            height: 24px;
                        }
                    }
                    .ph-H-Medium-inverse {
                        margin-left: 16px;
                        font-size: 16px;
                        color: rgba(255,255,255,.9);
                    }
                }
            }
        }
        .industry-activity-detail-desc {
            height: auto;
            width: 640px;
            background: 0 0;
            padding: 104px 0 64px;
            position: relative;
            align-items: center;
            display: flex;
            flex-direction: column;
            .industry-activity-detail-img {
                height: auto;
                width: auto;
                background: 0 0;
                position: absolute;
                top: -40px;
                object-fit: cover;
            }
            .ph-H-Large_2 {
                margin-bottom: 32px!important;
                font-size: 24px;
                color: #2D334D;
                align-self: flex-start;
                display: flex;
            }
            .ph-body-medium {
                white-space: pre-line;
                margin-bottom: 32px!important;
                font-size: 16px;
                color: #747789;
                display: flex;
            }
        }
        .main-flex-start {
            display: flex;
            height: auto;
            width: auto;
            background: 0 0;
            display: flex;
            padding: 0;
            .line-img {
                object-fit: cover;
                margin-bottom: 32px!important;
            }
            .ph-H-Large_2 {
                font-size: 24px;
                margin-top: 32px;
                margin-bottom: 40px;
                color: #2D334D;
            }
            .line-img-speaker {
                margin-top: 32px;
            }
            .line-img-gallery {
                margin-bottom: 0px !important;
            }
            .mb-64 {
                margin-bottom: 64px !important;
            }
        }
        .industry-activity-detail-speaker-container {
            height: auto;
            width: 1200px;
            background: 0 0;
            padding: 0 100px;
            display: flex;
            flex-direction: column;
            .self-cross-flex-end {
                align-self: flex-end;
            }
            .self-cross-flex-start {
                align-self: flex-start;
            }
            .industry-activity-detail-speaker {
                height: auto;
                width: auto;
                margin-bottom: 64px;
                background: 0 0;
                display: flex;
                .speaker-info-left {
                    height: auto;
                    width: 156px;
                    margin-right: 62px;
                    background: 0 0;
                    position: relative;
                    align-items: center;
                    margin-top: 16px;
                    display: flex;
                    flex-direction: column;
                    .pharbers-speaker-bg {
                        height: 281px;
                        width: 281px;
                        background: #F5DD24;
                        position: absolute;
                        left: 34px;
                        opacity: .1;
                        border-radius: 50%;
                        box-shadow: 0 7px 9px 0 rgba(255, 201, 0, 0.49);
                        z-index: -1;
                        top: -16px;
                    }
                    .pharbers-speaker-avatar {
                        height: 156px;
                        width: 156px;
                        background: 0 0;
                        border-radius: 50%;
                    }
                    .ph-H-Medium {
                        margin-top: 24px;
                        margin-bottom: 8px;
                        font-size: 16px;
                        color: #2D334D!important;
                        font-weight: 700;
                    }
                }
                .speaker-info-right {
                    display: flex;
                    flex-direction: column;
                    .quotation-marks-img {
                        height: 48px;
                        width: 58px;
                        background: 0 0;
                        object-fit: cover;
                    }
                    .activity-speaker-content {
                        width: 420px;
                    }
                    .ph-H-Large_brand {
                        padding-left: 16px;
                        margin-bottom: 24px;
                        font-size: 24px;
                        color: #F5C924;
                    }
                    .ph-body-small {
                        padding-left: 16px;
                        font-size: 14px;
                        color: #747789;
                    }
                }
            }
        }
        @media (max-width: 1200px) and (min-width: 992px) {
            .industry-activity-detail-speaker-container {
                width: 100% !important;
                padding: 0 24px !important;


                .industry-activity-detail-speaker .speaker-info-left {
                    margin-right: 24px !important;
                }
                .self-cross-flex-end {
                    align-self: flex-start;
                }
                .activity-speaker-content {
                    width: 100% !important;
                }
            }
        }
        @media (max-width: 992px) and (min-width: 769px) {
            .industry-activity-detail-header {
                padding: 0px 60px !important;
                height: 800px !important;

                .above-data-detail-header-img, .industry-activity-detail-header-img {
                    height: 800px !important;
                }
                .header-img-mask {
                    height: 800px !important;
                }
                .header-desc-with {
                    width: 100% !important;
                }
            }
            .industry-activity-detail-desc {
                width: 100% !important;
                padding: 100px 16% !important;
            }
            .industry-activity-detail-speaker-container {
                width: 100% !important;
                padding: 0 24px !important;

                .industry-activity-detail-speaker .speaker-info-left {
                    margin-right: 24px !important;
                }
                .activity-speaker-content {
                    width: 100% !important;
                }
            }
        }
        @media (max-width: 768px) and (min-width: 550px) {
            .industry-activity-detail-header {
                padding: 0px 40px !important;
                height: 800px !important;
                .above-data-detail-header-img, .industry-activity-detail-header-img {
                    height: 800px !important;
                }
                .header-img-mask {
                    height: 800px !important;
                }
                .header-desc-with {
                    width: 100% !important;
                }
            }
            .industry-activity-detail-desc {
                width: 100% !important;
                padding: 100px 40px !important;
            }
            .industry-activity-detail-speaker-container {
                width: 100% !important;
                padding: 0 24px !important;

                .industry-activity-detail-speaker .speaker-info-left {
                    margin-right: 24px !important;
                }
                .activity-speaker-content {
                    width: 100% !important;
                }
            }
        }
        @media (max-width: 549px), (width: 549px) {
            .industry-activity-detail-header {
                padding: 0px 24px !important;
                height: 800px !important;

                .above-data-detail-header-img, .industry-activity-detail-header-img {
                    height: 800px !important;
                }
                .header-img-mask {
                    height: 800px !important;
                }
                .header-desc-with {
                    width: 100% !important;
                }
            }
            .industry-activity-detail-desc {
                width: 100% !important;
                padding: 100px 24px !important;
            }
            .industry-activity-detail-speaker-container {
                width: 100% !important;
                padding: 0 24px !important;

                .industry-activity-detail-speaker {
                    .speaker-info-left {
                        margin-right: 24px !important;
                    } 
                    .activity-speaker-content {
                        width: 100% !important;
                    }
                    .ph-body-small {
                        display: none;
                    }
                }
            }
        }
    }
</style>
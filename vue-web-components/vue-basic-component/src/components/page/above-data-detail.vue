<template>
    <div class="bp-above-data-detail">
        <!-- eventList: {{allData.eventList}}
        data: {{allData.data}}
        participantList: {{allData.participantList}}
        galleryShow: {{allData.galleryShow}}
        galleryList: {{allData.galleryList}}
        imageList: {{allData.imageList}}
        participantListAll: {{allData.participantListAll}} -->
        <div class="above-data-detail-header" v-for="(activity,index) in allData.data" :key="index + '1'">
            <bpImg class="above-data-detail-header-img" :src="imgPath(activity.gallery, 'cover')"></bpImg>
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
            <div class="above-data-detail-header-info-row">
                <div class="above-data-detail-header-divider">
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
        <div class="above-data-detail-desc" v-for="(activity,index) in allData.data" :key="index + '2'">
            <bpImg :src="lineImg" class="above-data-connect-img"></bpImg>
            <bpText class="ph-H-Large_2">{{activity.contentTitle}}</bpText>
            <bpText class="ph-body-medium">{{activity.contentDesc}}</bpText>
        </div>
        <div class="main-flex-start">
            <bpImg class="line-img" :src="lineImg"></bpImg>
        </div>
        <div class="main-flex-start">
            <bpText class="ph-H-Large_2">{{translation_data.agenda}}</bpText>
        </div>
        <div class="agenda-container">
            <div class="main-center" v-for="(agenda,index) in allData.eventListAll" :key="index">
                <!-- translation_data.agendas -->
                <bpText class="ph-body-xsmall-tertiary">
                    {{transDate(agenda.eventList.startDate, 1)}}~{{transDate(agenda.eventList.endDate, 1)}}
                </bpText>
                <div class="main-flex-start">
                    <div class="agenda-dot">
                    </div>
                </div>
                <div class="agenda-text-box">
                    <bpText class="ph-H-Medium">{{agenda.eventList.title}}</bpText>
                    <bpText class="ph-body-medium">{{agenda.speaker}}</bpText>
                </div>
            </div>
        </div>
        <div class="main-flex-start">
            <bpImg class="line-img line-img-speaker" :src="lineImg"></bpImg>
        </div>
        <div class="main-flex-start">
            <bpText class="ph-H-Large_2">{{translation_data.speaker}}</bpText>
        </div>
        <div class="speaker-img-container">
            <div class="speaker-img-box" v-for="(speaker,index) in allData.participantListAll" :key="index">
                <bpImg class="speaker-img" :src="speaker.image.path"></bpImg>
                <div class="speaker-img-info">
                    <bpText class="ph-H-Medium">{{speaker.participant.name}}</bpText>
                    <bpText class="ph-body-small">{{speaker.participant.occupation}}</bpText>
                    <bpText class="ph-body-small">{{speaker.participant.title}}</bpText>
                </div>
            </div>
        </div>
        <div class="main-flex-start">
            <bpImg class="line-img line-img-gallery" :src="lineImg"></bpImg>
        </div>
        <div class="gallery-text-container">
            <bpText class="ph-H-Large_2">{{translation_data.gallery}}</bpText>
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
            headerImg: `${staticFilePath}` + "/photo_events_abovedata_2020-01-09_00005.jpg",
            lineImg: `${staticFilePath}` + "/img_connect_line.svg",
            head: `${staticFilePath}` + "/avatar_cl.png",
            translation_basedata: {
                cn: {
                    home: "主页",
                    activityList: "活动资讯",
                    agenda: "会议议程",
                    speaker: "嘉宾讲者",
                    gallery: "精彩回顾"
                },
                en: {
                    home: "Home",
                    activityList: "Events",
                    agenda: "Agendas",
                    speaker: "Speakers",
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
.bp-above-data-detail {
    width: 100%;
    min-width: 375px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .above-data-detail-header {
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
        }
        .above-data-detail-header-info-row {
            display: flex;
            flex-direction: row;
            .above-data-detail-header-divider {
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
    .above-data-detail-desc {
        height: auto;
        width: 640px;
        background: 0 0;
        padding: 104px 0 64px;
        position: relative;
        align-items: center;
        display: flex;
        flex-direction: column;
        .above-data-connect-img {
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
    }
    .agenda-container {
        height: auto;
        width: 100%;
        background: 0 0;
        justify-content: center;
        display: flex;
        flex-direction: column;
        .main-center {
            display: flex;
            flex-direction: row;
            align-items: center!important;
            justify-content: center;
            .ph-body-xsmall-tertiary {
                line-height: 104px;
                width: 70px!important;
                margin-right: 32px;
                font-size: 12px;
                color: #A2A5B0;
            }
            .agenda-dot {
                height: 7px;
                width: 7px;
                background: #F5C924;
                border-radius: 50%;
                display: flex;
            }
            .agenda-text-box {
                height: 104px;
                width: 420px;
                margin: 16px 0 16px 64px;
                padding: 0 24px;
                background: rgba(22,28,57,.02);
                border-left: 1px solid #F5C924;
                justify-content: center;
                display: flex;
                flex-direction: column;
                .ph-H-Medium {
                    font-size: 16px;
                    color: #2D334D!important;
                    margin-bottom: 8px;
                    font-weight: 700;
                }
                .ph-body-medium {
                    font-size: 16px;
                    color: #747789;
                }
            }
        }
    }
    .speaker-img-container {
        height: auto;
        width: 848px;
        background: 0 0;
        justify-content: space-between;
        flex-wrap: wrap;
        display: flex;
        flex-direction: row;
        .speaker-img-box {
            height: auto;
            width: 349px;
            margin-bottom: 100px;
            background: 0 0;
            display: flex;
            flex-direction: row;
            .speaker-img {
                height: 200px;
                width: 200px;
                margin-right: 48px;
                background: 0 0;
                box-shadow: 8px 8px 0 0 #161c39, 14px 14px 12px 0 rgba(22, 28, 57,0.22);
            }
            .speaker-img-info {
                height: auto;
                background: 0 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                width: auto;
                max-width: 100px;
                .ph-H-Medium {
                    margin-bottom: 8px;
                    font-size: 16px;
                    color: #2D334D!important;
                    font-weight: 700;
                }
                .ph-body-small {
                    font-size: 14px;
                    color: #747789;
                }
            }
        }
    }
    .gallery-text-container {
        height: auto;   
        width: auto;
        background: 0 0;
        margin: 64px 0;
        .ph-H-Large_2 {
            font-size: 24px;
            margin-top: 32px;
            margin-bottom: 40px;
            color: #2D334D;
        }
    }

    @media (max-width: 992px) and (min-width: 769px) {
        .above-data-detail-header {
            padding: 0 60px !important;
        }
        .above-data-detail-desc {
            width: 100% !important;
            padding: 100px 18% !important;
        }

        .agenda-container {
            padding: 0 16px;
            
            .agenda-text-box {
                height: auto !important;
                padding: 24px !important;
                margin-left: 24px !important;
                margin-right: 0 !important;
            }
        }
    }

    @media (max-width: 768px) and (min-width: 550px) {
        .above-data-detail-header {
            padding: 0 40px !important;
        }
        .above-data-detail-desc {
            width: 100% !important;
            padding: 100px 40px !important;
        }
        .speaker-img-container {
            width: 100% !important;
            padding: 0 16px !important;
            .speaker-img-box {
                width: 50% !important;
                margin-bottom: 40px !important;
                flex-wrap: wrap;
                align-content: center !important;
                flex-direction: column !important;
                .speaker-img {
                    width: 115px !important;
                    height: 115px !important;
                    margin-bottom: 24px !important;
                    margin-right: 0 !important;
                }
            }
        }
        .agenda-container {
            padding: 0 16px;
            
            .agenda-text-box {
                height: auto !important;
                padding: 24px !important;
                margin-left: 24px !important;
                margin-right: 0 !important;
            }

            .agenda-time-line {
                height: 0 !important;
            }
        }
    }
    @media (max-width: 549px), (width: 549px)  {
        .above-data-detail-header {
            padding: 0 24px !important;
        }
        .above-data-detail-desc {
            width: 100% !important;
            padding: 100px 24px !important;
        }
        .speaker-img-container {
            width: 100% !important;
            padding: 0 16px !important;
            .speaker-img-box {
                width: 50% !important;
                margin-bottom: 40px !important;
                flex-wrap: wrap;
                align-content: center !important;
                flex-direction: column !important;
                .speaker-img {
                    width: 115px !important;
                    height: 115px !important;
                    margin-bottom: 24px !important;
                    margin-right: 0 !important;
                }
            }
        }
        .agenda-container {
            padding: 0 16px;
            
            .agenda-text-box {
                height: auto !important;
                padding: 24px !important;
                margin-left: 24px !important;
                margin-right: 0 !important;
            }

            .agenda-time-line {
                height: 0 !important;
            }
        }
    }
}
</style>
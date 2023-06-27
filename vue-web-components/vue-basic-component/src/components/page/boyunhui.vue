<template>
    <div class="bp-boyunhui">
        <div v-for="(activity,index) in allData.activitys" :key="index + '1'" class="boyunhui-header">
            <bp-img class="boyunhui-header-img" :src="imgPath(activity.gallery, 'cover')"></bp-img>
            <bp-text class="ph-body-small-inverse top-breadcrumb">
                <span @click="linkToPage('home')">{{translation_data.home}}</span>
                <span class="mr-0 ml-0">/</span>
                <span @click="linkToPage('activity-list')">{{translation_data.events}}</span>
                <span class="mr-0 ml-0">/</span>
                <span>{{activity.title}}</span>
            </bp-text>
            <div class="header-img-mask"></div>
            <bp-text class="ph-H-xLarge-inverse header-title">{{activity.title}}</bp-text>
            <bp-text class="ph-H-Large-2-inverse header-subtitle">{{activity.subTitle}}</bp-text>

            <div class="activity-position-date-container">
                <div class="activity-date">
                    <div class="icon_date"></div>
                    <bp-text class="ph-H-Medium-inverse ml-3">{{transDate(activity.startDate)}}</bp-text>
                </div>

                <div class="activity-position">
                    <div class="icon_location"></div>
                    <bp-text class="ph-H-Medium-inverse ml-3">{{activity.location}}</bp-text>
                </div>
            </div>
        </div>

        <div id="position-introduction" ref="position-introduction"></div>

        <div class="boyunhui-tab">
            <div class="activity-tabs">
                <div class="activity-tab" @click="curTabSelect(0)">
                    <span :class="curTab === 0 ? 'active' : ''">{{translation_data.introduction}}</span>
                </div>

                <div class="activity-tab" @click="curTabSelect(1)">
                    <span :class="curTab === 1 ? 'active' : ''">{{translation_data.released}}</span>
                </div>

                <div class="activity-tab" @click="curTabSelect(2)">
                    <span :class="curTab === 2 ? 'active' : ''">{{translation_data.agendas}}</span>
                </div>

                <div class="activity-tab" @click="curTabSelect(3)">
                    <span :class="curTab === 3 ? 'active' : ''">{{translation_data.speakers}}</span>
                </div>

                <div class="activity-tab" @click="curTabSelect(4)">
                    <span :class="curTab === 4 ? 'active' : ''">{{translation_data.organization}}</span>
                </div>

                <div class="activity-tab" @click="curTabSelect(5)">
                    <span :class="curTab === 5 ? 'active' : ''">{{translation_data.gallery}}</span>
                </div>
            </div>
        </div>

        <div v-for="(activity,index) in allData.activitys" :key="index+'2'" class="boyunhui-desc">
            <bp-text class="ph-H-Large_2 mb-5">{{activity.contentTitle}}</bp-text>
            <bp-text class="ph-body-medium">{{activity.contentDesc}}</bp-text>
        </div>

        <div ref="position-bluebook">
            <bp-img :src="img1" id="position-bluebook"></bp-img>
        </div>

        <bp-text class="ph-H-Large_2">{{translation_data.blueBook}}</bp-text>
        <div v-for="(report,index) in allData.reportList" :key="index+'3'" class="active-report-container">
            <bp-img :src="imgPath(report.cover.get('path'))" class="report-img img-media-large"></bp-img>
            <div class="report-img-mask"></div>
            <div class="report-text">
                <div class="little-media-report-img">
                    <bp-img :src="imgPath(report.cover.get('path'))" class="report-img"></bp-img>
                    <div class="report-img-mask-2"></div>
                </div>
                <div class="book-center">
                    <bp-text class="report-name ph-H-Medium">{{report.title}}</bp-text>
                    <bp-text class="report-time ph-body-xsmall">{{translation_data.date}} {{transDate(report.date)}} </bp-text>
                    <bp-button @click="linkToPage('download-report', allData.index)" class="report-download-button" type='report-download-2' :text="translation_data.downloadReport"></bp-button>
                </div>
            </div>
        </div>

        <div ref="position-meeting">
            <bp-img :src="img2" id="position-meeting"></bp-img>
        </div>
        <bp-text class="ph-H-Large_2">{{translation_data.agenda}}</bp-text>
        <div class="agenda-containers">
            <div class="date-tabs">
                <div class="activity-tabs">
                    <div v-for="(day, index) in allData.activityDays" :key="index" :class="dateTab === index ? 'activity-tab active' : 'activity-tab'" @click="dateTab = index">{{day}}</div>
                </div>
            </div>

            <div class="boyunhui-form">
                <div class="moderate-width">
                    <template v-for="agendas in zone">
                        <!-- <template v-if="dateTab"> -->
                            <div class="boyunhui-form-subtitle mt-6">
                                <bp-text class="official-yellow-line-inverse font-weight-bold">{{agendas.title}}</bp-text>
                                <bp-text v-if="agendas.host" class="official-yellow-line-inverse-host">{{translation_data.host}}:{{agendas.host.name}} - {{agendas.host.occupation}}</bp-text>
                            </div>
                            <div class="border-dashed-container">
                                <div v-for="(agenda,index) in agendas.events" :key="index" class="form-one-line">
                                    <bp-text class="agenda-time agenda-time-marginR">{{transDateHour(agenda.startDate)}}-{{transDateHour(agenda.endDate)}}</bp-text>
                                    <div class="different-style" v-if="!agenda.speakerArr">
                                        <bp-text class="agenda-title">{{agenda.title}}</bp-text>
                                        <bp-text v-if="agenda.speaker" class="agenda-speaker">{{agenda.speaker.name}}</bp-text>
                                        <bp-text v-if="agenda.speaker" class="agenda-desc">{{agenda.speaker.occupation}}</bp-text>
                                    </div>
                                    <div class="different-style" v-if="agenda.speakerArr">
                                        <bp-text class="agenda-title">{{agenda.title}}</bp-text>
                                        <div class="speakersArea">
                                            <div v-for="(item,index) in agenda.speakerArr" class="speakerItem" :key="'speaker' + index">
                                                <bp-text v-if="item.name" class="agenda-speaker">
                                                    <bp-text v-if="index == 0" class="speakerTitle">{{translation_data.host}}:</bp-text>
                                                    <bp-text v-if="index == 1" class="speakerTitle">{{translation_data.guests}}:</bp-text>
                                                    <bp-text v-if="index != 0 && index != 1" class="speakerTitle"></bp-text>
                                                    {{item.name}}
                                                </bp-text>
                                                <bp-text v-if="item.name" class="agenda-desc">{{item.occupation}}</bp-text>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
<!--                         
                        <template v-else>
                            <div class="boyunhui-form-subtitle mt-6">
                                <bp-text class="official-yellow-line-inverse font-weight-bold">{{agendas.title}}</bp-text>
                            </div>
                        </template> -->
                    <!-- </template> -->
                </div>
            </div>
        </div>

        <div ref="position-speaker">
            <bp-img :src="img3" id="position-speaker"></bp-img>
        </div>
        <bp-text class="ph-H-Large_2">{{translation_data.speaker}}</bp-text>
        <div class="speaker-img-newcontainer">
            <template v-for="speaker in allData.participantsImageList">
                <div v-if="speaker.avatar.get('path')" class="speaker-img-newbox">
                    <div class="same-width">
                        <div class="speaker-img-black"></div>
                        <bp-img :src="imgPath(speaker.avatar.get('path'))" class="speaker-img"></bp-img>
                        <bp-text class="ph-H-Medium mb-2">{{speaker.name}}</bp-text>
                        <bp-text class="ph-body-small">{{speaker.occupation}}</bp-text>
                        <bp-text class="ph-body-small">{{speaker.title}}</bp-text>
                    </div>
                </div>
            </template>
        </div>

        <div ref="position-cooperation">
            <bp-img :src="img4" id="position-cooperation"></bp-img>
        </div>
        <div class="gallery-text-container">
            <bp-text class="ph-H-Large_2">{{translation_data.partner}}</bp-text>
            <bp-text v-if="allData.cooperationListA && allData.cooperationListA.length > 0" class="ph-body-medium">{{translation_data.guidanceUnit}}</bp-text>
            <div v-if="allData.cooperationListA && allData.cooperationListA.length > 0" class="guidanceUnit-img-container">
                <bp-img v-for="(partner, index) in allData.cooperationListA" :key="index" :src="imgPath(partner.logo.get('path'))" class="cooperator-img"></bp-img>
            </div>
            <bp-text class="ph-body-medium mt-7">{{translation_data.sponsor}}</bp-text>
            <div class="guidanceUnit-img-container">
                <bp-img v-for="(partner, index) in allData.cooperationListB" :key="index" :src="imgPath(partner.logo.get('path'))" class="cooperator-img"></bp-img>
            </div>
        </div>

        <div ref="position-gallery">
            <bp-img :src="img5" id="position-gallery"></bp-img>
        </div>

        <bp-text class="ph-H-Large_2">{{translation_data.gallery}}</bp-text>
        <bpPhoto :galleryShow="allData.galleryShow[0]" :galleryList="allData.galleryList" class="mt-7"></bpPhoto>
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
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    galleryShow: []
                }
            }
        }
    },
    data() {
        return {
            language: '中文',
            curTab: 0,
            dateTab: 0,
            img1: `${staticFilePath}` + "/img_connect_line.svg",
            img2: `${staticFilePath}` + "/img_connect_line.svg",
            img3: `${staticFilePath}` + "/img_connect_line.svg",
            img4: `${staticFilePath}` + "/img_connect_line.svg",
            img5: `${staticFilePath}` + "/img_connect_line.svg",
            translation_basedata: {
                cn: {
                    home: "主页",
                    events: "活动资讯",
                    introduction: "会议简介",
                    released: "蓝皮书",
                    agendas: "会议议程",
                    speakers: "嘉宾讲者",
                    organization: "合作单位",
                    gallery: "精彩回顾",
                    blueBook: "蓝皮书",
                    date: "发布时间",
                    downloadReport: "获取报告",
                    agenda: "会议议程",
                    speaker: "嘉宾讲者",
                    partner: "合作单位",
                    guidanceUnit: "指导单位",
                    sponsor: "主办单位",
                    host: "主持人",
                    guests: "嘉宾"
                },
                en: {
                    home: "Home",
                    events: "Events",
                    introduction: "Introduction",
                    released: "Released",
                    agendas: "Agendas",
                    speakers: "Speakers",
                    organization: "Sponsor",
                    gallery: "Gallery",
                    blueBook: "Released",
                    date: "Release on",
                    downloadReport: "DOWNLOAD",
                    agenda: "Agenda",
                    speaker: "Speaker",
                    partner: "Sponsor",
                    guidanceUnit: "Guide by",
                    sponsor: "Host by",
                    host: "Presenter",
                    guests: "Guests"
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
        },
        zone: function(){ 
            if(this.allData.activitys) {
                let firstDate = ''
                let lastDate = ''
                //标题数组
                let hosts = this.allData.hostList.filter(x => x.name != null)
                
                let zoneList = this.allData.activitys[0].agendas.filter((x,index) => {
                    if(index == 0) {
                        let date = x.subTitle.slice(0,4)
                        if(date == '2021') {
                            firstDate = '2021-04-15'
                            lastDate = '2021-04-16'
                        } else if(date == '2020') {
                            firstDate = '2020-06-04'
                            lastDate = '2020-06-05'
                        }
                    }
                    if(this.dateTab){
                        return x.subTitle === lastDate
                    } else{
                        return x.subTitle === firstDate
                    }
                })
                let agendas = []
                zoneList.forEach((zone,i) => {
                    agendas[i] = []
                    // 标题下的event数组
                    zone.agendas.filter((agenda,x) => {
                        if (agenda.title) {
                            if(agenda.speakers.length > 1) {
                                agenda['speakerArr'] = []
                                agenda.speakers.filter(speaker => {
                                    agenda['speakerArr'].push(speaker)
                                })
                            } else {
                                agenda.speakers.filter(speaker => {
                                    agenda['speaker'] = speaker
                                })
                            }
                            //根据开始时间对event进行排序
                            if(agendas[i][x-1] && agendas[i][x-1].startDate < agenda.startDate) {
                                agendas[i].push(agenda)
                            } else {
                                agendas[i].unshift(agenda)
                            }
                        }
                    })
                    for(let x = 0; x < hosts.length; x++) {
                        hosts[x].zone.then(a => {
                            if(a.id == zone.id) {
                                zone['host'] = hosts[x]
                                this.$forceUpdate();
                            }
                        })
                    }
                    zoneList[i]['events'] = agendas[i]
                })
                return zoneList
            }
        }
    },
    created() {
        window.addEventListener('beforeunload', e => {
            window.scrollTo(0,0)
        });
        let lang = window.localStorage.getItem('lang')
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
    },
    mounted() {
        const that = this;
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
        },
        transDateHour(param) {
            let date = new Date(param)

            let hour = date.getUTCHours() < 10 ? "0" + date.getUTCHours() : date.getUTCHours()
            let minute = date.getUTCMinutes() < 10 ? "0" + date.getUTCMinutes() : date.getUTCMinutes()
            return hour + ":" + minute
        },
        transDate(param) {
            let date = new Date(param)

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
        curTabSelect(index) {
            switch(index){
            case 0:
                this.curTab = 0
                this.$refs['position-introduction'].scrollIntoView()
                break;
            case 1:
                this.curTab = 1
                this.$refs['position-bluebook'].scrollIntoView()
                break;
            case 2:
                this.curTab = 2
                this.$refs['position-meeting'].scrollIntoView()
                break;    
            case 3:
                this.curTab = 3
                this.$refs['position-speaker'].scrollIntoView()
                break;
            case 4:
                this.curTab = 4
                this.$refs['position-cooperation'].scrollIntoView()
                break;
            case 5:
                this.curTab = 5
                this.$refs['position-gallery'].scrollIntoView()
                break;
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

    .mr-0 {
        margin-right: 2px;
    }

    .ml-0 {
        margin-left: 2px;
    }

    .ml-3 {
        margin-left: 16px;
    }

    .mb-2 {
        margin-bottom: 8px;
    }

    .mb-5 {
        margin-bottom: 32px;
    }

    .mt-6 {
        margin-top: 40px;
    }

    .mt-7 {
        margin-top: 64px;
    }

    .ph-body-small {
        font-size: 14px;
        color: #747789;
    }

    .ph-body-small-inverse {
        opacity: .7;
        font-size: 14px;
        color: #FFF !important;
    }

    .ph-H-xLarge-inverse {
        font-size: 40px;
        color: rgba(255,255,255,.9) !important;
    }

    .ph-H-Large-2-inverse {
        font-size: 24px;
        color: rgba(255,255,255,.9);
    }
    .ph-H-Medium-inverse {
        font-size: 16px;
        color: rgba(255,255,255,.9);
    }

    .ph-H-Large_2 {
        font-size: 24px;
        color: #2D334D;
    }

    .ph-body-medium {
        font-size: 16px;
        color: #747789;
    }

    .ph-body-xsmall {
        font-size: 12px;
        color: #747789;
    }

    .font-weight-bold {
        font-weight: 700;
    }
    
    .bp-boyunhui {
        width: 100%;
        min-width: 375px;
        display:flex;
        flex-direction:column;
        align-items:center;

        &::-webkit-scrollbar { 
            width: 0 !important;
            display: none;
        }
        -ms-overflow-style: none;

        .boyunhui-header {
            height: 600px;
            width: 100%;
            background: transparent;
            background-image: linear-gradient(rgba(22,28,57,0.5), rgba(22,28,57,0.5));
            padding: 0 100px;
            background-size: cover;
            display: flex;
            justify-content: center;
            flex-direction: column;
            position: relative;

            .boyunhui-header-img {
                height: 600px;
                width: 100%;
                position: absolute;
                z-index: -2;
                left: 0;
                object-fit: cover;
            }

            .top-breadcrumb {
                position: absolute;
                top: 104px;
                cursor: pointer;
            }

            .header-img-mask {
                height: 600px;
                width: 100%;
                position: absolute;
                z-index: -1;
                left: 0;
                background: rgba(22,28,57,0.5) !important;
            }

            .header-title {
                margin: 70px 0 16px;
            }

            .header-subtitle {
                width: 771px;
                margin: 8px 0 40px;
            }

            .activity-position-date-container {
                display: flex;
                flex-direction: column;
                padding-top: 38px;
                border-top: 1px solid rgba(255,255,255,0.2);
                width: fit-content;

                .activity-date {
                    margin-bottom: 16px;
                    display: flex;

                    .icon_date {
                        width: 24px;
                        height: 24px;
                        background: url("data:image/svg+xml,%3Csvg width='1024' height='1024' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M810.667 147.2H768V64h-85.333v83.2H341.333V64H256v83.2h-42.667c-47.36 0-84.906 37.44-84.906 83.2L128 812.8c0 45.76 37.973 83.2 85.333 83.2h597.334C857.6 896 896 858.56 896 812.8V230.4c0-45.76-38.4-83.2-85.333-83.2zm0 665.6H213.333V355.2h597.334v457.6zm-512-374.4H512v208H298.667v-208z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E") center/100% no-repeat!important;
                    }
                }
                
                .activity-position {
                    margin-bottom: 32px;
                    display: flex;

                    .icon_location {
                        width: 24px;
                        height: 24px;
                        background: url("data:image/svg+xml,%3Csvg width='1024' height='1024' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M500.136 64c-94.976 0-189.952 36.224-262.4 108.736-145.024 144.896-145.024 379.84 0 524.736L500.136 960l262.4-262.528c145.088-145.024 145.088-379.968 0-524.736C690.152 100.224 595.112 64 500.136 64zm0 512c-35.328 0-67.328-14.4-90.496-37.504-23.168-23.104-37.504-55.104-37.504-90.496 0-70.72 57.28-128 128-128s128 57.28 128 128c0 35.392-14.4 67.392-37.504 90.496S535.464 576 500.136 576z' fill='%23FFF' fill-rule='evenodd'/%3E%3C/svg%3E") center/100% no-repeat!important;
                    }
                }
            }
        }
        
        .boyunhui-tab {
            width: 100vw;
            height: 48px;
            padding-left: 100px;
            margin-top: 64px;
            margin-bottom: 41px;
            display: flex;
            // justify-content: flex-start;
            font-size: 16px;
            color: #2D334D;
            letter-spacing: 0.4px;
            font-weight: bold;
            position: sticky;
            top: 80px;
            z-index: 999;
            background-color: #fff;

            .activity-tabs {
                display: flex;
                cursor: pointer;
                border-bottom: 2px solid rgba(22,28,57,0.1);

                .activity-tab {
                    margin-right: 24px;
                    white-space: nowrap;
                    line-height: 40px;
                    flex: 1;
                    display: flex;

                    &:nth-last-of-type(1) {
                        margin-right: 0;
                    }
                    transform: translateY(2px);
                    .active {
                        border-bottom: 2px solid rgba(245,201,36,1);
                        color: rgba(245,201,36,1);
                    }
                }
                
            }
        }

        .boyunhui-desc {
            height: auto;
            width: 640px;
            background: transparent;
            position: relative;
            white-space: pre-line;
            display: flex;
            flex-direction: column;
        }

        #position-bluebook {
            margin: 64px 0;
        }

        .active-report-container {
            width: 680px;
            height: 190px;
            display: flex;
            justify-content: space-between;
            background-image: linear-gradient(148deg, rgba(61,86,210,0.05) 4%, rgba(102,113,169,0.14) 100%);
            padding: 32px 40px;
            margin-top: 109px;
            margin-bottom: 65px;
            position: relative;

            .report-img {
                width: 140px;
                height: 200px;
                position: relative;
                top: -90px;
                border-radius: 2px;
            }

            .report-img-mask {
                width: 126px;
                height: 200px;
                position: absolute;
                top: -58px;
                border-radius: 2px;
                z-index: -1;
                background: #747789;
                box-shadow: 0 5px 6px 0 rgba(22,28,57,0.36);
                border-radius: 2px;
                -webkit-transform-origin:0 200px;
                -moz-transform-origin:0 200px;
                -o-transform-origin:0 200px;
                -webkit-transform:rotate(4deg);
                -moz-transform:rotate(4deg);
                -o-transform:rotate(4deg);
            }

            .report-text {
                width: 375px;
                display: flex;
                flex-direction: column;

                .little-media-report-img {
                    display: none;
                }

                .book-center {
                    display: flex;
                    flex-direction: column;

                    .report-name {
                        margin-bottom: 16px;
                    }

                    .report-time {
                        margin-bottom: 16px;
                    }

                    .button-report-download-2 {
                        width: 137px;
                        height: 40px;
                        text-align: center;
                        display: inline-block;
                        font-size: 14px;
                        letter-spacing: 1px;
                        opacity: .9;
                        background: #161C39;
                        border-radius: 2px;
                        color: #fff;
                        border: none;
                        vertical-align: middle;
                    }
                }
            }            
        }

        #position-meeting {
            margin-bottom: 64px;
        }

        .agenda-containers  {
            height: auto;
            width: 100%; 
            background: transparent;
            display: flex;
            flex-direction: column;
            justify-content: center;
            margin-top: 40px;

            .date-tabs {
                display: flex;
                justify-content: center;
                width: 100%;
                height: 48px;
                font-size: 16px;
                color: #2D334D;
                letter-spacing: 0.4px;

                .activity-tabs {
                    width: 83%;
                    display: flex;
                    cursor: pointer;

                    .activity-tab {
                        padding-bottom: 18px;
                        border-bottom: 2px solid rgba(22,28,57,0.1);
                        line-height: 40px;
                        flex: 1;
                        justify-content: center;
                        display: flex;
                    }

                    .active {
                        border-bottom: 2px solid rgba(245,201,36,1);
                        color: rgba(245,201,36,1);
                    }
                }
            }

            .boyunhui-form {
                display: flex;
                justify-content: center;

                .moderate-width {
                    display: flex;
                    flex-direction: column;
                    width: 83%;

                    .boyunhui-form-subtitle {
                        .official-yellow-line-inverse {
                            height: auto;
                            width: auto;
                            background: linear-gradient(45deg, rgba(255,221,77,0.5) 0, rgba(255,221,77,0.5) 5%, transparent 5%, transparent 50%, rgba(255,221,77,0.5) 50%, rgba(255,221,77,0.5) 55%, transparent 55%, transparent) !important;
                            background-size: 10px 10px !important;
                            border: none;
                            font-size: 16px;
                            color: #2D334D;
                            letter-spacing: 0.4px;
                            margin-bottom: 11px;
                        }
                        .official-yellow-line-inverse-host {
                            font-family: PingFangSC-Medium;
                            font-size: 12px;
                            color: #454A61;
                            letter-spacing: 1px;
                            font-weight: 500;
                            margin-left: 20px;
                        }
                    }

                    .border-dashed-container {
                        display: flex;
                        flex-direction: column;

                        .form-one-line {
                            display: flex;
                            align-items: center;
                            min-height: 70px;
                            border-bottom: 1px dashed rgba(22, 28, 57, .12);
                            padding: 22px 0;
                            &:last-child {
                                border-bottom: none;
                            }

                            .agenda-time {
                                width: 81px;
                                font-size: 12px;
                                color: #A2A5B0;
                                letter-spacing: .4px;
                                display: flex;
                                align-items: center;
                                margin-right: 7vw;
                            }

                            .different-style {
                                display: flex;
                                flex-direction: row;
                                flex-grow: 1;
                                .speakersArea {
                                    display: flex;
                                    flex-direction: column;
                                    .speakerItem {
                                        display: flex;
                                        flex-direction: row;
                                    }
                                }
                                .agenda-title {
                                    width: 299px;
                                    font-size: 16px;
                                    color: #2D334D;
                                    letter-spacing: .4px;
                                    display: flex;
                                    align-items: center;
                                    font-weight: 700;
                                    margin-right: 5vw;
                                }

                                .agenda-speaker {
                                    width: 180px;
                                    font-size: 16px;
                                    color: #747789;
                                    letter-spacing: .4px;
                                    display: flex;
                                    align-items: center;
                                    margin-right: 10vw;
                                    .speakerTitle {
                                        width: 80px;
                                    }
                                }

                                .agenda-desc {
                                    width: 207px;
                                    font-size: 16px;
                                    color: #747789;
                                    letter-spacing: .4px;
                                    display: flex;
                                    align-items: center;
                                }
                            }                            
                        }
                    }
                }
            }
        }

        #position-speaker {
            margin: 64px 0;
        }

        .speaker-img-newcontainer {
            height: auto;
            width: 952px;
            background: transparent;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-top: 40px;

            .speaker-img-newbox {
                display: flex;
                flex-direction: column;
                min-height: 246px;
                width: 238px;
                margin-bottom: 40px;
                background: 0 0;

                .same-width {
                    display: flex;
                    flex-direction: column;
                    width: 160px;

                    .speaker-img-black {
                        height: 160px;
                        width: 160px;
                        display: flex;
                        background-image: linear-gradient(145deg,#F9FAFE 0,#E5E7F0 100%);
                        box-shadow: 0 2px 6px 0 rgba(22,28,57,0.12);
                        border-radius: 2px;
                        margin-bottom: 16px;
                        position: absolute;
                        z-index: -1;
                        overflow: hidden;
                    }

                    .speaker-img {
                        height: 160px;
                        width: 160px;
                        background: 0 0;
                        border-radius: 2px;
                        margin-bottom: 16px;
                        overflow: hidden;
                    }
                }
            }
        }

        #position-cooperation {
            margin: 64px 0;
        }

        .gallery-text-container {
            height: auto;
            width: auto;
            display: flex;
            flex-direction: column;
            background: 0 0;
            align-items: center;

            .guidanceUnit-img-container {
                height: auto;
                width: auto;
                background: 0 0;
                margin-top: 24px;
                display: flex;
                justify-content: center;
                align-items: center;

                .cooperator-img {
                    max-height: 58px;
                    margin-right: 81px;
                    object-fit: contain;

                    &:last-of-type {
                        margin-right: 0;
                    }
                }
            }
        }

        #position-gallery {
            margin: 40px 0 64px;
        }
    }

@media screen and (max-width: 480px) {
    .bp-boyunhui {
        .boyunhui-header {
            padding: 0 24px;
            overflow-x: hidden;
        }

        .boyunhui-tab {
            overflow: auto;
            padding-left: 0;
            margin-top: 40px;
            margin-bottom: 33px;
            justify-content: center;

            .activity-tabs {
                position: relative;
                transform: translateX(40px);

                .activity-tab {
                    margin-right: 10px;

                    &:nth-last-of-type(1) {
                        margin-right: 0;
                    }
                }
            }
        }

        .boyunhui-desc {
            height: auto;
            width: 90vw;
            background: transparent;
            position: relative;
            white-space: pre-line;
        }

        .active-report-container {
            width: 90%;
            height: 270px;
            background-image: linear-gradient(148deg,rgba(61,86,210,.05) 4%,rgba(102,113,169,.14) 100%);
            padding: 32px 40px;
            margin-top: 109px;
            margin-bottom: 65px;

            .img-media-large, .report-img-mask {
                display: none;
            }
            
            .report-text {
                width: 375px;

                .little-media-report-img {
                    display: flex;
                    justify-content: center;
                    .report-img {
                        width: 111px;
                        height: 158px;
                        position: relative;
                        top: -111px;
                        object-fit: cover;
                    }

                    .report-img-mask-2 {
                        display: inherit;
                        width: 100px;
                        height: 158px;
                        position: absolute;
                        top: -58px;
                        border-radius: 2px;
                        z-index: -1;
                        background: #747789;
                        box-shadow: 0 4px 5px 0 rgba(22,28,57,0.36);
                        border-radius: 1.6px;
                        -webkit-transform-origin:0 158px;
                        -moz-transform-origin:0 158px;
                        -o-transform-origin:0 158px;
                        -webkit-transform:rotate(4deg) translate(-6px,-20px);
                        -moz-transform:rotate(4deg) translate(-6px,-20px);
                        -o-transform:rotate(4deg) translate(-6px,-20px);
                    }
                }

                .book-center {
                    align-items: center;
                    margin-top: -81px;

                    .report-name, .report-time {
                        display: flex;
                        text-align: center;
                        justify-content: center;
                    }
                }
            }
        }

        .agenda-containers {
            width: 90%;

            .date-tabs {
                .activity-tabs {
                    width: 100%;
                }
            }

            .boyunhui-form .moderate-width {
                width: 100%;
                .border-dashed-container .form-one-line {
                    .agenda-time {
                        width: 75px;
                        margin-right: 5%;
                    }

                    .different-style {
                        flex-direction: column;

                        .agenda-title {
                            width: 279px;
                            margin-right: 0;
                            margin-bottom: 6px;
                        }

                        .agenda-speaker {
                            width: 100%;
                            margin-right: 8px;
                        }

                        .agenda-desc {
                            width: 100%;
                        }
                    }
                }
            }
        }

        .speaker-img-newcontainer {
            width: 90%;

            .speaker-img-newbox {
                width: 45%;

                .same-width {
                    width: 144px;

                    .speaker-img-black {
                        width: 160px;
                        height: 160px;
                    }
                }
            }
        }

        .gallery-text-container {
            .guidanceUnit-img-container {
                flex-direction: column;

                .cooperator-img {
                    max-height: 40px;
                    margin-right: 0;
                }
            }
        }
    }
}
</style>
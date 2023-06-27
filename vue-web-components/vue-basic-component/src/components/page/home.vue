<template>
    <div class="home-container">
        <link rel="stylesheet" href="https://components.hubadata.com/element-ui/element-ui.css">
        <div class="bp-home">
            <!-- truth -->
            <div class="truth-content-area">
                <div class="title">
                    <bpText class="ph-H-Display">{{translation_data.truthTitle}}</bpText>
                    <bpText class="ph-body-medium">{{translation_data.truthDes}}</bpText>
                </div>
                <bpImg :src="src" class="home-header-img"></bpImg>
            </div>
            <!-- Industry Insight -->
            <div class="content-active-area content-industry-area">
                <div class="active-line">
                    <div class="active-yellow-line"></div>
                </div>
                <bpText class="active-text">{{translation_data.IndustryInsightEvents}}</bpText>
                <bpCardArticle 
                    v-for="card in allData.articles"
                    :key="card.title"
                    @toArticlePage="linkToArticlePage"
                    :bgImgs="card.avatar"
                    :title="card.title"
                    :date="card.date"
                    :uri="card.uri"
                    :id="card.id"
                    :curIndex="card.curIndex"
                ></bpCardArticle>
                <div class="content-active-review-more-button">
                    <div class="show-more-button-container" @click="linkToPage('articles-list')">
                        <bpButton :text="translation_data.moreIndustryInsight" class="button-official-gray-line"></bpButton>
                        <bpImg class="active-button-go" :src="buttonGo"></bpImg>
                    </div>
                </div>
                <div class="content-active-bg-yellow"></div>
                <div class="content-active-bg-line-right"></div>
            </div>
            <!-- activity -->
            <div class="content-active-area">
                <div class="active-line">
                    <div class="active-yellow-line"></div>
                </div>
                <bpText class="active-text">{{translation_data.activeEvents}}</bpText>
                <bpCardActive 
                    v-for="card in activities"
                    :key="card.title"
                    @toActivityPage="linkToPage"
                    :bgImgs="card.gallery"
                    :logoImg="card.logo?card.logo.get('path'):''"
                    :title="card.title"
                    :date="card.startDate"
                    :city="card.city"
                    :type="card.activityType"
                    :id="card.id"
                    :curIndex="card.curIndex"
                ></bpCardActive>
                <div class="content-active-review-more-button">
                    <div class="show-more-button-container" @click="linkToPage('activity-list')">
                        <bpButton :text="translation_data.moreActivity" class="button-official-gray-line"></bpButton>
                        <bpImg class="active-button-go" :src="buttonGo"></bpImg>
                    </div>
                </div>
                <div class="content-active-bg-yellow"></div>
                <div class="content-active-bg-line-right"></div>
            </div>
            <!-- report -->
            <div class="report-download-container">
                <div v-for="report in allData.reports" :key="report.id" class="report-download">
                    <bpImg 
                        :src="reportLeftDown" class="report-download-left-corner"></bpImg>
                    <bpImg 
                        :src="reportRightDown" class="report-download-right-corner"></bpImg>
                    <div class="report-download-img-container">
                        
                        <bpImg 
                            :src="report.cover.get('path')" class="report-down-img"></bpImg>
                        <div class="report-down-img-mask"></div>
                    </div>
                    <div class="report-download-info">
                        <div class="report-right-head">
                            <bpText class="ph-H-small-theme">{{translation_data.reportThemeSmall}}</bpText>
                            <bpText class="ph-body-small">{{translation_data.reportBodySmall}}</bpText>
                        </div>
                        <div class="report-right-center">
                            <bpText class="ph-H-large-title">{{report.title}}</bpText>
                            <bpText class="pb-body-small-tertiary">{{transDate(report.date)}}</bpText>
                        </div>
                        <div class="show-more-button-container">
                            <bpButton :text="translation_data.reportButton" @click="linkToPage('download-report', 0)" class="report-down-button"></bpButton>
                            <div class="more-reports-button" @click="linkToPage('report-list')">
                                <div class="more-reports">
                                    <bpText>{{translation_data.moreReportsText}}</bpText>
                                    <bpImg class="more-reports-img" :src="showMoreButtonGo"></bpImg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- data-show -->
            <div class="data-show">
                <bpImg :src="reportConnectImg" class="report-connect-img"></bpImg>
                <bpText class="home-about-us-peoples">{{translation_data.dataShowAboutUs}}</bpText>
                <bpText class="ph-H-xLarge">{{translation_data.dataShowTitle}}</bpText>
                <div class="show-more-button-container"  @click="linkToPage('about-us')">
                    <bpButton :text="translation_data.showMoreButton" class="button-official-yellow-line-compact"></bpButton>
                    <bpImg :src="showMoreButtonGo" class="show-more-button-go"></bpImg>
                </div>
                <div class="data-show-text-part">
                    <bpText class="ph-body-medium_brand">{{translation_data.dataTextPart1}}</bpText>
                    <div class="home-data-value-text-line"></div>
                    <bpText class="ph-body-medium_brand">{{translation_data.dataTextPart2}}</bpText>
                    <div class="home-data-value-text-line"></div>
                    <bpText class="ph-body-medium_brand">{{translation_data.dataTextPart3}}</bpText>
                </div>
                <bpImg class="data-show-img" :src="dataShowImg"></bpImg>
            </div>
            <!-- max-show -->
            <div class="max-show">
                <div class="max-show-left">
                    <div class="max-show-left-text-line"></div>
                    <div class="max-show-left-text-row-1">
                        <bpText class="ph-H-xLarge">{{translation_data.maxTitle}}</bpText>
                        <bpText class="ph-body-xsmall-tertiary">{{translation_data.maxTitleDes}}</bpText>
                    </div>
                    <bpText class="max-text-center">{{translation_data.maxTextCenter}}</bpText>
                    <bpText class="max-text-center-brand">{{translation_data.maxTextCenterBrand}}</bpText>
                    <div class="max-show-more-button-container" @click="linkToPage('max')">
                        <bpButton :text="translation_data.showMoreButton"
                        class="button-official-yellow-line-compact"></bpButton>
                        <bpImg :src="showMoreButtonGo" class="show-more-button-go"></bpImg>
                    </div>
                </div>
                <div class="max-show-right-img-container">
                    <bpImg :src="responseMini ? maxRightImg_480 : maxRightImg" class="max-show-right-img"></bpImg>
                </div>
            </div>
            <!-- real-world -->
            <div class="real-world">
                <div class="real-world-left-img-container">
                    <bpImg :src="realWorldLeftImg" class="real-world-left-img"></bpImg>
                </div>
                <div class="real-world-right">
                    <div class="real-world-right-line"></div>
                    <div class="real-world-right-text-line-1">
                        <bpText class="ph-H-xLarge">{{translation_data.realWorldTitle}}</bpText>
                    </div>
                    <bpText class="ph-H-Large">{{translation_data.realWorldTitleSmall}}</bpText>
                    <bpText class="ph-H-Large_brand">{{translation_data.realWorldBrand}}</bpText>
                    <div class="real-show-more-button-container" @click="linkToPage('rw')">
                        <bpButton :text="translation_data.showMoreButton" class="button-official-yellow-line-compact"></bpButton>
                        <bpImg :src="showMoreButtonGo" class="show-more-button-go"></bpImg>
                    </div>
                </div>
            </div>
            <!-- advisory -->
            <div class="advisory">
                <div class="advisory-left">
                    <div class="advisory-left-line"></div>
                    <div class="advisory-left-text-line-1">
                        <bpText class="ph-H-xLarge">{{translation_data.advisoryTitle}}</bpText>
                    </div>
                    <bpText class="ph-H-Large">{{translation_data.advisoryTitleSmall}}</bpText>
                    <bpText class="ph-H-Large_brand">{{translation_data.advisoryBrand}}</bpText>
                    <div class="advisory-show-more-button-container" @click="linkToPage('consulting')">
                        <bpButton :text="translation_data.showMoreButton" class="button-official-yellow-line-compact"></bpButton>
                        <bpImg :src="showMoreButtonGo" class="show-more-button-go"></bpImg>
                    </div>
                </div>
                <div class="advisory-right-img-container">
                    <bpImg :src="advisoryRightImg" class="advisory-right-img"></bpImg>
                </div>
            </div>
            <!-- iconLine -->
            <iconLine v-if="!response" class="case-icon-contaniner"></iconLine>
            <iconLineRes v-if="response" class="case-icon-contaniner-response"></iconLineRes>
        </div>
    </div>
</template>
<script>
import iconLine from '../panel/bp-icon-line'
import iconLineRes from '../panel/bp-icon-line-response'
import navTop from '../panel/bp-nav-top'
import bpText from '../bp-text'
import bpImg from '../bp-img'
import bpCardActive from '../panel/bp-card-activity'
import bpCardArticle from '../panel/bp-card-article'
import bpButton from '../bp-button'
import BpText from '../bp-text.vue'
import { staticFilePath } from '../../config/envConfig'
import ElCard from 'element-ui/packages/card/src/main.vue'
import ElButton from 'element-ui/packages/button/index'

export default {
    name: 'home',
    data() {
        return {
            language: '中文', // 中英切换
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            response: false,
            responseMini: false,
            translation_basedata: {
                cn: {
                    //truth
                    truthTitle: "还原真实 可见未来",
                    truthDes: "医药数据融合与洞见者",
                    // Industry Insight
                    IndustryInsightEvents: "Industry Insight",
                    moreIndustryInsight: "更多内容",
                    //active
                    activeEvents: "EVENTS",
                    moreActivity: "更多活动",
                    //report
                    reportThemeSmall: "最新发布",
                    reportBodySmall: "深度医药市场行业分析报告",
                    reportLargeTitle: "《带量采购对中国医药市场格局的影响》",
                    reportTertiary: "2020年6月5日",
                    reportButton: "获取报告",
                    moreReportsText: "更多报告",
                    //data-show
                    dataShowAboutUs: "法伯凝聚顶尖数据分析师与数据科学家",
                    dataShowTitle: "重新定义，您的数据价值",
                    showMoreButton: "了解更多",
                    dataTextPart1: "丰富的数据源",
                    dataTextPart2: "强劲算能",
                    dataTextPart3: "超群智能算法",
                    //max-show
                    maxTitle: "MAX",
                    maxTitleDes: " Market Analytic Box",
                    maxTextCenter: "城市、县域、CHC，及时掌握市场动态",
                    maxTextCenterBrand: "全息市场监测利器",
                    //real-world
                    realWorldTitle: "真实世界数据研究",
                    realWorldTitleSmall: "来自患者信息的多视角深度挖掘",
                    realWorldBrand: "发现不同",
                    // advisory
                    advisoryTitle: "循证咨询",
                    advisoryTitleSmall: "多层面精准预测，营销资源配置与优化",
                    advisoryBrand: "提升ROI"
                },
                en: {
                    //truth
                    truthTitle: "See The Truth \nSee The Future",
                    truthDes: "Leading Fusion and Insight in Medical Data",
                    // Industry Insight
                    IndustryInsightEvents: "Industry Insight",
                    moreIndustryInsight: "MORE",
                    //active
                    activeEvents: "Events",
                    moreActivity: "MORE",
                    //report
                    reportThemeSmall: "Latest Released",
                    reportBodySmall: "In-depth Industry Analysis Report of Pharmaceutical Market",
                    reportLargeTitle: "VBP's Impact on the Chinese Pharmaceutical Market",
                    reportTertiary: "2020-06-05",
                    reportButton: "DOWNLOAD",
                    moreReportsText: "MORE",
                    //data-show
                    dataShowAboutUs: "Pharbers Gathers Top Data Analysts and Scientists",
                    dataShowTitle: "Re-define the value of your data assets",
                    showMoreButton: "Learn More",
                    dataTextPart1: "Multiple Exclusive Data Sources",
                    dataTextPart2: "Powerful Algorithm",
                    dataTextPart3: "Superior Intelligence",
                    //max-show
                    maxTitle: "MAX©",
                    maxTitleDes: " Market Analytic Box",
                    maxTextCenter: "Cities, Counties, and CHC\nKeeping Tracking Market Trends",
                    maxTextCenterBrand: "Holographic Market Monitoring Tool",
                    //real-world
                    realWorldTitle: "Real World Research",
                    realWorldTitleSmall: "Multi-perspective Deep Mining from Patient Information",
                    realWorldBrand: "Find Differences",
                    // advisory
                    advisoryTitle: "Evidence-based Consulting",
                    advisoryTitleSmall: "Multi-level Accurate Prediction\nAllocating and Optimizing Marketing Resource",
                    advisoryBrand: "Improve ROI"
                }
            },
            src: `${staticFilePath}` + "/img_home_hero.png",
            buttonGo: `${staticFilePath}` + "/icon_go_yellow.svg",
            reportLeftDown: `${staticFilePath}` + "/img_deco_corner.svg",
            reportRightDown: `${staticFilePath}` + "/img_deco_corner.svg",
            reportDownImg: `${staticFilePath}` + "/img_paper-cover_VPB.jpg",
            reportConnectImg: `${staticFilePath}` + "/img_connect_line.svg",
            dataShowImg: `${staticFilePath}` + "/img_corevalue.png",
            showMoreButtonGo: `${staticFilePath}` + "/icon_go.svg",
            maxRightImg: `${staticFilePath}` + "/img_home_max.png",
            maxRightImg_480: `${staticFilePath}` + "/img_home_max_480.png",
            realWorldLeftImg: `${staticFilePath}` + "/img_home_realworld.png",
            advisoryRightImg: `${staticFilePath}` + "/img_home_consulting.png"
        }
        
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {}
            }
        }
    },
    components: {
        bpText,
        bpImg,
        bpCardActive,
        bpButton,
        BpText,
        iconLine,
        iconLineRes,
        navTop,
        ElCard,
        ElButton,
        bpCardArticle
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
        linkToArticlePage(data) {
            const event = new Event("event")
            event.args = {
                callback: "linkToArticlePage",
                element: this,
                param: {
                    name: "article",
                    uri: data
                }
            }
            this.$emit('event', event)
        },
        returnToTop() {
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        },
        transDate(param) {
            let date = new Date(param)
            let y = date.getUTCFullYear()
            let d = date.getUTCDate()
            let m = date.getUTCMonth()
            if (this.language === '中文') {
                return y + "年" + (m+1) + "月" + d + "日"
            } else {
                return y + "-" + (m+1) + "-" + d
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
        activities: function() {
            let typeArr = []
            if(this.allData.activities) {
                this.allData.activities.forEach(item => {
                    let type = item.activityType
                    let ind = 0
                    for(let i=0; i< typeArr.length; i++) {
                        if(typeArr[i] == type) {
                            ind++
                        }
                    }
                    item.curIndex = ind
                    typeArr.push(type)
                })
            }
            return this.allData.activities
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
        console.log(staticFilePath)
        // todo
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
        // const event = new Event("event")
        // event.args = {
        //     callback: "requestData",
        //     element: this,
        //     param: {}
        // }
        // this.$emit('event', event)
    }
}
</script>
<style lang="scss" scoped>
    /* 公共样式 */
    * {
        box-sizing: border-box;
        line-height: 1.6;
    }
    .show-more-button-go {
        height: 40px;
        width: 40px;
        background: #FFDD4D;
        padding: 8px;
        cursor: pointer;
    }
    .button-official-yellow-line-compact {
        height: 40px;
        padding: 0 24px;
        line-height: 40px;
        background: linear-gradient(45deg,rgba(255,221,77,.5) 0,rgba(255,221,77,.5) 5%,transparent 5%,transparent 50%,rgba(255,221,77,.5) 50%,rgba(255,221,77,.5) 55%,transparent 55%,transparent)!important;
        background-size: 8px 8px!important;
        border: none;
        font-weight: 500;
        font-size: 14px;
        color: #2D334D !important;
    }
    /* 公共样式 end */

    .bp-home {
        width: 100%;
        min-width: 375px;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-x: hidden;
        // truth
        .truth-content-area {
            height: 620px;
            max-width: 1200px;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-content: flex-start;
            padding: 80px 100px 0;
            align-items: center;
            .title {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: stretch;
                align-content: flex-start;
                height: auto;
                width: auto;
                background: 0 0;
                display: flex;
                padding: 0;
                .ph-H-Display {
                    font-size: 48px;
                    color: #2D334D;
                    letter-spacing: 4px;
                    font-weight: 600;
                    text-shadow: none;
                    white-space: pre-line;
                }
                .ph-body-medium {
                    margin-top: 16px;
                    font-size: 16px;
                    color: #747789;
                }
            }
            .bp-img {
                object-fit: cover;
            }
            .home-header-img {
                height: 366px;
                width: 545px;
                pointer-events: none;
            }
        }
        // truth end
        .content-industry-area {
            margin-bottom: 180px;
        }
        // active
        .content-active-area {
            height: 421px;
            width: 100%;
            min-height: 421px;
            max-width: 1200px;
            background: 0 0;
            position: relative;
            display: flex;
            flex-direction: row;
            justify-content: flex-end;
            align-content: flex-start;
            align-items: stretch;
            padding-right: 24px;
            .active-line {
                height: 535px;
                width: 8px;
                background: 0 0;
                border-left: 1px solid rgba(22,28,57,.1);
                position: absolute;
                left: 100px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: stretch;
                align-content: flex-start;
                .active-yellow-line {
                    height: 8px;
                    width: 2px;
                    background: #F5C924;
                    position: relative;
                    left: -1px;
                    opacity: .5;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: stretch;
                    align-content: flex-start;
                }
            }
            .active-text {
                height: 70px;
                width: 22px;
                text-align: right;
                background: 0 0;
                font-size: 16px;
                color: #161C39;
                writing-mode: vertical-rl;
                transform: rotate(180deg);
                opacity: .6;
                position: absolute;
                left: 110px;
            }
            .content-active-review-more-button {
                position: absolute;
                right: 0;
                bottom: 67px;
                z-index: 2;
                height: auto;
                width: auto;
                background: 0 0;
                .show-more-button-container {
                    height: auto;
                    width: auto;
                    background: 0 0;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: stretch;
                    align-content: flex-start;
                    .button-official-gray-line {
                        width: 80px;
                        height: 32px;
                        line-height: 32px;
                        background: linear-gradient(45deg,rgba(22,28,57,.2) 0,rgba(22,28,57,.2) 5%,transparent 5%,transparent 50%,rgba(22,28,57,.2) 50%,rgba(22,28,57,.2) 55%,transparent 55%,transparent)!important;
                        background-size: 10px 10px!important;
                        border: none;
                        font-weight: 500;
                        font-size: 12px;
                        color: #2D334D;
                    }
                    .active-button-go {
                        height: 32px;
                        width: 32px;
                        background: #161C39;
                        padding: 6px;
                        cursor: pointer;
                    }
                }
            }
            .content-active-bg-yellow {
                height: 180px;
                width: 860px;
                background: #F5C924;
                border-radius: 2px;
                right: 0;
                position: absolute;
                z-index: 0;
                opacity: .8;
                top: 240px;
            }
            .content-active-bg-line-right {
                height: 210px;
                width: 1px;
                background: 0 0;
                right: 100px;
                position: absolute;
                z-index: 0;
                opacity: .1;
                top: 325px;
                border-left: 1px solid #161C39;
            }
        }
        // active end
        // report
        .report-download-container {
            height: 459px;
            max-width: 1200px;
            width: 100%;
            background: 0 0;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            align-content: flex-start;
            .report-download {
                height: 331px;
                width: 1000px;
                background: 0 0;
                border: 1px solid #e8e9eb;
                padding: 0 32px;
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                align-content: flex-start;
                .report-download-left-corner {
                    height: 11px;
                    width: 11px;
                    background: 0 0;
                    position: absolute;
                    top: -4px;
                    left: -4px;
                }
                .bp-img {
                    object-fit: cover;
                    pointer-events: none;
                }
                .report-download-right-corner {
                    height: 11px;
                    width: 11px;
                    background: 0 0;
                    position: absolute;
                    right: -4px;
                    bottom: -4px;
                    transform: rotate(180deg);
                }
                .report-download-img-container {
                    height: 251px;
                    width: 100%;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    align-content: flex-start;
                    .report-down-img {
                        height: 242px;
                        width: 171px;
                        object-fit: fill;
                        border-radius: 2px;
                        pointer-events: none;
                    }
                    .report-down-img-mask {
                        width: 153px;
                        height: 241px;
                        position: absolute;
                        border-radius: 2px;
                        background: #747789;
                        z-index: -1;
                        box-shadow: 0 5px 7px 0 rgba(22, 28, 57, 0.36);
                        transform-origin: 0 242px;
                        transform: rotate(4deg) translateX(-8px);
                    }
                }
                .report-download-info {
                    height: auto;
                    width: auto;
                    background: 0 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                    align-content: flex-start;
                    .report-right-head, .report-right-center {
                        margin-bottom: 40px;
                        display: flex;
                        flex-direction: column;
                        justify-content: flex-start;
                        align-items: stretch;
                        align-content: flex-start;
                        height: auto;
                        width: auto;
                        background: 0 0;
                        padding: 0;
                        .ph-H-small-theme {
                            letter-spacing: .2px;
                            height: 20px;
                            font-size: 14px;
                            color: #F5C924;
                        }
                        .ph-body-small {
                            font-size: 14px;
                            color: #747789;
                        }
                        .ph-H-large-title {
                            margin-bottom: 8px;
                            font-size: 24px;
                            color: #2D334D;
                        }
                        .pb-body-small-tertiary {
                            font-size: 12px;
                            color: #A2A5B0;
                        }
                    }
                    .show-more-button-container {
                        height: auto;
                        width: auto;
                        background: 0 0;
                        display: flex;
                        flex-direction: row;
                        justify-content: flex-start;
                        align-items: stretch;
                        align-content: flex-start;
                        cursor: pointer !important;
                        padding: 0;
                        .report-down-button {
                            width: 240px!important;
                            border-radius: 0!important;
                            background: #FFDD4D;
                            color: #2D334D;
                            border: none;
                            cursor: inherit;    
                            height: 40px!important;
                            text-align: center!important;
                            display: inline-block!important;
                            font-size: 14px;
                            letter-spacing: 1px;
                            line-height: 32px;
                        }
                        .more-reports-button {
                            width: 137px;
                            height: 40px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            margin-left: 16px;
                            margin-right: 22px;
                            .more-reports {
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                font-size: 14px;
                                .more-reports-img {
                                    width: 21px;
                                    height: 21px;
                                    margin-left: 8px;
                                }
                            }
                        }
                    }
                }
            }
        }
        // report end 
        // data-show
        .data-show {
            height: 778px;
            width: 1200px;
            padding: 0 100px 12px;
            background: 0 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            align-content: flex-start;
            justify-content: flex-start;
            .report-connect-img {
                height: auto;
                width: auto;
                background: 0 0;
                position: relative;
                top: -30px;
            }
            .home-about-us-peoples {
                font-size: 24px;
                color: #747789;
                letter-spacing: .4px;
                text-align: center;
            }
            .ph-H-xLarge {
                margin-bottom: 32px!important;
                font-size: 40px;
                font-weight: 200;
                color: #2D334D;
            }
            .show-more-button-container {
                height: auto;
                width: auto;
                margin-bottom: 43px;
                background: 0 0;
                cursor: pointer;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                align-items: stretch;
                align-content: flex-start;
            }
            .data-show-text-part {
                height: auto;
                width: 55%;
                margin-bottom: 43px;
                background: 0 0;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
                text-align: center;
                align-content: flex-start;
                .ph-body-medium_brand {
                    font-size: 16px;
                    color: #F5D924;
                }
                .home-data-value-text-line {
                    height: 1px;
                    width: 83px;
                    background: #697786;
                    opacity: .2;
                }
            }
            .data-show-img {
                height: 421px;
                width: 668px;
                object-fit: contain;
                background: 0 0;
            }
        }
        // data-show end 
        // max-show
        .max-show {
            width: 100%;
            height: auto;
            min-height: 688px;
            max-width: 1200px;
            background: 0 0;
            display: flex;
            flex-direction: row;
            flex-wrap: wrap-reverse;
            align-content: flex-start;
            align-items: stretch;
            justify-content: flex-start;
            .max-show-left {
                height: auto;
                width: auto;
                padding-left: 100px;
                background: 0 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                align-content: flex-start;
                align-items: stretch;
                .max-show-left-text-line {
                    height: 40px;
                    width: 60px;
                    background: 0 0;
                    border-top: 1px solid #FFCC30;
                }
                .max-show-left-text-row-1 {
                    height: auto;
                    width: auto;
                    margin-bottom: 40px;
                    background: 0 0;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: stretch;
                    align-content: flex-start;
                    .ph-H-xLarge {
                        margin-right: 4px;
                        font-size: 40px;
                        font-weight: 200;
                        color: #2D334D;
                    }
                    .ph-body-xsmall-tertiary {
                        padding-top: 28px;
                        font-size: 12px;
                        color: #A2A5B0;
                    }
                }
                .max-text-center {
                    white-space: pre-line;
                    font-size: 24px;
                    color: #747789;
                }
                .max-text-center-brand {
                    font-size: 24px;
                    color: #F5C924;
                }
                .max-show-more-button-container {
                    height: auto;
                    width: max-content;
                    margin-top: 40px;
                    background: 0 0;
                    cursor: pointer;
                    display: flex;
                    .max-button-go {
                        height: 40px;
                        width: 40px;
                        background: #FFDD4D;
                        padding: 8px;
                    }
                }
            }
            .max-show-right-img-container {
                height: auto;
                width: auto;
                background: 0 0;
                flex: 1;
                display: flex;
                .max-show-right-img {
                    height: 688px;
                    width: 600px;
                    object-fit: contain;
                    background: 0 0;
                }
            }
        }
        // max-show end 
        // real-world
        .real-world {
            width: 100%;
            height: auto;
            background: 0 0;
            flex-direction: row;
            flex-wrap: wrap;
            min-height: 498px;
            max-width: 1200px;
            display: flex;
            .real-world-left-img-container {
                height: auto;
                width: auto;
                background: 0 0;
                flex: 1;
                padding: 62px 77px;
                display: flex;
                .real-world-left-img {
                    height: 397px;
                    width: 457px;
                    object-fit: fill;
                    background: 0 0;
                }
            }
            .real-world-right {
                height: auto;
                width: auto;
                padding-right: 100px;
                padding-left: 32px;
                background: 0 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                .real-world-right-line {
                    height: 40px;
                    width: 60px;
                    background: 0 0;
                    border-top: 1px solid #FFCC30;
                }
                .real-world-right-text-line-1 {
                    height: auto;
                    width: auto;
                    margin-bottom: 40px;
                    background: 0 0;
                    display: flex;
                    flex-direction: row;
                    .ph-H-xLarge {
                        font-size: 40px;
                        font-weight: 200;
                        color: #2D334D;
                    }
                }
                .ph-H-Large {
                    font-size: 24px;
                    color: #747789;
                }
                .ph-H-Large_brand {
                    font-size: 24px;
                    color: #F5C924;
                }
                .real-show-more-button-container {
                    height: auto;
                    width: max-content;
                    margin-top: 40px;
                    background: 0 0;
                    cursor: pointer;
                    display: flex;
                }
            }
        }
        // real-world end 
        // advisory
        .advisory {
            width: 100%;
            height: auto;
            background: 0 0;
            flex-direction: row;
            flex-wrap: wrap-reverse;
            min-height: 498px;
            max-width: 1200px;
            display: flex;
            .advisory-left {
                height: auto;
                width: auto;
                padding-left: 100px;
                background: 0 0;
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;
                .advisory-left-line {
                    height: 40px;
                    width: 60px;
                    background: 0 0;
                    border-top: 1px solid #FFCC30;
                }
                .advisory-left-text-line-1 {
                    height: auto;
                    width: auto;
                    margin-bottom: 40px;
                    background: 0 0;
                    display: flex;
                    flex-direction: row;
                    .ph-H-xLarge {
                        font-size: 40px;
                        font-weight: 200;
                        color: #2D334D;
                    }
                }
                .ph-H-Large {
                    white-space: pre-line;
                    font-size: 24px;
                    color: #747789;
                }
                .ph-H-Large_brand {
                    font-size: 24px;
                    color: #F5C924;
                }
                .advisory-show-more-button-container {
                    height: auto;
                    width: max-content;
                    margin-top: 40px;
                    background: 0 0;
                    cursor: pointer;
                    display: flex;
                }
            }
            .advisory-right-img-container {
                height: auto;
                width: auto;
                background: 0 0;
                flex: 1;
                display: flex;
                .advisory-right-img {
                    height: 498px;
                    width: 600px;
                    background: 0 0;
                }
            }
        }
        // advisory end 
        // case-icon
        .case-icon-contaniner {
            height: max-content;
            width: 100%;
            max-width: 1200px;
            background: 0 0;
            padding: 96px 125px 0;
            justify-content: space-between;
            opacity: 0.6;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
        }
        .case-icon-contaniner-response {
            height: max-content;
            width: 100%;
            max-width: 1200px;
            background: 0 0;
            justify-content: space-between;
            opacity: 0.6;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            padding: 100px 4px 0;
        }
        @media (max-width: 992px) and (min-width: 769px) {
            // truth
            .truth-content-area {
                padding: 0 60px !important
            }
            .home-header-img {
                width: 45% !important;
                object-fit: contain !important;
                margin-top: 64px !important;
            }
            //active
            .content-active-panel {
                width: 23% !important;
                height: 357px !important;
                /deep/.active-img {
                    width: 100% !important;
                    height: 220px !important;
                }
                /deep/.active-info {
                    width: 100% !important;
                    height: 117px !important;
                    padding: 24px !important;
                }
            }
            .content-active-bg-yellow {
                width: 70% !important;
                top: 220px !important;
                height: 200px !important;
            }
            .active-line {
                position: absolute !important;
                left: 60px !important;
                height: 635px !important;
            }
            .content-active-bg-line-right {
                right: 60px !important;
                height: 250px !important;
            }
            .content-active-area .active-text {
                left: 70px !important;
            }
            // report
            .report-download-container {
                margin-bottom: 60px !important;
                margin-top: 30px !important;
                .report-download {
                    height: auto !important;
                    margin: 0 60px !important;
                    padding: 24px 0 !important;
                    .report-download-info {
                        width: 56% !important;
                        height: auto !important;
                        text-align: center;
                        .show-more-button-container {
                            width: 100% !important;
                            justify-content: center !important;
                        }
                    }
                    .report-download-img-container {
                        height: 251px;
                        width: 44% !important;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
            //data-show
            .data-show {
                width: 100% !important;
                padding: 0 50px !important;
                .data-show-text-part {
                    width: 85% !important;
                }
                .data-show-img {
                    height: 388px !important;
                    width: 64% !important;
                }
            }
            //max-show {
            .max-show-left {
                padding: 60px !important;
            }
            .max-show-right-img, .real-world-left-img, .advisory-right-img {
                width: 100% !important;
                object-fit: cover;
                min-width: 312px !important;
            }
            //advisory
            .advisory-left {
                padding-left: 60px !important;
            }
            //icon
            .case-icon-contaniner {
                padding: 100px 24px !important;
            }
        }
        @media (max-width: 768px) and (min-width: 550px) {
            // truth
            .truth-content-area {
                height: auto !important;
                width: 100% !important;
                padding: 0 8%!important;
                margin-top: 150px;
                flex-wrap: wrap;
                justify-content: center !important;
                .ph-H-Display {
                    text-align: center;
                }
                .home-header-img {
                    width: 70% !important;
                    object-fit: contain !important;
                    margin-top: 64px !important;
                }
                .ph-body-medium {
                    text-align: center;
                }
            }
            // active
            .content-active-area {
                flex-wrap: wrap;
                height: auto !important;
                .active-line{
                    position: absolute !important;
                    left: 40px !important;
                }
                .active-text {
                    left: 50px !important;
                }
                .content-active-panel {
                    width: 74% !important;
                    height: 172px !important;
                    flex-wrap: wrap;
                    margin-top: 24px !important;
                    /deep/.active-img {
                        width: 50% !important;
                        height: 172px !important;
                        .above-data-logo {
                            display: none !important;
                        }
                    }
                    /deep/.active-info {
                        width: 50% !important;
                        height: 172px !important;
                        padding: 12px !important;
                    }
                    /deep/.home-avtive-names {
                        height: 90px !important;
                    }
                    /deep/.active-logo {
                        display: flex !important;
                    }
                }
                /deep/.content-active-review-more-button {
                    bottom: 10px!important;
                }
                .content-active-bg-yellow {
                    height: 440px !important;
                    width: 73% !important;
                    top: 185px !important;
                }
            }
            // report
            .report-download-container {
                margin-bottom: 60px !important;
                margin-top: 140px !important;
                .report-download {
                    flex-wrap: wrap;
                    height: auto !important;
                    margin: 0 40px !important;
                    padding: 24px 0 !important;
                    justify-content: center !important;
                }
                .report-download-info {
                    width: 100% !important;
                    height: auto !important;
                    text-align: center;
                    .show-more-button-container {
                        width: 100% !important;
                        justify-content: center !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                }
            }
            //data-show
            .data-show {
                width: 100% !important;
                padding: 0 50px !important;
                .data-show-text-part {
                    width: 85% !important;
                }
                .data-show-img {
                    height: 265px !important;
                    width: 100% !important;
                    object-fit: cover;
                }
            }
            //max-show
            .max-show {
                flex-direction: column-reverse !important;
                padding: 40px !important;
                .max-show-left {
                    padding: 24px !important;
                    align-items: center !important;

                    .max-show-left-text-row-1  {
                        flex-direction: column !important;
                        align-content: center !important;
                        margin-bottom: 0 !important;

                        .ph-H-xLarge {
                            text-align: center;
                        }

                        .ph-body-xsmall-tertiary {
                            padding: 0 !important;
                        }
                    }
                }
            }

            .real-world-left-img-container {
                padding: 0 !important;
            }
            .max-show-right-img, .advisory-right-img, .real-world-left-img {
                width: 100% !important;
                height: 320px !important;
                object-fit: cover;
                min-width: 312px !important;
            }

            //real-world
            .real-world {
                flex-direction: column !important;
                align-content: center !important;
                padding: 40px !important;
                .real-world-right {
                    align-items: center !important;
                    padding: 0 24px !important;
                }

                .real-world-left-img {
                    padding: 24px !important;
                }
            }
            //advisory
            .advisory {
                padding: 40px !important;
                flex-direction: column !important;
                align-content: center !important;

                .advisory-right-img {
                    margin-top: 60px !important;
                }

                .advisory-left {
                    padding: 0 24px !important;
                    align-items: center !important;
            
                    .advisory-left-text-line-1 {
                        margin-bottom: 0 !important;
                    }
                }
            }
        }
        @media (max-width: 549px), (width: 549px) {
             // 统一样式
            .ph-H-xLarge {
                font-size: 28px !important;
            }

            .ph-H-Display {
                font-size: 30px !important;
            }

            // truth
            .truth-content-area {
                height: auto !important;
                width: 100% !important;
                padding: 0 8%!important;
                margin-top: 100px;
                flex-wrap: wrap;
                justify-content: center !important;
                .ph-H-Display, .ph-body-medium{
                    text-align: center;
                }
                .home-header-img {
                    width: 100% !important;
                    object-fit: contain !important;
                }
            }
            // active
            .content-active-area {
                flex-wrap: wrap;
                height: auto !important;
                .active-line, .active-text {
                    position: absolute !important;
                    left: 24px !important;
                }
                .active-line {
                    height: 935px !important;
                }
                .content-active-bg-line-right {
                    right: 24px !important;
                    top: 730px !important;
                    height: 110px !important;
                }
                .content-active-panel {
                    width: 74% !important;
                    height: 172px !important;
                    flex-wrap: wrap;
                    margin-top: 8px !important;

                    /deep/.above-data-logo {
                        display: none !important;
                    }
                    /deep/.active-img {
                        width: 130px !important;
                        height: 172px !important;

                        img {
                            border-radius: 2px 0 0 2px !important;
                        }

                        .img-mask {
                            border-radius: 2px 0 0 2px !important;
                        }
                    }
                    /deep/.active-info {
                        width: 50% !important;
                        height: 150px !important;
                        padding: 16px 8px 0 5px !important;
                    }
                    /deep/.position-info {
                        bottom: 25px !important;
                    }
                    /deep/.home-avtive-names {
                        height: 100% !important;
                        margin-bottom: 0;
                    }
                    /deep/.active-logo {
                        display: inherit !important;
                    }
                    /deep/.active-title {
                        height: 65px !important;
                    }
                }
                /deep/.content-active-review-more-button  {
                    bottom: 16px !important;
                }
                .content-active-bg-yellow {
                    height: 529px !important;
                    width: 73% !important;
                    top: 55px !important;
                }
            }
            
            // report
            .report-download-container {
                height: auto !important;
                margin-bottom: 60px !important;
                margin-top: 112px !important;
                .report-download {
                    flex-wrap: wrap;
                    height: auto !important;
                    margin: 0 24px;
                    padding: 41px 24px 24px 24px !important;
                    .report-download-img-container {
                        margin-bottom: 24px;
                    }
                    .report-download-info {
                        width: 100% !important;
                        height: auto !important;
                        text-align: center;
                        .show-more-button-container {
                            width: 100% !important;
                            justify-content: center !important;
                            flex-direction: column;
                            align-items: center;
                        }
                    }
                }
            }
            // data-show 
            .data-show {
                width: 100% !important;
                height: 700px !important;
                padding: 0 24px !important;

                .home-about-us-peoples {
                    font-size: 16px !important;
                    letter-spacing: 0.27px !important;
                }
                .data-show-text-part {
                    width: 100% !important;
                }
                .data-show-img {
                    height: 265px !important;
                    width: 100% !important;
                    object-fit: contain;
                }
            }
            // max-show
            .max-show {
                .max-show-left {
                    padding: 20px 24px 48px 24px!important;
                    align-items: center !important;
                    .max-show-left-text-line {
                        height: 32px !important;
                    }
                    .max-show-left-text-row-1 {
                        flex-direction: column !important;
                        align-content: center !important;
                        margin-bottom: 0 !important;
                        .ph-H-xLarge {
                            text-align: center;
                        }
                        .ph-body-xsmall-tertiary {
                            padding: 0 !important;
                            margin-bottom: 24px !important;
                        }
                    }

                    .max-show-more-button-container {
                        margin-top: 24px !important;
                    }
                }
                .max-show-right-img-container {
                    padding: 0 24px;
                    .max-show-right-img {
                        width: 100% !important;
                        height: 320px !important;
                        object-fit: contain !important;
                        min-width: 312px !important;
                    }
                }
            }

            .advisory-right-img, .real-world-left-img {
                width: 100% !important;
                height: 320px !important;
                object-fit: cover;
                min-width: 312px !important;
            }
            .real-world-left-img-container {
                padding: 0 !important;

                .real-world-left-img {
                    margin-bottom: 16px !important;
                    margin-top: 24px;
                    object-fit: contain !important;
                }
            }
            //real-world
            .real-world {
                .real-world-right {
                    align-items: center !important;
                    padding: 0 24px !important;
                    margin-bottom: 48px;

                    .real-world-right-text-line-1 {
                        margin-bottom:  24px !important;
                    }

                    .real-world-right-line {
                        height: 32px !important;
                    }

                    .ph-H-Large {
                        text-align: center;
                    }

                    .real-show-more-button-container {
                        margin-top: 24px !important;
                    }
                }
                .real-world-left-img {
                    padding: 24px !important;
                }
            }
            // advisory
            .advisory {
                .advisory-left {
                    padding: 40px 24px 48px !important;
                    align-items: center !important;
                    .advisory-left-text-line-1 {
                        margin-bottom: 24px !important;
                    }
                    .advisory-show-more-button-container {
                        margin-top: 24px !important;
                    }
                }
                .advisory-right-img-container {
                    margin-top: 48px;
                }
            }
        }
    }
</style>
<template>
    <div class="bp-consulting">
        <div class="consulting-header">
            <bpImg class="above-data-detail-header-img" :src="headerImg"></bpImg>
            <bpText class="ph-body-small-inverse top-breadcrumb">
                <span class="mr-0" @click="toHome">{{translation_data.home}}</span>
                <span class="mr-0">/</span>
                <span>{{translation_data.consult}}</span>
            </bpText>
            <bpText class="page-header-anton-font">{{translation_data.consuluEN}}</bpText>
            <bpText class="consulting-header-slogan-b">{{translation_data.consult}}</bpText>
            <bpText class="consulting-header-slogan-c">{{translation_data.multiLevelPrediction}}</bpText>
            <bpText class="consulting-header-slogan-c">{{translation_data.ImproveROI}}</bpText>
            <!-- <bpText class="">{{translation_data.}}</bpText> -->
            <!-- <bpImg class="" :src=""></bpImg> -->

        </div>
        <div class="consulting-text-info">
            <bpImg class="consult-connect-img" :src="consultConnectImg"></bpImg>
            <bpText class="consult-text-info-title-a">{{translation_data.consultingTitleA}}</bpText>
            <bpText class="consult-text-info-title-b">{{translation_data.consultingTitleB}}</bpText>
            <bpText class="consult-text-info-text">{{translation_data.consultingDescription}}</bpText>
        </div>
        <div class="consult-advantage-card-container">
            <!-- <bpImg class="consult-advantage-card-container-img" :src="consultAdvantageCardImg"></bpImg> -->
            <bpImg class="consult-connect-img" :src="consultConnectImg"></bpImg>
            <bpText class="consult-advantage-container-title">{{translation_data.advtantages.advantagesText}}</bpText>
            <div class="consult-cards-row-a">
                <div class="consult-advantage-card-nav">
                    <div class="consult-advantage-card-nav-line">
                        <div class="consult-advantage-card-nav-line-yellow"></div>
                    </div>
                    <bpText class="consult-advantage-card-nav-title">{{translation_data.advtantages.forecast}}</bpText>
                    <bpText class="consult-advantage-card-nav-eg">{{translation_data.advtantages.forecastEN}}</bpText>
                </div>
                <div class="consulting-advantage-card-container">
                    <div class="consulting-advantage-card">
                        <bpImg class="max-advantage-card-icon" :src="maxAdvantageCardIcon"></bpImg>
                        <bpText class="consulting-advantage-card-title">01</bpText>
                        <div class="consulting-advantage-card-title-line"></div>
                        <bpText class="consulting-advantage-card-desc-a">{{translation_data.advtantages.advantageA.title}}</bpText>
                        <bpText class="consulting-advantage-card-desc-b">{{translation_data.advtantages.advantageA.textA1}}</bpText>
                        <bpText class="consulting-advantage-card-desc-b">{{translation_data.advtantages.advantageA.textA2}}</bpText>
                    </div>
                    <div class="consulting-advantage-card">
                        <bpImg class="max-advantage-card-icon" :src="maxAdvantageCardIcon"></bpImg>
                        <bpText class="consulting-advantage-card-title">02</bpText>
                        <div class="consulting-advantage-card-title-line"></div>
                        <bpText class="consulting-advantage-card-desc-a">{{translation_data.advtantages.advantageB.title}}</bpText>
                        <bpText class="consulting-advantage-card-desc-b">{{translation_data.advtantages.advantageB.textB1}}</bpText>
                        <bpText class="consulting-advantage-card-desc-b">{{translation_data.advtantages.advantageB.textB2}}</bpText>
                    </div>
                </div>
            </div>
            <div class="consult-cards-row-a">
                <div class="consult-advantage-card-nav">
                    <div class="consult-advantage-card-nav-line">
                        <div class="consult-advantage-card-nav-line-yellow"></div>
                    </div>
                    <bpText class="consult-advantage-card-nav-title">{{translation_data.advtantages.operationExcellent}}</bpText>
                    <bpText class="consult-advantage-card-nav-eg">{{translation_data.advtantages.operationExcellentEN}}</bpText>
                </div>
                <div class="consulting-advantage-card-container">
                    <div class="consulting-advantage-card">
                        <bpImg class="max-advantage-card-icon" :src="maxAdvantageCardIcon"></bpImg>
                        <bpText class="consulting-advantage-card-title">01</bpText>
                        <div class="consulting-advantage-card-title-line"></div>
                        <bpText class="consulting-advantage-card-desc-b">{{translation_data.advtantages.advantageC}}</bpText>
                    </div>
                    <div class="consulting-advantage-card">
                        <bpImg class="max-advantage-card-icon" :src="maxAdvantageCardIcon"></bpImg>
                        <bpText class="consulting-advantage-card-title">02</bpText>
                        <div class="consulting-advantage-card-title-line"></div>
                        <bpText class="consulting-advantage-card-desc-b">{{translation_data.advtantages.advantageD}}</bpText>
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
    name: "",
    components: {
        bpText,
        bpImg,
        bpButton
    },
    data() {
        return {
            language: '中文', // 中英切换
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            response: false,
            responseMini: false,
            headerImg: `${staticFilePath}` + "/img_detail-page_head_consulting.jpg",
            consultConnectImg: `${staticFilePath}` + "/img_connect_line.svg",
            consultAdvantageCardImg: `${staticFilePath}` + "/img_bg_doublehexagon.svg",
            consultConnectImg: `${staticFilePath}` + "/img_connect_line.svg",
            maxAdvantageCardIcon: `${staticFilePath}` + "/icon_point.svg",
            translation_basedata: {
                cn: {
                    home: "主页",
                    consult: "循证咨询",
                    consuluEN: "Consulting",
                    multiLevelPrediction: "多层面精准预测，营销资源配置与优化",
                    ImproveROI: "提升ROI",
                    consultingTitleA: "法伯依托强大的数据分析能力与高可用的医药数据资产以及丰富的行业经验，准确地运用数据，还原真实",
                    consultingTitleB: "",
                    consultingDescription: "为企业提供全面的个性化咨询支持，帮助企业管理层进行有据可循的决策。",
                    advtantages: {
                        advantagesText: "能力与优势",
                        forecast: "预测",
                        forecastEN: "Forecasting",
                        operationExcellent: "营销资源配置与优化",
                        operationExcellentEN: "Allocating and optimizing marketing resource",
                        advantageA: {
                            title: "多层面满足不同需求",
                            textA1: "面对市场，提供对宏观市场、疾病领域、竞争市场的预测服务",
                            textA2: "针对产品，提供其在全国层面、大区层面、区域侧面的表现预测服务"
                        },
                        advantageB: {
                            title: "精准的预测方法",
                            textB1: "基线预测：对多个通用统计模型进行严谨质量评估，择优选取",
                            textB2: "事件影响：收集预测的影响事件，并评估其对基线预测的影响"
                        },
                        advantageC: "依靠客观数据与经验实践的科学分析方法，深入了解企业业务状况与需求。",
                        advantageD: "提供兼具针对性和实用性的资源配置与优化、销售运营管理与设计、多渠道营销优化、市场运营有效性评价等咨询服务"
                    }
                },
                en: {
                    home: "Home",
                    consult: "Evidence-based Consulting",
                    consuluEN: "Consulting",
                    multiLevelPrediction: "Multi-level Accurate Prediction\nAllocating and Optimizing Marketing Resource",
                    ImproveROI: "Improve ROI",
                    consultingTitleA: "Based on powerful data analysis capabilities and highly available medical data assets, Pharbers applies data accurately to see the truth, see the future. ",
                    consultingTitleB: "",
                    consultingDescription: "We provide enterprises with comprehensive customized consulting services as a support to help corporate management making decisions.",
                    advtantages: {
                        advantagesText: "Capabilities and Strengths",
                        forecast: "Forecasting",
                        forecastEN: "",
                        operationExcellent: "Allocating and optimizing marketing resource",
                        operationExcellentEN: "",
                        advantageA: {
                            title: "Meet Different Multi-layers Needs",
                            textA1: "For market, we provide prediction services in macro markets, disease areas, and competitive markets.",
                            textA2: "For products, we provide forecasting services at the national and regional levels."
                        },
                        advantageB: {
                            title: "Accurate Prediction",
                            textB1: "Baseline forecasting: use rigorous quality assessment in general statistical models, to select optimum.",
                            textB2: "Event Impact: we collect predicted events and evaluate their impact on baseline forecasts."
                        },
                        advantageC: "Based on factual data and proven scientific analysis methods, we have in-depth comprehension on enterprise business conditions and needs.",
                        advantageD: "Our enterprise-level solutions provide targeted consulting services, including practical resource allocation & optimization, sales operation management & design, multi-channel marketing optimization, market operation effectiveness evaluation, etc."
                    }
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
        toHome() {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: 'home'
            }
            this.$emit('event', event)
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
    .bp-consulting {
        width: 100%;
        min-width: 375px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .consulting-header {
            height: 600px;
            width: 100%;
            padding-left: 100px;
            background: 0 0;
            background-image: linear-gradient(rgba(22,28,57,.5),rgba(22,28,57,.5));
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
            .page-header-anton-font {
                font-family: Anton-Regular;
                font-size: 100px;
                color: #FFF;
                letter-spacing: 2.5px;
                background-image: linear-gradient(rgba(255,255,255,.4),rgba(255,255,255,0) 80%);
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .consulting-header-slogan-b {
                height: auto;
                width: auto;
                margin-top: 20px;
                background: 0 0;
                font-size: 40px;
                color: #FFF;
                position: relative;
                top: -95px;
            }
            .consulting-header-slogan-c {
                height: auto;
                width: auto;
                margin-top: 4px;
                background: 0 0;
                font-size: 24px;
                color: #FFF;
                opacity: .9;
                position: relative;
                top: -50px;
                white-space: pre-line;
            }
        }
        .consulting-text-info {
            height: auto;
            width: 1200px;
            padding: 104px 0;
            background: 0 0;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .consult-connect-img {
                height: auto;
                width: auto;
                background: 0 0;
                position: absolute;
                top: -40px;
                object-fit: cover;
            }
            .consult-text-info-title-a {
                width: 640px;
                background: 0 0;
                font-size: 24px;
                color: #2D334D;
            }
            .consult-text-info-title-b {
                width: 640px;
                margin-bottom: 14px;
                background: 0 0;
                font-size: 24px;
                color: #2D334D;
            }
            .consult-text-info-text {
                height: auto;
                width: 640px;
                background: 0 0;
                font-size: 16px;
                color: #747789;
            }
        }
        .consult-advantage-card-container {
            height: auto;
            width: 1200px;
            padding-top: 104px;
            background: -40% top no-repeat,linear-gradient(173deg,#3C3F53 5%,#1B1F35 98%);
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            .consult-advantage-card-container-img {
                position: absolute;
                width: 100%;
                object-fit: cover;
            }
            .consult-connect-img {
                height: auto;
                width: auto;
                background: 0 0;
                position: absolute;
                top: -40px;
                object-fit: cover;
            }
            .consult-advantage-container-title {
                height: auto;
                width: auto;
                margin-bottom: 69px;
                background: 0 0;
                font-size: 24px;
                color: #FFF;
                opacity: .9;
            }
            .consult-cards-row-a {
                height: auto;
                width: 998px;
                margin-bottom: 64px;
                background: 0 0;
                display: flex;
                justify-content: space-between;
                .consult-advantage-card-nav {
                    height: auto;
                    width: auto;
                    background: 0 0;
                    display: flex;
                    padding: 0;
                    flex-direction: column;
                    .consult-advantage-card-nav-line {
                        height: 1px;
                        width: 306px;
                        margin-bottom: 20px;
                        background: rgba(255,255,255,.2);
                        display: flex;
                        .consult-advantage-card-nav-line-yellow {
                            height: 1px;
                            width: 24px;
                            background: #F5C924;
                            display: flex;
                        }
                    }
                    .consult-advantage-card-nav-title {
                        height: auto;
                        width: 306px;
                        margin-bottom: 13px;
                        background: 0 0;
                        font-size: 24px;
                        color: #F5C924;
                    }
                    .consult-advantage-card-nav-eg {
                        height: auto;
                        width: 306px;
                        background: 0 0;
                        opacity: .2;
                        font-size: 20px;
                        color: #FFF;
                    }
                }
                .consulting-advantage-card-container {
                    height: auto;
                    width: auto;
                    background: 0 0;
                    display: flex;
                    .consulting-advantage-card {
                        margin-right: 24px;
                        height: auto;
                        width: 306px;
                        background: rgba(255,255,255,.05);
                        box-shadow: 0 8px 10px 0 rgba(8, 11, 26, 0.21);
                        border-radius: 2px;
                        padding: 40px 32px 48px;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        .max-advantage-card-icon {
                            height: 22px;
                            width: 19px;
                            background: 0 0;
                            position: absolute;
                            left: -10px;
                            top: 55px;
                            object-fit: cover;
                        }
                        .consulting-advantage-card-title {
                            height: auto;
                            width: auto;
                            margin-bottom: 32px;
                            background: 0 0;
                            font-size: 40px;
                            color: #FFF;
                            opacity: .4;
                            font-weight: 100;
                            display: flex;
                        }
                        .consulting-advantage-card-title-line {
                            height: 1px;
                            width: 49px;
                            margin-bottom: 58px;
                            background: #F5C924;
                            opacity: .8;
                            display: flex;
                        }
                        .consulting-advantage-card-desc-a {
                            height: auto;
                            width: auto;
                            margin-bottom: 25px;
                            background: 0 0;
                            font-size: 16px;
                            opacity: .9;
                            color: #FFF;
                            display: flex;
                        }
                        .consulting-advantage-card-desc-b {
                            height: auto;
                            width: auto;
                            margin-bottom: 8px;
                            background: 0 0;
                            font-size: 12px;
                            opacity: .7;
                            color: #FFF;
                        }
                    }
                }
            }
        }
        @media (max-width: 992px) {
            .consulting-header {
                padding-left: 60px !important;
                .page-header-anton-font {
                    font-size: 60px!important;
                }
            }
            .consulting-text-info  {
                width: 100% !important;
                padding: 100px 176px !important;

                .consult-text-info-title-a,
                .consult-text-info-title-b,
                .consult-text-info-text {
                    width: 100% !important;
                }
            }
            .consult-advantage-card-container {
                width: 100% !important;

                .consult-cards-row-a {
                    width: 100% !important;
                    padding: 0 16% !important;
                    flex-wrap: wrap;

                    .consult-advantage-card-nav {
                        margin-left: 12px !important;
                        margin-bottom: 40px !important;
                    }
                    
                    .consulting-advantage-card-container {
                        width: 100% !important;
                        // overflow: scroll;

                        .consulting-advantage-card {
                            margin: 0 12px !important;
                            flex-shrink: 0;
                        }
                    }
                }
            }
        }
        @media (max-width: 768px) {
            .consulting-header {
                padding-left: 40px !important;
            }
            .consulting-text-info  {
                padding: 100px 40px !important;
            }
            .consult-advantage-card-container {
                .consult-cards-row-a {
                    padding: 0 24px !important;
                }
            }
        }
        @media (max-width: 549px), (width: 549px) {
            .consulting-header {
                padding-left: 24px !important;

                .consulting-header-slogan-b {
                    top: -70px !important;
                }
                .page-header-anton-font {
                    font-size: 60px!important;
                    line-height: 80px;
                }
            }
            .consulting-text-info  {
                width: 100% !important;
                padding: 100px 24px !important;
            }
            .consult-advantage-card-container {
                .consulting-advantage-card-container {
                    overflow: scroll;
                }
            }
        }
    }
</style>
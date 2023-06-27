<template>
    <div>
        <!-- <navTop v-if="!responseMini" inversebase></navTop>
        <navTopRes v-if="responseMini" inversebase></navTopRes> -->
        <div class="bp-about-us">
            <div class="about-us-header">
                <bpImg :src="headerImg" class="above-data-detail-header-img"></bpImg>
                <bpText class="ph-body-small-inverse top-breadcrumb">
                    <span class="mr-0" @click="toHome">{{translation_data.home}}</span>
                    <span class="mr-0">/</span>
                    <span>{{translation_data.aboutUs}}</span>
                </bpText>
                <bpText class="page-header-anton-font">{{translation_data.aboutUsEn}}</bpText>
                <bpText class="about-us-header-slogan-b">{{translation_data.aboutUs}}</bpText>
                <bpText class="abount-us-header-slogan-c">{{translation_data.sloganA}}</bpText>
                <bpText class="abount-us-header-slogan-c">{{translation_data.sloganB}}</bpText>
            </div>
            <div class="abount-us-text-info">
                <bpImg :src="aboutUsConnectImg" class="about-us-connect-img"></bpImg>
                <bpText class="abount-us-text-info-title-a">{{translation_data.infoTitleA}}</bpText>
                <bpText class="abount-us-text-info-title-b">{{translation_data.infoTitleB}}</bpText>
                <bpText class="abount-us-text-info-text">{{translation_data.descA}}</bpText>
                <div class="about-us-text-date-row">
                    <div class="about-us-text-data-col">
                        <div class="about-us-text-date-col-line"></div>
                        <bpText class="about-us-text-date-col-a">{{translation_data.numberHospital}}</bpText>
                        <bpText class="about-us-text-date-col-b">{{translation_data.textA}}</bpText>
                    </div>
                    <div class="about-us-text-data-col">
                        <div class="about-us-text-date-col-line"></div>
                        <bpText class="about-us-text-date-col-a">{{translation_data.numberHealthCenter}}</bpText>
                        <bpText class="about-us-text-date-col-b">{{translation_data.textB}}</bpText>
                    </div>
                    <div class="about-us-text-data-col">
                        <div class="about-us-text-date-col-line"></div>
                        <bpText class="about-us-text-date-col-a">{{translation_data.numberInfo}}</bpText>
                        <bpText class="about-us-text-date-col-b">{{translation_data.textC}}</bpText>
                    </div>
                </div>
                <bpText class="about-us-text-desc">{{translation_data.descB}}</bpText>
            </div>
        </div>
         <!-- <bp-page-bottom></bp-page-bottom> -->
    </div>
</template>
<script>
import bpText from '../bp-text'
import bpImg from '../bp-img'
import { staticFilePath } from '../../config/envConfig'
import bpButton from '../bp-button'
// import navTop from '../panel/bp-nav-top'
// import navTopRes from '../panel/bp-nav-top-response'
// import bpPageBottom from '../panel/bp-page-bottom'
export default {
    name: "about-us",
    components: {
        bpText,
        bpImg,
        bpButton
        // navTop,
        // navTopRes,
        // bpPageBottom
    },
    data() {
        return {
            language: '中文', // 中英切换
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            response: false,
            responseMini: false,
            headerImg: `${staticFilePath}` + "/img_detail-page_head_about-us.jpg",
            aboutUsConnectImg: `${staticFilePath}` + "/img_connect_line.svg",
            translation_basedata: {
                cn: {
                    home: "主页",
                    aboutUs: "关于法伯",
                    aboutUsEn: "About Us",
                    sloganA: "十年专注医药数据领域，行业领先的「数据融合与洞见者」",
                    sloganB: "法伯科技，成立于2008年",
                    infoTitleA: "法伯凝聚顶尖数据分析师与数据科学家",
                    infoTitleB: "构建商业智能算法",
                    descA: "自研数据中台，融合医保、招标、处方、病历、检验等多个独家数据源，构建了灵活、高可用、统一、可信赖的医药数据资产，覆盖超过5,000家医院，2,000家社区卫生中心及1亿患者信息。",
                    descB: "法伯秉持数据即服务的理念，以对行业深入的理解力、强大的数据挖掘能力，根据不断变化的市场及政策环境，为企业提供全息数据产品及咨询服务。针对市场监测与预测、营销资源配置与优化、真实世界数据研究等不同应用场景，形成相应的数据解决方案，服务了近百家国内外领先的制药企业及医疗健康机构。",
                    numberHospital: "5,000+",
                    numberHealthCenter: "2,000+",
                    numberInfo: "1亿",
                    textA: "医院",
                    textB: "社区卫生中心",
                    textC: "患者脱敏信息"
                },
                en: {
                    home: "Home",
                    aboutUs: "About Us",
                    aboutUsEn: "About Us",
                    sloganA: "Pharbers, leading fusion and insight in Medical Data,",
                    sloganB: "is devoting to the field of medical data for 10 years, established in 2008.",
                    infoTitleA: "Pharbers Gathers Top Data Analysts and Data Scientists from Mathematic, Medical, and IT industry.",
                    infoTitleB: "Build Business Intelligence Algorithm.",
                    descA: "With self-developed data platform, integrating medicare, tenders, medical examination, and other exclusive data sources, Pharbers builds a highly available, unified, trusted medical data assets, covering more than 5,000 hospitals, 2,000 community health centers and 100 million patient information.",
                    descB: "Pharbers upholds the concept of data as a service, provides enterprises with holographic data products and consulting services, based on our in-depth industry comprehension, strong data mining capabilities, and observation in changing market and policy environments. We offer various data solutions according to different application scenarios, like market monitoring & forecasting, marketing resource allocation & optimization, and Real World Research, served nearly hundreds of leading pharmaceutical companies and healthcare institutions in the domestic and overseas.",
                    numberHospital: "5,000+",
                    numberHealthCenter: "2,000+",
                    numberInfo: "100 million",
                    textA: "Hospital",
                    textB: "Community Health Center",
                    textC: "Patient Desensitization Information"
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
    .bp-about-us {
        width: 100%;
        min-width: 375px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .about-us-header {
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
            .page-header-anton-font {
                font-family: Anton-Regular;
                font-size: 100px;
                color: #FFF;
                letter-spacing: 2.5px;
                background-image: linear-gradient(rgba(255,255,255,.4),rgba(255,255,255,0) 80%);
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .about-us-header-slogan-b {
                height: auto;
                width: auto;
                margin-top: 20px;
                background: 0 0;
                font-size: 40px;
                color: #FFF;
                position: relative;
                top: -95px;
            }
            .abount-us-header-slogan-c {
                height: auto;
                width: auto;
                margin-top: 4px;
                background: 0 0;
                font-size: 24px;
                color: #FFF;
                opacity: .9;
                position: relative;
                top: -50px;
            }
        }
        .abount-us-text-info {
            height: auto;
            width: 1200px;
            background: 0 0;
            padding: 104px 0 64px;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .about-us-connect-img {
                height: auto;
                width: auto;
                background: 0 0;
                position: absolute;
                top: -40px;
                object-fit: cover;
            }
            .abount-us-text-info-title-a {
                height: auto;
                width: 640px;
                background: 0 0;
                font-size: 24px;
                color: #2D334D;
            }
            .abount-us-text-info-title-b {
                height: auto;
                width: 640px;
                margin-bottom: 32px;
                background: 0 0;
                font-size: 24px;
                color: #2D334D;
            }
            .abount-us-text-info-text {
                height: auto;
                width: 640px;
                margin-bottom: 32px;
                background: 0 0;
                font-size: 16px;
                color: #747789;
            }
            .about-us-text-date-row {
                height: auto;
                width: 640px;
                margin-bottom: 32px;
                background: 0 0;
                padding: 0 40px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .about-us-text-data-col {
                    height: auto;
                    width: 81px;
                    background: 0 0;
                    display: flex;
                    flex-direction: column;
                    .about-us-text-date-col-line {
                        height: 1px;
                        width: 81px;
                        margin-bottom: 21px;
                        background: #161C39;
                        opacity: .12;
                    }
                    .about-us-text-date-col-a {
                        height: auto;
                        width: auto;
                        white-space: nowrap;
                        margin-bottom: 8px;
                        background: 0 0;
                        color: #2D334D;
                        font-size: 24px;
                        font-weight: 200;
                    }
                    .about-us-text-date-col-b {
                        height: auto;
                        width: auto;
                        background: 0 0;
                        color: #A2A5B0;
                        font-size: 12px;
                    }
                }
            }
            .about-us-text-desc {
                height: auto;
                width: 640px;
                background: 0 0;
                font-size: 16px;
                color: #747789;
            }
        }
        @media (max-width: 992px) {
            ::-webkit-scrollbar-thumb {
                background: transparent;
            }
            .about-us-header {
                padding: 0 60px !important;
                .page-header-anton-font {
                    font-size: 60px !important;
                }
            }
            .abount-us-text-info {
                width: 100% !important;
                padding: 100px 16% !important;

                .abount-us-text-info-title-a,
                .abount-us-text-info-title-b,
                .abount-us-text-info-text,
                .about-us-text-date-row,
                .about-us-text-desc {
                    width: 100% !important;
                }
                .about-us-text-date-row {
                    padding: 0 16px !important;
                }
            }
        }
        @media (max-width: 768px){
            .abount-us-text-info {
                padding: 100px 40px !important;
            }
            .about-us-header {
                padding: 0 40px !important;
            }
        }
        @media (max-width: 549px), (width: 549px) {
            .abount-us-text-info {
                padding: 100px 24px !important;
                .page-header-anton-font {
                    line-height: 80px;
                }
            }
            .about-us-header {
                padding-left: 24px !important;
                padding-right: 24px !important;

                .about-us-header-slogan-b {
                    top: -70px !important;
                }
            }
        }
    }
    
</style>
<template>
    <div class="bp-activity-list">
        <div class="activity-list-header">
            <bpImg :src="aboveDataImg" class="above-data-detail-header-img"></bpImg>
            <bpText class="ph-body-small-inverse top-breadcrumb">
                <span class="mr-0" @click="linkToPage('home')">{{translation_data.home}}</span>
                <span class="mr-0">/</span>
                <span>{{translation_data.events}}</span>
            </bpText>
            <bpText class="page-header-anton-font-a"> Event </bpText>
            <bpText class="ph-H-xLarge-inverse">{{translation_data.events}}</bpText>
            <bpText class="ph-H-Large-2-inverse"></bpText>
        </div>
        <bpTabs :allData="allData" :tabArr="translation_data.tabArr" :responseMini="responseMini" @linkToActivity="linkToPage" :tabIndex="tabIndex"></bpTabs>
    </div>
</template>
<script>
import bpText from '../bp-text'
import bpImg from '../bp-img'
import bpButton from '../bp-button'
import { staticFilePath } from '../../config/envConfig'
import bpTabs from '../bp-tabs'
export default {
    name: "",
    components: {
        bpText,
        bpImg,
        bpButton,
        bpTabs
    },
    data() {
        return {
            language: '中文', // 中英切换
            windowWidth: document.documentElement.clientWidth,
            windowHeight: document.documentElement.clientHeight,
            response: false,
            responseMini: false,
            aboveDataImg: `${staticFilePath}` + "/img_event-list_hero_bg.jpg",
            translation_basedata: {
                cn: {
                    home: "主页",
                    events: "活动资讯",
                    activity: "EVENTS",
                    tabArr: [{
                        componentName: "伯云论坛",
                        componentId: "bpPane"
                    },
                    {
                        componentName: "Above Data",
                        componentId: "bpPane"
                    },
                    {
                        componentName: "行业活动",
                        componentId: "bpPane"
                    }]
                },
                en: {
                    home: "Home",
                    events: "Events",
                    activity: "Events",
                    tabArr: [{
                        componentName: "Boyun Forum",
                        componentId: "bpPane"
                    },
                    {
                        componentName: "Above Data",
                        componentId: "bpPane"
                    },
                    {
                        componentName: "Events",
                        componentId: "bpPane"
                    }]
                }
            }
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {}
            }
        },
        tabIndex: {
            type: Number,
            default: 0
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
    .bp-activity-list {
        width: 100%;
        min-width: 375px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .activity-list-header  {
            height: 600px;
            width: 100%;
            padding-left: 100px;
            background: transparent;
            background-image: linear-gradient(rgba(22,28,57,0.5), rgba(22,28,57,0.5));
            background-size: cover;
            display: flex;
            justify-content: center;
            flex-direction: column;
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
            .above-data-detail-header-img {
                height: 600px;
                width: 100%;
                position: absolute;
                z-index: -2;
                left: 0;
                object-fit: cover;
            }
            .page-header-anton-font-a {
                font-family: Anton-Regular;
                font-size: 100px;
                color: #FFF;
                letter-spacing: 2.5px;
                background-image: linear-gradient(rgba(255,255,255,.4),rgba(255,255,255,0) 80%);
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            .ph-H-xLarge-inverse {
                position: relative;
                top: -80px;
                font-size: 40px;
                color: rgba(255,255,255,.9);
            }
        }
        .activity-list-container {
            display: flex;
            flex-direction: column;
            height: auto;
            width: auto;
            background: 0 0;
            padding: 0;
        }
        @media (max-width: 549px), (width: 549px) {
            .activity-list-header  {
                padding-left: 24px !important;
            }
            .activity-list-container {
                align-items: center;
            }
            .page-header-anton-font-a {
                font-size: 60px !important;
                position: absolute;
                top: 140px;
            }
        }
    }
</style>
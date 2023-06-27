<template>
<div>
    <div class="fixed-nav" 
        :class="[inverse ? 'navInverse' : 'nav']"
        :style="bgc"
    >
        <div :class="[
                {borderNone},
                inverse ? 'bordernavInverse' : 'bordernav']" 
            class="nav-border"
        >
            <img :src="inverse ? imgSrcLight : imgSrc" class="bp-img fixed-nav-icon cursor-pointer" @click="toHome" />
            <div class="selectMenu" :class="{'inverseColor': inverse}">
                <bpSelect 
                    :disSelected="true"
                    :src='inverse ? selectSrcLight : selectSrc'
                    :choosed_value="translation_data.choosed_value" 
                    :options_data="translation_data.options_data"
                    :show="selectShow"
                    @linkToPage="linkToPage"
                    @clickEvent="clickEvent"></bpSelect>
                <span class="bp-text" @click="toActivity">{{translation_data.activity}}</span>
                <span class="bp-text topButton" @click="toAboutUs">{{translation_data.aboutUs}}</span>
                <span class="bp-text topButton" @click="toArticles">{{translation_data.articles}}</span>
            </div>
            <div class="navButton" :class="{'inverseColor': inverse}">
                <bpButton :text="translation_data.contactUs" class="concact" @click="contactUs"></bpButton>
                
                <bp-select-vue v-if="isLogin" choosedValue="" :src="isLoginSrc" iconClass="" class="home-user-select">
                    <bp-option-vue :text="translation_data.general" @click="toGeneral" ></bp-option-vue>
                    <bp-option-vue :text="translation_data.logout" @click="logout" ></bp-option-vue>
                </bp-select-vue>
                <bpButton v-else :text="translation_data.login" class="login" @click="toGeneral"></bpButton>
            </div>
        </div>
        <bp-modal-form v-if="contactForm" :translation_data="translation_data" @closeModal="closeModal" @submitClientData="submitClientData"/>
    </div>
    <div class="vue_container fixed-nav-response" 
        :class="[inverse ? 'navInverse' : 'nav']"
        :style="bgc"
    >
        <div 
            :class="[
                {borderNone},
                inverse ? 'bordernavInverse' : 'bordernav']" 
            class="nav-border"
        >
            <img :src="inverse ? imgSrcLight : imgSrc" class="bp-img fixed-nav-icon cursor-pointer" @click="toHome"/>
            <div :class="inverse ? 'response-icon-menu-light' : 'response-icon-menu'" @click="clickMenu"></div>
            <div class="meau-shade" v-if="menu">
            </div>

            <div class="response-menu" v-if="menu">
                <div class="responsee-menu-item" 
                    v-for="item in translation_data.options_data" :key="item.text" @click="runClickEvent(item.click_event)">
                    <span class="ph-H-Small">{{item.text}}</span>
                    <span class="ph-body-xsmall" v-if="item.spanText">{{item.spanText}}</span>
                </div>
                <div class="response-menu-link"
                    v-for="item in translation_data.links_data"
                    :key="item.text"
                    @click="runClickEvent(item.click_event)">
                    <bp-text class="linkItem">{{item.text}}</bp-text>
                </div>
                <bpButton :text="translation_data.contactUs" class="contact-us" @click="contactUs"></bpButton>

                <div v-if="isLogin" class="button-response-group">
                    <bp-text class="ph-H-Small button-response-general" @click="toGeneral">{{translation_data.general}}</bp-text>
                    <bp-text class="ph-H-Small button-response-logout" @click="logout">{{translation_data.logout}}</bp-text>
                </div>
                <bpButton v-else :text="translation_data.login" class="login" @click="toGeneral">{{translation_data.logout}}</bpButton>
            </div>
        </div>
        <bp-modal-form v-if="contactForm" :translation_data="translation_data" @closeModal="closeModal" @submitClientData="submitClientData"/>
    </div>
</div>
</template>

<script>
import bpSelect from '../bp-select.vue'
import bpButton from '../bp-button.vue'
import bpSelectVue from '../bp-select-vue.vue'
import bpOptionVue from '../bp-option-vue.vue'
import { staticFilePath } from '../../config/envConfig'
import bpModalForm from './bp-modal-form.vue'
import bpText from '../bp-text.vue'
export default {
    created() {
        let curLang = window.localStorage.getItem('lang')

        this.language = curLang
    },
    mounted() {
        const that = this
        this.inverse = this.inversebase
        window.onscroll = () => {
            let top = document.scrollingElement.scrollTop; //触发滚动条
            if (top == 0) {
                //回到页面顶部
                that.borderNone = false;
                if(that.inversebase) {
                    that.inverse = true;
                    that.bgc = "background: transparent; transition: all 0.5s;"
                }
            } else {
                //不在页面顶部
                that.borderNone = true;
                that.inverse = false;
                that.bgc = "background: white; transition: all 0.5s;"
            }
        }

        window.addEventListener('setItemEvent', function(e) {
            that.language = e.newValue
        })
    },
    components: {
        bpSelect,
        bpButton,
        bpSelectVue,
        bpOptionVue,
        bpModalForm,
        bpText
    },
    props: {
        inversebase: {
            type: Boolean,
            default: false
        },
        isLogin: {
            type: Boolean,
            default: false
        },
        selectShow: Boolean
    },
    data() {
        return {
            language: '中文',
            borderNone: false,
            contactForm: false,
            menu: false,
            inverse: false,
            bgc: "background: transparent",
            imgSrc: `${staticFilePath}` + "/img_logo_ph_theme.svg",
            imgSrcLight: `${staticFilePath}` + "/img_logo_ph_light.svg",
            selectSrc: `${staticFilePath}` + "/icon_drop.svg",
            selectSrcLight: `${staticFilePath}` + "/icon_drop_light.svg",
            isLoginSrc: `${staticFilePath}` + "/icon_home_user.svg",
            translation_basedata: {
                cn: {
                    MAX: {
                        max: "Max"
                    },
                    consulting: {
                        consult: "循证咨询"
                    },
                    choosed_value: "产品与服务",
                    aboutUs: "关于我们",
                    articles: "行业洞察",
                    activity: "活动资讯",
                    contactUs: "联系我们",
                    login: "登录",
                    general: "法伯数据平台",
                    logout: "退出登录",
                    options_data: [
                        {
                            text: "MAX",
                            spanText: "全息市场监测利器",
                            click_event: function() {
                                this.$emit('linkToPage', 'max')
                            }
                        },
                        {
                            text: "真实数据研究",
                            spanText: "来自患者信息的多视角深度挖掘",
                            click_event: function() {
                                this.$emit('linkToPage', 'rw')
                            }
                        },
                        {
                            text: "循证咨询",
                            spanText: "多层面精准预测，营销资源配置与优化",
                            click_event: function() {
                                this.$emit('linkToPage', 'consulting')
                            }
                        }
                    ],
                    links_data: [
                        {
                            text: "活动资讯",
                            click_event: function() {
                                this.$emit('linkToPage', 'activity-list')
                            }
                        },
                        {
                            text: "关于我们",
                            click_event: function() {
                                this.$emit('linkToPage', 'about-us')
                            }
                        },
                        {
                            text: "行业洞察",
                            click_event: function() {
                                this.$emit('linkToPage', 'articles-list')
                            }
                        }
                    ],
                    modalForm: {
                        download: "下载报告",
                        contactUs: "联系我们",
                        name: "如何称呼您",
                        nameBlank: "请填写您的姓名",
                        company: "您所在的团队",
                        companyBlank: "请填写您的团队名称",
                        department: "您所在的部门",
                        position: "您的职位",
                        email: "您的工作邮箱",
                        emailBlank: "请填写您的邮箱",
                        emailWrong: "邮箱格式有误，请填写正确的邮箱地址",
                        intention: "您感兴趣的内容",
                        dataService: "数据研究服务",
                        submit: "提交",
                        'submit&download': "提交并下载",
                        submitSuccess: "提交成功",
                        submitFeedback: "已收到您的信息，我们将尽快与您联系",
                        ok: "好的"
                    }
                },
                en: {
                    MAX: {
                        max: "MAX©"
                    },
                    consulting: {
                        consult: "Evidence-based Consulting"
                    },
                    choosed_value: "PRODUCTS",
                    aboutUs: "COMPANY",
                    articles: "Industry Insight",
                    activity: "EVENTS",
                    contactUs: "Contact Us",
                    login: "Log in",
                    general: "General",
                    logout: "Logout",
                    options_data: [
                        {
                            text: "MAX©",
                            spanText: "Holographic Market Monitoring Tool",
                            click_event: function() {
                                this.$emit('linkToPage', 'max')
                            }
                        },
                        {
                            text: "Real World Research",
                            spanText: "Multi-perspective Deep Mining from Patient Information",
                            click_event: function() {
                                this.$emit('linkToPage', 'rw')
                            }
                        },
                        {
                            text: "Evidence-based Consulting",
                            spanText: "Multi-level Accurate Prediction Allocating and Optimizing Marketing Resource",
                            click_event: function() {
                                this.$emit('linkToPage', 'consulting')
                            }
                        }
                    ],
                    modalForm:{
                        download: "Download Report",
                        contactUs: "Contact Us",
                        name: "Full Name",
                        nameBlank: "Please enter your first and last name.",
                        company: "Company",
                        companyBlank: "Please enter your company name.",
                        department: "Department",
                        position: "Job Title",
                        email: "Work Email",
                        emailBlank: "Please enter your work email.",
                        emailWrong: "Please enter a vaild email.",
                        intention: "Which one is your interested part?",
                        dataService: "Data Service",
                        submit: "Submit",
                        'submit&download': "Submit and Download",
                        submitSuccess: "Submitted successfully",
                        submitFeedback: "Information received and we will contact you as soon as possible",
                        ok: "OK"
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
    methods: {
        clickMenu() {
            return this.menu = !this.menu
        },
        contactUs() {
            this.contactForm = true
        },
        closeModal() {
            this.contactForm = false
        },
        submitClientData(value) {
            this.$emit('submitClientData', value)
        },
        toAboutUs() {
            this.$emit('linkToPage', 'about-us')
        },
        toArticles() {
            this.$emit('linkToPage', 'articles-list')
        },
        toActivity() {
            this.$emit('linkToPage', 'activity-list')
        },
        toHome() {
            this.$emit('linkToPage', 'home')
        },
        linkToPage(value) {
            this.$emit('linkToPage', value)
        },
        clickEvent(value) {
            this.$emit("event", value)
        },
        toGeneral() {
            window.location.href = "http://general.hubadata.com"
        },
        logout() {
            this.$emit('logout')
        },
        returnToTop() {
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        },
        runClickEvent(click_event) {
            click_event.call(this)
            this.menu = false
        }
    }
};
</script>

<style lang="scss" scoped>
    $spacing-none: 0px;
    $spacing-compact-2x: 2*2px;
    $color-neutrals-n000: #ffffff;
    $color-neutrals-n400: rgba(#091e42,0.71);
    
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    
    .cursor-pointer {
        cursor: pointer;
    }

    .borderNone {
        border-bottom: 0px !important;
    }

    .nav {
        // background: #fff;
        text-align: center;
        font-size: 14px;
    }
    
    .bordernav {
        border-bottom: 1px solid rgba(22, 28, 57, 0.12);
    }
    .bordernavInverse {
        border-bottom: 1px solid rgba(255,255,255,0.12);
    }

    .navInverse {
        // background: transparent;
        text-align: center;
        font-size: 14px;
    }
    .fixed-nav {
        height: 80px;
        width: 100%;
        display: flex;
        flex-direction: row;
        top: 0;
        padding: 0 100px;
        position: fixed;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
        .selectMenu {
            height: auto;
            width: auto;
            background: 0 0;
            color: #FFF;
            font-size: 14px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            display: flex;
            align-content: flex-start;
            padding: 0;
            .bp-select {
                height: 40px;
                width: max-content;
                background: 0 0;
                padding: 0;
                margin: 0;
                position: relative;
                cursor: pointer;
                box-sizing: border-box;
                color: #2D334D;
            }
            .topButton {
                margin-left: 40px !important;
            }
            .bp-select:hover {
                background: transparent;
            }
            .bp-select:focus {
                outline: none;
            }
            /deep/.bp-select .bp-option {
                height: auto;
                min-height: 32px;
                width: 100%;
                background: 0 0;
                color: #344563;
                display: flex;
                padding: 0 16px;
                align-items: center;
                margin-bottom: 16px;
                text-align: left;
            }

            .bp-select .bp-option:hover {
                background-color: #EBECF0;
            }
            /deep/.bp-select-title {
                height: 100%;
                // width: 170px !important;
                width: max-content !important;
                display: flex;
                align-items: center;
                // padding: 0 8px;
                justify-content: space-between;
            }
            /deep/.bp-option-group {
                position: absolute;
                width: max-content !important;
                background: #fff;
                max-width: 300px;
                margin: 0;
                padding: 16px 0 4px 0;
                border-radius: 3px;
                box-shadow: 0 4px 8px -2px rgba(9, 30, 66, 0.25);
            }
            .bp-option:hover {
                background-color: #EBECF0;
            }
            .option-active {
                color: $color-neutrals-n000 !important;
                background-color: $color-neutrals-n400 !important;
            }
            .option-active .icon path {
                fill: $color-neutrals-n000;
            }
            .bp-text {
                height: auto;
                width: auto;
                background: 0 0;
                color: #2D334D!important;
                font-size: 14px;
                letter-spacing: 0;
                margin-left: 32px;
                cursor: pointer!important;
                padding: 0;
            }
        }

        

        .nav-border {
            height: 80px;
            width: 100%;
            display: flex;
            align-content: flex-start;
            align-items: center;
            justify-content: space-between;
        }

        .navButton {
            display: flex;
            align-content: flex-start;
            align-items: stretch;
            justify-content: flex-start;

            .home-user-select {
                width: auto;
                height: auto;
                background: 0 0;

                /deep/.bp-select-title {
                    padding: 0;

                    .svg-icon {
                        width: 24px;
                        height: 24px;
                    }
                }

                /deep/.bp-option-group {
                    position: absolute;
                    font-size: 14px;
                    width: 120px;
                }
            }

            .concact {
                background: #FFDD4D!important;
                border: none;
                border-radius: 40px!important;
                line-height: 32px!important;
                height: 32px!important;
                color: #2D334D!important;
                text-align: center!important;
                display: inline-block!important;
                padding: 0 10px;
                font-size: 14px;
                margin-right: 8px;
            }
            .login {
                color: #2D334D!important;
                border: 1px solid rgba(22,28,57,.12)!important;
                border-radius: 40px!important;
                line-height: 32px!important;
                height: 32px!important;
                width: 80px!important;
                background: 0 0!important;
                text-align: center!important;
                display: inline-block!important;
                font-size: 14px;
            }
        }

        .inverseColor {
            .concact {
                background: #FFF!important;
            }
            .login {
                color: rgba(255,255,255,.9)!important;
                border: 1px solid rgba(255,255,255,.6)!important;
            }
        }
        .inverseColor .bp-text, .inverseColor .bp-select {
            color: #fff !important;
        }
    }
    .fixed-nav-response {
        height: 80px;
        width: 100%;
        display: flex !important;
        flex-direction: row;
        top: 0;
        padding: 0 100px;
        position: fixed;
        justify-content: space-between;
        align-items: center;
        z-index: 1000;
        padding: 0 16px!important;
        
        .nav-border {
            height: 80px;
            width: 100%;
            display: flex;
            flex-direction: row;
            align-content: flex-start;
            align-items: center!important;
            justify-content: space-between;

        }
        .bp-img {
            object-fit: cover;
            cursor: pointer!important;
            pointer-events: all;
        }
        .response-icon-menu {
            width: 24px;
            height: 24px;
            background: url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 10h20v2H1v-2zm0-7h20v2H1V3zm0 14h20v2H1v-2z' fill='%232D334D' fill-rule='evenodd'/%3E%3C/svg%3E") center/100% no-repeat!important;
        }
        .response-icon-menu-light {
            width: 24px;
            height: 24px;
            background: url("data:image/svg+xml,%3Csvg width='22' height='22' viewBox='0 0 22 22' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 10h20v2H1v-2zm0-7h20v2H1V3zm0 14h20v2H1v-2z' fill='%23ffffff' fill-rule='evenodd'/%3E%3C/svg%3E") center/100% no-repeat!important;
        }
        .meau-shade {
            width: 100vw!important;
            // width: 100%;
            height: 100vh!important;
            background: #8b8d9b!important;
            opacity: .8;
            position: absolute;
            top: 80px;
            transform: translateX(-16px);
            overflow: hidden!important;
        }
        .response-menu {
            position: absolute;
            top: 80px;
            background-color: #fff;
            width: 100%!important;
            padding: 40px;
            min-width: 375px;
            left: 0;
            display: flex;
            flex-direction: column;
            align-content: flex-start;
            align-items: stretch;
            justify-content: flex-start;
            height: auto;
            .response-menu-link {
                display: flex;
                justify-content: flex-start;
                border-top: 1px solid #ededf0;
                font-size: 14px;
                color: #2D334D;
                letter-spacing: .35px;
                font-weight: 700;
                .linkItem {
                    margin: 32px 0;
                }
            }
            .response-menu-link:last-of-type {
                border-bottom: 1px solid #ededf0;
                margin-bottom: 32px;
            }
            .responsee-menu-item {
                display: flex;
                flex-direction: column;
                align-content: flex-start;
                align-items: flex-start;
                justify-content: flex-start;
                margin-bottom: 24px;
                height: auto;
                width: auto;
                background: 0 0;
                padding: 0;
            }
            .ph-H-Small {
                height: auto;
                width: auto;
                background: 0 0;
                margin-bottom: 4px;
                font-size: 14px;
                color: #2D334D;
                letter-spacing: .35px;
                font-weight: 700;
                padding: 0;
            }
            .ph-body-xsmall{
                height: auto;
                width: auto;
                background: 0 0;
                font-size: 12px;
                color: #A2A5B0;
                padding: 0;
                text-align: left;
            }
            .contact-us {
                background: #FFDD4D;
                border-radius: 2px;
                border: none;
                width: 100%;
                height: 40px;
                font-size: 14px;
                color: #2D334D;
                letter-spacing: 1px;
                display: block;
                text-align: center;
                margin-bottom: 24px;
                line-height: 24px;
                padding: 0 12px;
                display: flex;
                flex-direction: row;
                align-items: center;
                cursor: pointer;
                outline: 0;
                justify-content: center;
            }
            .login {
                line-height: 40px;
                background: #FFF;
                border-radius: 2px;
                border: 1px solid rgba(22,28,57,.12);
                width: 100%;
                height: 40px;
                font-size: 14px;
                color: #2D334D;
                letter-spacing: 1px;
                display: block;
                text-align: center;
                line-height: 24px;
                padding: 0 12px;
                display: flex;
                flex-direction: row;
                align-items: center;
                cursor: pointer;
                outline: 0;
                justify-content: center;
            }

            .button-response-group {
                padding-top: 4px;
                display: flex;
                flex-direction: column;
                .button-response-general {
                    font-size: 14px;
                    color: #2D334D;
                    letter-spacing: 1px;
                    display: block;
                    text-align: center;
                    line-height: 40px;
                    border-radius: 2px;
                    border: 1px solid rgba(22,28,57,.12);
                    margin-bottom: 24px;
                }

                .button-response-logout {
                    text-align: center;
                }
            }
        }
    }
    @media screen and (max-width: 992px) and (min-width: 769px) {
        ::-webkit-scrollbar-thumb {
            background: transparent;
        }
        .fixed-nav {
            padding: 0 60px !important;
        }
    }
    @media screen and (max-width: 768px) and (min-width: 480px) {
        ::-webkit-scrollbar-thumb {
            background: transparent;
        }
        .fixed-nav, .fixed-nav-inverse {
            padding: 0 40px !important;
        }
    }
    @media (min-width: 549px) {
        .fixed-nav {
            display: flex !important;
        }
        .fixed-nav-response {
            display: none !important;
        }
    }
    @media (max-width: 549px), (width: 549px) {
        .fixed-nav {
            display: none !important;
        }
        .fixed-nav-response {
            display: flex !important;
        }
    }
</style>

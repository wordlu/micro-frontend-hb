<template>
    <div class="vue_container fixed-nav-response" 
        :class="[inverse ? 'navInverse' : 'nav']"
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
</template>
<script>
import bpModalForm from './bp-modal-form.vue'
import bpButton from '../bp-button.vue'
import { staticFilePath } from '../../config/envConfig'
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
                this.borderNone = false;
                if(that.inversebase) {
                    that.inverse = true;
                }
            } else {
                //不在页面顶部
                this.borderNone = true;
                that.inverse = false;
            }
        }

        window.addEventListener('setItemEvent', function(e) {
            that.language = e.newValue
        })
    },
    components: {
        bpModalForm,
        bpButton,
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
        }
    },
    data() {
        return {
            imgSrc: `${staticFilePath}` + "/img_logo_ph_theme.svg",
            imgSrcLight: `${staticFilePath}` + "/img_logo_ph_light.svg",
            menu: false,
            borderNone: false,
            inverse: false,
            contactForm: false,
            language: '中文',
            translation_basedata: {
                cn: {
                    MAX: {
                        max: "Max"
                    },
                    consulting: {
                        consult: "循证咨询"
                    },
                    contactUs: "联系我们",
                    login: "登录",
                    general: "法伯数据平台",
                    logout: "退出登录",
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
                    },
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
                        },
                        {
                            text: "关于我们",
                            click_event: function() {
                                this.$emit('linkToPage', 'about-us')
                            }
                        }
                    ]
                },
                en: {
                    MAX: {
                        max: "MAX©"
                    },
                    consulting: {
                        consult: "Evidence-based Consulting"
                    },
                    contactUs: "Contact Us",
                    login: "Log in",
                    general: "General",
                    logout: "Logout",
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
                    },
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
                        },
                        {
                            text: "COMPANY",
                            click_event: function() {
                                this.$emit('linkToPage', 'about-us')
                            }
                        }
                    ]
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
        toHome() {
            this.$emit('linkToPage', 'home')
            // this.returnToTop()
        },
        toGeneral() {
            window.location.href = "http://general.hubadata.com"
        },
        logout() {
            this.$emit('logout')
        },
        runClickEvent(click_event) {
            click_event.call(this)
            this.menu = false
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
    .borderNone {
        border-bottom: 0px !important;
    }
    .nav {
        background: #fff;
        // border-bottom: 1px solid rgba(22, 28, 57, 0.12);
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
        background: transparent;
        text-align: center;
        font-size: 14px;
    }
    .fixed-nav-response {
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
</style>
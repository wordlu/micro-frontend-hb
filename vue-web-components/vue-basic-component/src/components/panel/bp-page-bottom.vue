<template>
    <div class="page-bottom-part">
        <div class="contact-container">
            <div class="contact-content">
                <div class="contact-slogan-part">
                    <bp-text class="ph-body-medium response-text-center">{{translation_data.contactUs.leadingForHealthcareIndustry}}</bp-text>
                    <bp-text class="ph-H-Large_2 response-text-center">{{translation_data.contactUs.provideSolution}}</bp-text>
                </div>
                <bp-button type="standard" :text="translation_data.contactUs.contactUs" @click="contactUs" class="contact-us-button"></bp-button>
            </div>
        </div>

        <div class="page-bottom">
            <div class="bottom-pharbers">
                <bp-img :src="img1" class="bottom-pharbers-icon"></bp-img>
                <div class="bottom-row-container">
                    <div class="bottom-product-container">
                        <div class="bottom-list-a">
                            <bp-text class="bottom-pharbers-title">{{translation_data.siteMap.productAndService}}</bp-text>
                            <bp-text @click="toMax" class="ph-body-small mb-2 cursor-pointer">{{translation_data.siteMap.max}}</bp-text>
                            <bp-text @click="toRW" class="ph-body-small mb-2 cursor-pointer">{{translation_data.siteMap.realWorldSearch}}</bp-text>
                            <bp-text @click="toConsulting" class="ph-body-small cursor-pointer">{{translation_data.siteMap.consulting}}</bp-text>
                        </div>

                        <div class="bottom-list-b">
                            <bp-text class="bottom-pharbers-title">{{translation_data.siteMap.company}}</bp-text>
                            <bp-text @click="toAboutUs" class="ph-body-small mb-2 cursor-pointer">{{translation_data.siteMap.aboutPharbers}}</bp-text>
                        </div>
                    </div>

                    <div class="bottom-address">
                        <div class="address-bj-part">
                            <bp-text class="ph-body-xsmall-tertiary text-right">{{translation_data.siteMap.companyPhoneBJ}}</bp-text>
                            <bp-text class="ph-body-xsmall-tertiary text-right">{{translation_data.siteMap.companyPositonBJ}}</bp-text>
                            <bp-text class="ph-body-xsmall-tertiary text-right">{{translation_data.siteMap.companyRoomBJ}}</bp-text>
                        </div>
                        <div class="address-sh-part">
                            <bp-text class="ph-body-xsmall-tertiary text-right">{{translation_data.siteMap.companyPhoneSH}}</bp-text>
                            <bp-text class="ph-body-xsmall-tertiary text-right">{{translation_data.siteMap.companyPositonSH}}</bp-text>
                            <bp-text class="ph-body-xsmall-tertiary text-right">{{translation_data.siteMap.companyRoomSH}}</bp-text>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bottom-contact">
                <div class="bottom-contact-left">
                    <bp-text class="ph-body-small mr-3">{{translation_data.siteMap.contactUs}}</bp-text>
                    <bp-text class="ph-body-small mr-3">{{translation_data.siteMap.privacyPolicy}}</bp-text>
                    <bp-select-vue :choosedValue="language" :src="img2" iconClass="select-language-icon" class="select-language">
                        <bp-option-vue text="中文" @click="changeLanguage" :choosedValue="language"></bp-option-vue>
                        <bp-option-vue text="English" @click="changeLanguage" :choosedValue="language"></bp-option-vue>
                    </bp-select-vue>
                </div>

                <div class="bottom-contact-right">
                    <bp-img :src="img3" class="bottom-contact-icon"></bp-img>
                    <bp-img :src="img4" class="bottom-contact-icon"></bp-img>
                </div>
            </div>

            <div class="bottom-copyright">
                <div class="bottom-copyright-left">
                    <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502041501">
                        <div class="online-filing">
                            <bp-img :src="img5" class="presented-logo"></bp-img>
                            <bp-text class="ph-body-xsmall-tertiary">京公网安备11010502041501号</bp-text>
                        </div>
                    </a>
                    <bp-text @click="toMiit" class="ph-body-xsmall-tertiary cursor-pointer">京ICP备15015746号-1</bp-text>
                </div>

                <bp-text class="ph-body-xsmall-tertiary">
                    © Copyright {{nowDate}} Pharbers Co.,Ltd.
                </bp-text>
            </div>
        </div>

        <bp-modal-form v-if="contactForm" :translation_data="translation_data" @closeModal="closeModal" @submitClientData="submitClientData"/>
    </div>
</template>

<script>
import bpText from '../bp-text.vue'
import bpButton from '../bp-button.vue'
import bpModalForm from './bp-modal-form.vue'
import bpImg from '../bp-img.vue'
import bpSelectVue from '../bp-select-vue.vue'
import { staticFilePath } from '../../config/envConfig'
import bpOptionVue from '../bp-option-vue.vue'
export default {
    components: {
        bpText,
        bpButton,
        bpModalForm,
        bpImg,
        bpSelectVue,
        bpOptionVue
    },
    data: function() {
        return {
            contactForm: false,
            language: '中文',
            nowDate: new Date().getFullYear(),
            img1: `${staticFilePath}` + "/img_logo_ph_gray.svg",
            img2: `${staticFilePath}` + "/icon_drop.svg",
            img3: `${staticFilePath}` + "/icon_wechat_copy_2@3x.svg",
            img4: `${staticFilePath}` + "/icon_linkdin.svg",
            img5: `${staticFilePath}` + "/presented_logo.png",
            translation_basedata: {
                cn: {
                    contactUs: {
                        contactUs: "联系我们",
                        leadingForHealthcareIndustry: "医药健康行业领先的数据融合与洞见",
                        provideSolution: "为您提供一体化解决方案"
                    },
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
                    MAX: {
                        max: "Max"
                    },
                    consulting: {
                        consult: "循证咨询"
                    },
                    siteMap: {
                        productAndService: "产品与服务",
                        max: "MAX",
                        realWorldSearch: "真实世界数据研究",
                        consulting: "循证咨询",
                        customers: "客户",
                        scenarios: "场景",
                        useCase: "案例",
                        roles: "角色",
                        company: "公司",
                        aboutPharbers: "关于法伯",
                        aboutUs: "关于我们",
                        companyPhoneBJ: "北京 010-84244216",
                        companyPositonBJ: "北京市 朝阳区 东直门外斜街",
                        companyRoomBJ: "东外五十六号文创园A座 111室",
                        companyPhoneSH: "上海 021-60770988",
                        companyPositonSH: "上海市 虹口区 四川北路108号",
                        companyRoomSH: "星荟中心2号办公楼 8层828单元",
                        contactUs: "联系我们",
                        privacyPolicy: "隐私与政策",
                        ZH: "中文",
                        EN: "English"
                    }
                },
                en: {
                    contactUs: {
                        contactUs: "Contact Us",
                        leadingForHealthcareIndustry: "Leading data fusion and insights in the healthcare industry",
                        provideSolution: "Provide you with integrated solutions"
                    },
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
                    MAX: {
                        max: "MAX©"
                    },
                    consulting: {
                        consult: "Evidence-based Consulting"
                    },
                    siteMap: {
                        productAndService: "PRODUCTS",
                        max: "MAX",
                        realWorldSearch: "Real World Research",
                        consulting: "Evidence-based Consulting",
                        customers: "Customers",
                        scenarios: "Scenarios",
                        useCase: "Use Cases",
                        roles: "Careers",
                        company: "COMPANY",
                        aboutPharbers: "About Pharbers",
                        aboutUs: "About Us",
                        companyPhoneBJ: "Beijing 010-84244216",
                        companyPositonBJ: "#111, Building A, No. 56 Dongwai, Dongzhimenwai Xiejie",
                        companyRoomBJ: "Chaoyang District, Beijing, P.R. China",
                        companyPhoneSH: "Shanghai 021-60770988",
                        companyPositonSH: "#828, Floor 8, Building 2, Xinghui Center, No. 108, North Sichuan Road,",
                        companyRoomSH: "Hongkou District, Shanghai, P.R. China",
                        contactUs: "Contact Us",
                        privacyPolicy: "Privacy and Policy",
                        ZH: "中文",
                        EN: "English"
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
        contactUs() {
            this.contactForm = true
        },
        closeModal() {
            this.contactForm = false
        },
        submitClientData(value) {
            this.$emit('submitClientData', value)
        },
        changeLanguage(value) {
            localStorage.setItem('lang', value)
            // this.$emit('linkToPage', 'home')
            // reload方法在部署到s3时会找不到当前页面报错
            window.location.reload(true)
        },
        toMiit() {
            window.open('https://beian.miit.gov.cn/')
        },
        toMax() {
            this.$emit('linkToPage', 'max')
            // this.returnToTop()
        },
        toRW() {
            this.$emit('linkToPage', 'rw')
            // this.returnToTop()
        },
        toConsulting() {
            this.$emit('linkToPage', 'consulting')
            // this.returnToTop()
        },
        toAboutUs() {
            this.$emit('linkToPage', 'about-us')
            // this.returnToTop()
        },
        returnToTop() {
            document.documentElement.scrollTop = 0
            document.body.scrollTop = 0
        }
    },
    created() {
        let curLang = window.localStorage.getItem('lang')

        this.language = curLang
    },
    mounted() {
        const that = this
        window.addEventListener('setItemEvent', function(e) {
            that.language = e.newValue
        })
    }
}
</script>

<style lang="scss" scoped>
    * {
        letter-spacing: .4px;
        line-height: 1.6;
        box-sizing: border-box;
    }
    a {
        font-size: 14px;
        color: #3373e1;
        line-height: 32px;
        text-decoration: none;
        text-align: center;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    span.ph-body-medium {
        font-size: 16px;
        color: #747789;
    }
    span.ph-body-small {
        font-size: 14px;
        color: #747789;
    }
    span.ph-H-Large_2 {
        font-size: 24px;
        color: #2D334D;
    }
    span.ph-body-xsmall-tertiary {
        font-size: 12px;
        color: #A2A5B0;
    }
    .text-right {
        text-align: right;
    }
    .bp-img {
        object-fit: cover;
    }
    .mb-2 {
        margin-bottom: 8px;
    }
    .mr-3 {
        margin-right: 16px;
    }

    .page-bottom-part {
        height: auto;
        width: 100%;
        background: transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        
        .contact-container {
            height: 313px;
            max-width: 1200px;
            width: 100%;
            background: transparent;
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;

            .contact-content {
                height: 153px;
                width: 914px;
                border-radius: 4px;
                padding: 0 100px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: transparent;
                background-image: conic-gradient(from 90deg,#f9fafe,#e5e7f0);
                background-image: -webkit-linear-gradient(from 90deg,#f9fafe,#e5e7f0);
                background-image: -moz-linear-gradient(from 90deg,#f9fafe,#e5e7f0);
                background:-moz-linear-gradient(top, #f9fafe, #e5e7f0);

                .contact-slogan-part  {
                    height: auto;
                    width: auto;
                    background: transparent;
                    display: flex;
                    flex-direction: column;
                }

                .contact-us-button {
                    height: 40px;
                    width: 137px;
                    padding: 1px 6px;
                    line-height: 32px;
                    border: none;
                    background: #161C39;
                    color: #FFFFFF;
                    font-size: 14px;
                    border-radius: 2px;
                    outline: 0;
                    cursor: pointer;
                    justify-content: center;
                }
            }
        }

        .page-bottom {
            height: auto;
            width: 100%;
            min-width: 375px;
            background: rgba(22,28,57,0.02);
            padding: 100px 100px 0;

            .bottom-pharbers  {
                height: auto;
                width: 100%;
                margin-bottom: 65px;
                background: transparent;
                display: flex;
                flex-direction: column;

                .bottom-pharbers-icon {
                    height: 32px;
                    width: 102px;
                    margin-bottom: 64px;
                    background: transparent;
                }

                .bottom-row-container {
                    display: flex;

                    .bottom-product-container {
                        display: flex;

                        .bottom-list-a {
                            height: auto;
                            width: auto;
                            margin-right: 64px;
                            background: 0 0;
                            display: flex;
                            flex-direction: column;

                            .bottom-pharbers-title {
                                margin-bottom: 24px;
                                color: #161C39;
                                height: auto;
                                width: auto;
                                background: 0 0;
                                font-size: 14px;
                            }
                        }

                        .bottom-list-b {
                            display: flex;
                            flex-direction: column;

                            .bottom-pharbers-title {
                                margin-bottom: 24px;
                                color: #161C39;
                                height: auto;
                                width: auto;
                                background: 0 0;
                                font-size: 14px;
                            }
                        }
                    }

                    .bottom-address {
                        height: auto;
                        width: auto;
                        background: 0 0;
                        flex: 1;
                        display: flex;
                        justify-content: flex-end;
                        align-items: flex-end;

                        .address-bj-part {
                            height: auto;
                            width: auto;
                            margin-right: 24px;
                            background: 0 0;
                            display: flex;
                            flex-direction: column;
                        }

                        .address-sh-part {
                            height: auto;
                            width: auto;
                            background: 0 0;
                            display: flex;
                            flex-direction: column;
                        }
                    }
                }
            }

            .bottom-contact {
                height: auto;
                width: auto;
                padding-bottom: 24px;
                background: 0 0;
                border-bottom: 1px solid #e2e4e7;
                display: flex;
                justify-content: space-between;

                .bottom-contact-left {
                    height: auto;
                    width: auto;
                    background: 0 0;
                    display: flex;

                    .select-language {
                        width: auto;
                        background: 0 0;

                        /deep/.bp-select-title {
                            font-size: 14px;
                            color: #747789;
                            height: 24px;
                            width: max-content;

                            .select-language-icon {
                                padding: 3px;
                                width: 24px;
                                height: 24px;
                            }
                        }

                        /deep/.bp-option-group {
                            width: max-content;

                            .bp-option {
                                font-size: 14px;
                            }
                        }
                    }
                }

                .bottom-contact-right {
                    width: auto;
                    height: auto;
                    background: 0 0;

                    .bottom-contact-icon {
                        height: 24px;
                        width: 24px;
                        margin-left: 24px;
                        background: 0 0;
                    }
                }
            }

            .bottom-copyright {
                height: 97px;
                width: 100%;
                background: 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;

                .bottom-copyright-left {
                    width: 55%;
                    height: auto;
                    display: flex;
                    justify-content: space-between;

                    .online-filing {
                        display: flex;
                        align-items: center;

                        .presented-logo {
                            width: 20px;
                            height: 20px;
                            margin-right: 4px;
                        }
                    }
                }
            }
        }
    }

@media screen and (max-width: 992px) {
    .page-bottom-part {
        .contact-container {
            .contact-content {
                width: 88%;
                height: auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 40px 80px;
                flex-wrap: wrap;
            }
        }

        .page-bottom {
            padding: 100px 60px 0;

            .bottom-pharbers {
                .bottom-row-container {
                    width: 100%;
                    flex-wrap: wrap;

                    .bottom-product-container {
                        width: 375px;
                    }

                    .bottom-address {
                        margin-top: 20px;
                        justify-content: center;

                        .address-bj-part,
                        .address-sh-part {
                            span {
                                text-align: left;
                            }
                        }
                    }
                }
            }
        }
    }        
}

@media screen and (max-width: 768px) {
    .page-bottom-part {
        .contact-container {
            .contact-content {
                width: 90%;
                height: auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 40px 80px;
                flex-direction: column;

                .response-text-center {
                    text-align: center;
                }

                .contact-us-button {
                    margin-top: 24px; 
                }
            }
        }

        .page-bottom {
            padding: 100px 40px 0;

            .bottom-pharbers {
                .bottom-row-container {
                    flex-direction: column;

                    .bottom-address {
                        justify-content: flex-start;
                    }
                }
            }
        }
    }
}

@media screen and (max-width: 480px) {
    .page-bottom-part {
        .contact-container {
            height: 307px;
            .contact-content {
                width: 100%;
                height: auto;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-content: center;
                padding: 40px 0;
                flex-wrap: wrap;
                margin-right: 24px;
                margin-left: 24px;

                .response-text-center {
                    text-align: center;
                }

                .contact-us-button {
                    margin-top: 24px; 
                }
            }
        }

        .page-bottom {
            padding: 100px 16px 0;

            .bottom-copyright {
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;

                .bottom-copyright-left {
                    width: 100%;
                    margin-bottom: 16px;
                }
            }
        }
    }
}
</style>
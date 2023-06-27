<template>
    <div class="download-report-container">
        <bp-text class="ph-body-small-inverse top-breadcrumb cursor-pointer">
            <span @click="breadcrumbReturn" class="ph-body-small">{{translation_data.back}}</span>
        </bp-text>

        <div class="download-report-main">
            <div v-for="(report,index) in allData.reports" :key="index" class="download-report-left">
                <div class="opacity-background"></div>
                <div class="download-report-imgcontainer">
                    <bp-img v-if="report" :src="report.cover.get('path')" class="download-report-img"></bp-img>
                    <div class="download-report-img-mask"></div>
                </div>
                <div v-if="report" class="ph-H-Medium download-report-name">{{report.title}}</div>
                <div class="download-report-desc">
                    <bp-text v-if="report" class="ph-body-small white-pre-line">{{report.description}}</bp-text>
                </div>
            </div>

            <div v-if="successSubmit" class="submit-success">
                <div class="submit-success-inside-container">
                    <div class="submit-success-header">
                        <bp-img :src="img1" class="submit-success-img"></bp-img>
                        <bp-text class="ph-H-Large_2">{{translation_data.submitSuccess}}</bp-text>
                    </div>
                    <bp-text class="ph-body-medium mb-3 submit-success-text">{{translation_data.addWechat}}</bp-text>
                    <div class="submit-success-worker-img">
                        <bp-img :src="img2"></bp-img>
                    </div>
                    <bp-text class="ph-body-medium mb-3 submit-success-text">{{translation_data.email}}</bp-text>
                    <bp-text class="ph-H-Medium mb-2 submit-success-text">contact@hubadata.com</bp-text>
                    <bp-text class="ph-H-Medium submit-success-text">dxfeng@hubadata.com</bp-text>
                </div>
            </div>
            
            <div v-else class="download-report-right">
                <bp-text class="ph-H-Large_2 mb-7">{{translation_data.contactUs}}</bp-text>

                <div class="input-form-container-1">
                    <bp-text class="ph-H-xSmall_bold mb-1">{{translation_data.name}}</bp-text>
                    <bp-input :value="name" placeholder='' size='comfy' states='personal-form' class="ph-body-small" @input="inputEvent($event,'name')"/>
                    <bp-text v-if="nameBlank" class="form-warning-text">{{translation_data.nameBlank}}</bp-text>
                </div>

                <div class="second-row">
                    <div class="input-form-container mb-5">
                        <bp-text class="ph-H-xSmall_bold mb-1">{{translation_data.position}}</bp-text>
                        <bp-input :value="position" placeholder='' size='comfy' states='personal-form' class="ph-body-small" @input="inputEvent($event,'position')"/>
                    </div>

                    <div class="input-form-container mb-5">
                        <bp-text class="ph-H-xSmall_bold mb-1">{{translation_data.company}}</bp-text>
                        <bp-input :value="company" placeholder='' size='comfy' states='personal-form' class="ph-body-small" @input="inputEvent($event,'company')"/>
                        <bp-text v-if="companyBlank" class="form-warning-text">{{translation_data.companyBlank}}</bp-text>
                    </div>
                </div>

                <div class="input-form-container-1">
                    <bp-text class="ph-H-xSmall_bold mb-1">{{translation_data.email}}</bp-text>
                    <bp-input :value="email" placeholder='' size='comfy' states='personal-form' class="ph-body-small" @input="inputEvent($event,'email')"/>
                    <bp-text v-if="emailBlank" class="form-warning-text">{{translation_data.emailBlank}}</bp-text>
                    <bp-text v-else-if="emailWaring" class="form-warning-text">{{translation_data.emailWrong}}</bp-text>
                </div>

                <bp-text class="ph-H-xSmall_bold mb-2">{{translation_data.intention}}</bp-text>
                <div class="intention-content mb-2">
                    <bp-text ref="tag11" :class="[tag1 ? 'official-form-tag-active' : 'official-form-tag', 'ph-body-small', 'mr-2']" @click="toggleTagClass($event, 'tag1')">{{translation_data.max}}</bp-text>
                    <bp-text :class="[tag2 ? 'official-form-tag-active' : 'official-form-tag', 'ph-body-small', 'mr-2']" @click="toggleTagClass($event, 'tag2')">{{translation_data.consult}}</bp-text>
                    <bp-text :class="[tag3 ? 'official-form-tag-active' : 'official-form-tag', 'ph-body-small', 'mr-2']" @click="toggleTagClass($event, 'tag3')">{{translation_data.dataService}}</bp-text>
                </div>
                <bp-textarea :maxlength='140' @input="inputTextarea" class="form-textarea textarea-width"></bp-textarea>

                <bp-text class="ph-body-xsmall mb-3">{{translation_data.tips}}</bp-text>

                <div class="form-submit-button-container" @click="submit">
                    <bp-button :type="responseMini ? 'response-contact-us': 'official-yellow-line-compact'" density='compact' :text="translation_data.submit" class="download-report-button"></bp-button>
                    <img class="button-go" :src="img3" alt="success"/>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import bpText from '../bp-text'
import bpImg from '../bp-img'
import bpButton from '../bp-button'
import { staticFilePath } from '../../config/envConfig'
import bpInput from '../bp-input.vue'
import bpTextarea from '../bp-textarea.vue'
export default {
    name: "",
    components: {
        bpText,
        bpImg,
        bpButton,
        bpInput,
        bpTextarea
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    reports: []
                }
            }
        }
    },
    data() {
        return {
            language: '中文',
            successSubmit: false,
            name: '',
            position: '',
            company: '',
            email: '',
            nameBlank: false,
            companyBlank: false,
            emailBlank: false,
            emailWaring: false,
            intentionTag: [],
            tag1: false,
            tag2: false,
            tag3: false,
            intention: '',
            responseMini: false,
            img1: `${staticFilePath}` + "/icon_success.svg",
            img2: `${staticFilePath}` + "/img_qr_staff.jpg",
            img3: `${staticFilePath}` + "/icon_go.svg",
            translation_basedata: {
                cn: {
                    back: '返回',
                    submitSuccess: "提交成功",
                    addWechat: "感谢您的支持，您可以通过微信添加专业人员进行咨询",
                    email: "或者您可以通过邮箱联系我们",
                    contactUs: "联系我们",
                    name: "如何称呼您",
                    nameBlank: "请填写您的姓名",
                    position: "您的职位",
                    company: "您所在的团队",
                    companyBlank: "请填写您的团队名称",
                    email: "您的工作邮箱",
                    emailBlank: "请填写您的邮箱",
                    emailWrong: "邮箱格式有误，请填写正确的邮箱地址",
                    intention: "您感兴趣的内容",
                    max: "MAX",
                    consult: "循证咨询",
                    dataService: "数据研究服务",
                    tips: "法伯公司仅用这些信息为您提供您请求的的产品或服务，并与您联系以提供您可能感兴趣的相关内容。",
                    submit: "提交"
                },
                en: {
                    back: 'back',
                    submitSuccess: "Submitted successfully",
                    addWechat: "Thanks for supports, you can add a professional via WeChat directly for consulting.",
                    email: "Also, you can contact us through Email :",
                    contactUs: "Contact Us",
                    name: "Full Name",
                    nameBlank: "Please enter your first and last name.",
                    position: "Job Title",
                    company: "Company",
                    companyBlank: "Please enter your company name.",
                    email: "Work Email",
                    emailBlank: "Please enter your work email.",
                    emailWrong: "Please enter a vaild email.",
                    intention: "Which one is your interested part?",
                    max: "MAX©",
                    consult: "Evidence-based Consulting",
                    dataService: "Data Service",
                    tips: "Pharbers will only use your personal information to provide the product or service you requested and contact you with related content that may interest you.",
                    submit: "Submit"
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
        if(document.body.clientWidth <= 480) {
            this.responseMini = true
        } else {
            this.responseMini = false
        }
        window.onresize = function() {
            if(document.body.clientWidth <= 480) {
                that.responseMini = true
            } else {
                that.responseMini = false
            }
        }
        window.addEventListener('setItemEvent', function(e) {
            that.language = e.newValue
        })
    },
    methods: {
        breadcrumbReturn() {
            history.go(-1)
        },
        inputEvent(value, key) {
            this[key] = value
        },
        toggleTagClass(event, tag) {
            let text = event.target.innerHTML
            this[tag] = !this[tag]
            if ( this[tag] && !this.intentionTag.includes(text) ) {
                this.intentionTag.push(text)
            } else if ( !this[tag] && this.intentionTag.includes(text) ) {
                let index = this.intentionTag.indexOf(text)
                this.intentionTag.splice(index,1)
            }
        },
        inputTextarea(value) {
            this.intention = value
        },
        submit() {
            let pattern = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                name = this.name,
                company = this.company,
                email = this.email,
                intention = this.intention,
                position = this.position

            if (name) {
                this.nameBlank = false
            } else {
                this.nameBlank = true
            }

            if (company) {
                this.companyBlank = false
            } else {
                this.companyBlank = true
            }

            if (!email) {
                this.emailBlank = true
            } else if (!pattern.test(email)) {
                this.emailWaring = true
                this.emailBlank = false
            } else {
                this.emailWaring = false
                this.emailBlank = false
            }

            if (name && company && email && pattern.test(email)) {
                this.successSubmit = true

                intention = intention + "\nTag:" + this.intentionTag.join(";")
                let value = {
                    name,
                    company,
                    email,
                    position,
                    intention
                }
                this.$emit('submitClientData', value)
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

    .mr-2 {
        margin-right: 8px;
    }
    .mb-7 {
        margin-bottom: 42px;
    }
    .mb-5 {
        margin-bottom: 32px;
    }
    .mb-3 {
        margin-bottom: 16px;
    }
    .mb-2 {
        margin-bottom: 8px;
    }
    .mb-1 {
        margin-bottom: 4px;
    }
    .ph-body-small-inverse {
        opacity: 0.7;
        font-size: 14px;
        color: #FFFFFF !important;
    }

    .ph-body-small {
        font-size: 14px;
        color: #747789 !important;
    }

    .ph-body-medium {
        font-size: 16px;
        color: #747789 !important;
    }

    .ph-body-xsmall {
        font-size: 12px;
        color: #747789 !important;
    }
    .ph-H-Large_2 {
        font-size: 24px;
        color: #2D334D !important;
    }

    .ph-H-xSmall_bold {
        color: #454A61 !important;
        letter-spacing: 1px;
        font-size: 12px;
        font-weight: 700;
    }
    .ph-H-Medium {
        font-size: 16px;
        color: #2D334D!important;
        font-weight: 700;
    }

    .form-warning-text {
        font-size: 12px;
        color: #FB355E !important;
        letter-spacing: 0;
        position: absolute;
        bottom: -20px;
    }
    
    .cursor-pointer {
        cursor: pointer;
    }

    .download-report-container{
        display: flex;
        justify-content: center;
        margin-top: 80px;

        .top-breadcrumb {
            position: absolute;
            top: 104px;
            width: 100%;
            padding: 0 100px;
            height: 22px;
            display: flex;
            justify-content: flex-start;
        }

        .download-report-main{
            width: 83%;
            margin-top: 64px; //480变40
            position: relative;
            display: flex;
            justify-content: space-between;

            .download-report-left { 
                width: 44%;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-radius: 2px;
                position: relative;
                padding-bottom: 54px;

                .opacity-background{
                    width: 100%;
                    height: 100%;
                    background-image: linear-gradient(145deg, #F9FAFE 0%, #E5E7F0 100%);
                    border-radius: 2px;
                    opacity: 0.6;
                    position: absolute;
                    z-index: -1;
                }

                .download-report-imgcontainer {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-top: 53px;

                    .download-report-img {
                        width: 182px;
                        height: 257px;
                        object-fit: fill;
                        border-radius: 2px;
                    }

                    .download-report-img-mask {
                        width: 162px;
                        height: 257px;
                        position: absolute;
                        border-radius: 2px;
                        background: #747789;
                        z-index: -1;
                        box-shadow: 0 5px 7px 0 rgba(22,28,57,0.36);
                        -webkit-transform-origin:0 242px;
                        -moz-transform-origin:0 242px;
                        -o-transform-origin:0 242px;
                        -webkit-transform:rotate(4deg) translateX(-7px);
                        -moz-transform:rotate(4deg) translateX(-7px);
                        -o-transform:rotate(4deg) translateX(-7px);
                    }
                }

                .download-report-name {
                    width: 82%;
                    text-align: center;
                    margin-top: 32px;
                    justify-content: center;
                }

                .download-report-desc {
                    width: 82%;
                    margin-top: 40px;
                    
                    .white-pre-line {
                        white-space: pre-line;
                    }
                }
            }

            .submit-success {
                width: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;

                .submit-success-inside-container {
                    display: flex;
                    flex-direction: column;

                    .submit-success-header {
                        display: flex;
                        margin-bottom: 81px;

                        .submit-success-img  {
                            height: 40px;
                            width: 35px;
                            margin-right: 16px;
                            background: transparent;
                        }
                    }

                    .submit-success-worker-img {
                        display: flex;
                        object-fit: contain;
                        margin-bottom: 40px;
                        img {
                            width: 185px;
                            height: 185px;
                        }
                    }
                }
            }

            .download-report-right {
                display: flex;
                flex-direction: column;
                position: relative;
                width: 50%;

                .input-form-container-1 {
                    width: 47%;
                    position: relative;
                    margin-bottom: 32px;
                    display: flex;
                    flex-direction: column;

                    .input-personal-form {
                        height: 40px;
                        width: 100%;
                        border: none;
                        border-bottom:  1px solid rgba(22,28,57,0.1);
                        background: rgba(22,28,57,0.01);
                        border-radius: 0;
                        font-size: 14px;
                        color: #747789;
                    }
                }

                .input-form-container {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    position: relative;

                    .input-personal-form {
                        height: 40px;
                        width: 94%;
                        border: none;
                        border-bottom:  1px solid rgba(22,28,57,0.1);
                        background: rgba(22,28,57,0.01);
                        border-radius: 0;
                        font-size: 14px;
                        color: #747789;
                    }
                }

                .second-row {
                    display: flex;
                    justify-content: space-between;
                }
                .textarea-width {
                    width: 536px;
                    max-width: 536px;
                    min-width: 536px;
                }
                .intention-content {
                    display: flex;
                    .official-form-tag {
                        background: #E8E8EB !important;
                        border-radius: 12px;
                        padding: 0 8px;
                        line-height: 24px;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .official-form-tag-active {
                        background: #F5C924 !important;
                        border-radius: 12px;
                        height: 24px;
                        padding: 0 8px;
                        line-height: 24px;
                        cursor: pointer;
                    }
                }

                .form-textarea {
                    height: 80px;
                    width: 100%;
                    margin-bottom: 36px;
                    background: rgba(22,28,57,.01);
                    font-size: 14px;
                    color: #747789;
                    border: none;
                    border-bottom: 1px solid rgba(22,28,57,.1);
                    outline: 0;
                    padding: 8px;
                }

                .form-submit-button-container {
                    height: auto;
                    width: auto;
                    background: transparent;
                    display: flex;

                    .button-official-yellow-line-compact {
                        height: 40px;
                        width: max-content;
                        padding: 0 24px;
                        line-height: 40px;
                        cursor: pointer;
                        text-align: center;
                        outline: 0;
                        background: linear-gradient(45deg,rgba(255,221,77,.5) 0,rgba(255,221,77,.5) 5%,transparent 5%,transparent 50%,rgba(255,221,77,.5) 50%,rgba(255,221,77,.5) 55%,transparent 55%,transparent);
                        background-size: 8px 8px;
                        border: none;
                        font-weight: 700;
                        font-size: 14px;
                        color: #2D334D;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                    }

                    .button-response-contact-us {
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
                    }

                    .button-go {
                        height: 40px;
                        width: 40px;
                        background: #FFDD4D;
                        padding: 6px;
                        cursor: pointer;
                        object-fit: cover;
                    }
                }
            }
        }
    }

@media screen and (max-width: 992px) {
    .download-report-container {

        .top-breadcrumb {
            padding: 0 60px;
        }
    }
}

@media screen and (max-width: 768px) {
    .download-report-container {

        .top-breadcrumb {
            padding: 0 40px;
        }
    }
}

@media screen and (max-width: 480px) {
    .download-report-container {

        .top-breadcrumb {
            padding: 0 16px;
        }

        .download-report-main {
            flex-direction: column;
            width: 83%;
            margin-top: 40px;

            .download-report-left {
                width: 100%;
                margin-bottom: 64px;

                .opacity-background {
                    width: 100% !important;
                }
            }

            .submit-success {
                width: 100%;

                .submit-success-header {
                    justify-content: center;
                }
                .submit-success-text {
                    text-align: center;
                }
                .submit-success-worker-img {
                    justify-content: center;
                }
            }

            .download-report-right {
                width: 100%;

                .input-form-container-1 {
                    width: 100%;
                }
                .input-personal-form {
                    width: 100%;
                }
                .form-submit-button-container {
                    margin-bottom: 64px;

                    .download-report-button {
                        width: 100%;
                    }
                    .button-go {
                        display: none;
                    }
                }

                .second-row {
                    flex-direction: column;
                }
            }
        }
    }
}
</style>
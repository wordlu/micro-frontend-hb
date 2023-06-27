<template>
    <div class="bp-modal-form">
        <div class="bp-modal-submit-success" v-if="successSubmit">
            <div class="close-button-container">
                <div class="close-button" @click="closeModal"></div>
            </div>
            <div class="bp-modal-submit-content">
                <img class="submit-success-img" :src="img1" alt="success"/>
                <bp-text class="submit-success-text">{{translation_data.modalForm.submitSuccess}}</bp-text>
                <bp-text class="submit-feedback-text">{{translation_data.modalForm.submitFeedback}}</bp-text>
            </div>
            <div class="form-submit-button-container" @click="closeModal">
                <bp-button type='official-yellow-line-compact' density='compact' :text="translation_data.modalForm.ok"></bp-button>
                <img class="button-go" :src="img2" alt="success"/>
            </div>
        </div>

        <div v-else class="bp-modal-form-content">
            <div class="official-width-default mb-5">
                <bp-text class="contact-us-text">{{translation_data.modalForm.contactUs}}</bp-text>
                <div class="close-button" @click="closeModal"></div>
            </div>

            <div class="form-input-container">
                <bp-text class="modalform-name-text">{{translation_data.modalForm.name}}</bp-text>
                <bp-input placeholder="" @input="inputEvent($event,'name')" states='official-form'></bp-input>

                <bp-text v-if="nameBlank" class="form-warning-text">{{translation_data.modalForm.nameBlank}}</bp-text>
            </div>

            <div class="official-width-default">
                <div class="form-input-container">
                    <bp-text class="modalform-name-text">{{translation_data.modalForm.company}}</bp-text>
                    <bp-input placeholder="" @input="inputEvent($event,'company')" states='official-form'></bp-input>

                    <bp-text v-if="companyBlank" class="form-warning-text">{{translation_data.modalForm.companyBlank}}</bp-text>
                </div>

                <div class="form-input-container">
                    <bp-text class="modalform-name-text">{{translation_data.modalForm.department}}</bp-text>
                    <bp-input placeholder="" @input="inputEvent($event,'department')" states='official-form'></bp-input>
                </div>
            </div>

            <div class="official-width-default">
                <div class="form-input-container">
                    <bp-text class="modalform-name-text">{{translation_data.modalForm.position}}</bp-text>
                    <bp-input placeholder="" @input="inputEvent($event,'position')" states='official-form'></bp-input>
                </div>

                <div class="form-input-container">
                    <bp-text class="modalform-name-text">{{translation_data.modalForm.email}}</bp-text>
                    <bp-input placeholder="" @input="inputEvent($event,'email')" states='official-form'></bp-input>

                    <bp-text v-if="emailBlank" class="form-warning-text">{{translation_data.modalForm.emailBlank}}</bp-text>
                    <bp-text v-else-if="emailWaring" class="form-warning-text">{{translation_data.modalForm.emailWrong}}</bp-text>
                </div>
            </div>

            <bp-text class="ph-H-small mb-2">{{translation_data.modalForm.intention}}</bp-text>
            <div class="intention-container mb-2">
                <bp-text ref="tag11" :class="[tag1 ? 'official-form-tag-active' : 'official-form-tag', 'ph-body-small', 'mr-2']" @click="toggleTagClass($event, 'tag1')">{{translation_data.MAX.max}}</bp-text>
                <bp-text :class="[tag2 ? 'official-form-tag-active' : 'official-form-tag', 'ph-body-small', 'mr-2']" @click="toggleTagClass($event, 'tag2')">{{translation_data.consulting.consult}}</bp-text>
                <bp-text :class="[tag3 ? 'official-form-tag-active' : 'official-form-tag', 'ph-body-small', 'mr-2']" @click="toggleTagClass($event, 'tag3')">{{translation_data.modalForm.dataService}}</bp-text>
            </div>
            <bp-textarea class="textarea-width" :maxlength='140' @input="inputTextarea"></bp-textarea>

            <div class="form-submit-button-container" @click="submit">
                <bp-button type='official-yellow-line-compact' density='compact' :text="translation_data.modalForm.submit"></bp-button>
                <img class="button-go" :src="img3" alt="success"/>
            </div>
        </div>
    </div>
</template>

<script>
import bpText from '../bp-text.vue'
import bpButton from '../bp-button.vue'
import bpInput from '../bp-input.vue'
import { staticFilePath } from '../../config/envConfig'
import bpTextarea from '../bp-textarea.vue'
export default {
    components: {
        bpText,
        bpButton,
        bpInput,
        bpTextarea
    },
    data: function() {
        return {
            successSubmit: false,
            name: '',
            company: '',
            department: '',
            position: '',
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
            img1: `${staticFilePath}` + "/icon_success.svg",
            img2: `${staticFilePath}` + "/icon_go.svg",
            img3: `${staticFilePath}` + "/icon_go.svg"
        }
    },
    props: {
        translation_data: Object
    },
    methods: {
        closeModal() {
            this.$emit("closeModal")
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
                department = this.department,
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
                    department,
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
    $color-neutrals-n100: rgba(#091e42,0.54);
    * {
        box-sizing: border-box;
    }
    .mr-2 {
        margin-right: 8px;
    }
    .mb-2 {
        margin-bottom: 8px;
    }
    .mb-5 {
        margin-bottom: 32px;
    }
    span.ph-H-small {
        font-size: 12px;
        color: #161C39;
        opacity: .8;
    }
    span.ph-body-small {
        font-size: 14px;
        color: #747789;
    }
    .bp-modal-form {
        height: 100vh;
        width: 100vw;
        background: $color-neutrals-n100;
        display: flex;
        flex-direction: column;
        position: fixed;
        top: 0;
        right: 0;
        z-index: 9999;
        justify-content: center;
        align-items: center;

        .bp-modal-submit-success {
            height: 392px;
            width: 600px;
            background: #FFF;
            padding: 40px;
            border-radius: 2px;
            position: relative;
            display: flex;
            flex-direction: column;

            .close-button-container {
                display: flex;
                justify-content: flex-end;
                margin-bottom: 32px;

                .close-button {
                    height: 32px;
                    width: 32px;
                    background: 0 0;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    background: url("data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23161C39' fill-rule='nonzero'%3E%3Cpath d='M16.833.5C7.813.5.5 7.813.5 16.833c0 9.021 7.313 16.334 16.333 16.334 9.021 0 16.334-7.313 16.334-16.334C33.167 7.813 25.854.5 16.833.5zm0 1c8.469 0 15.334 6.865 15.334 15.333 0 8.469-6.865 15.334-15.334 15.334-8.468 0-15.333-6.865-15.333-15.334C1.5 8.365 8.365 1.5 16.833 1.5z' opacity='.2'/%3E%3Cpath d='M22.955 11.64l-4.962 4.963 4.962 4.962-.993.993L17 17.595l-4.962 4.963-.993-.993 4.962-4.962-4.962-4.962.993-.993L17 15.61l4.962-4.962.993.993z' opacity='.6'/%3E%3C/g%3E%3C/svg%3E") center/100% no-repeat;
                }
            }

            .bp-modal-submit-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                &::-webkit-scrollbar { 
                    width: 0 !important;
                    display: none;
                }
                -ms-overflow-style: none;

                .submit-success-img {
                    height: 40px;
                    width: 40px;
                    margin-bottom: 32px;
                    object-fit: contain;
                    background: transparent;
                }

                .submit-success-text {
                    font-size: 24px;
                    color: #2D334D;
                    margin-bottom: 16px;
                }

                .submit-feedback-text {
                    font-size: 16px;
                    color: #747789;
                    margin-bottom: 16px;
                }
            }
            
            .form-submit-button-container {
                height: auto;
                width: auto;
                background: transparent;
                position: absolute;
                right: 0;
                bottom: 40px;
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
                    font-weight: 500;
                    font-size: 14px;
                    color: #2D334D;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
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

        .bp-modal-form-content {
            height: 663px;
            width: 600px;
            background: #FFF;
            padding: 40px;
            border-radius: 2px;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            overflow-x: hidden;
            overflow-y: scroll;

            .form-warning-text {
                font-size: 12px;
                color: #FB355E;
                letter-spacing: 0;
                position: absolute;
                bottom: -20px;
            }

            .official-width-default {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .contact-us-text {
                    font-size: 24px;
                    color: #2D334D;
                }

                .close-button {
                    height: 32px;
                    width: 32px;
                    background: 0 0;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    background: url("data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23161C39' fill-rule='nonzero'%3E%3Cpath d='M16.833.5C7.813.5.5 7.813.5 16.833c0 9.021 7.313 16.334 16.333 16.334 9.021 0 16.334-7.313 16.334-16.334C33.167 7.813 25.854.5 16.833.5zm0 1c8.469 0 15.334 6.865 15.334 15.333 0 8.469-6.865 15.334-15.334 15.334-8.468 0-15.333-6.865-15.333-15.334C1.5 8.365 8.365 1.5 16.833 1.5z' opacity='.2'/%3E%3Cpath d='M22.955 11.64l-4.962 4.963 4.962 4.962-.993.993L17 17.595l-4.962 4.963-.993-.993 4.962-4.962-4.962-4.962.993-.993L17 15.61l4.962-4.962.993.993z' opacity='.6'/%3E%3C/g%3E%3C/svg%3E") center/100% no-repeat;
                }
            }

            .form-input-container {
                position: relative;
                margin-bottom: 32px;
                display: flex;
                flex-direction: column;

                .modalform-name-text {
                    font-size: 12px;
                    color: #161C39;
                    opacity: 0.8;
                    margin-bottom: 4px;
                    text-align: start;
                }

                .input-official-form {
                    height: 40px;
                    width: 252px;
                    border: none;
                    border-bottom: 1px solid rgba(22,28,57,.1);
                    background: rgba(22,28,57,.01);
                    border-radius: 0;
                    font-size: 14px;
                    color: #747789;
                }
            }
            .textarea-width {
                width: 536px;
                max-width: 536px;
                min-width: 536px;
            }
            .intention-container {
                display: flex;
                
                .official-form-tag, .official-form-tag-active {
                    border-radius: 12px;
                    padding: 0 8px;
                    line-height: 24px;
                    cursor: pointer;
                }

                .official-form-tag {
                    background: #E8E8EB!important;
                    display: flex;
                    align-items: center;
                }

                .official-form-tag-active {
                    background: #F5C924!important;
                }
            }

            .form-textarea {
                margin-bottom: 36px;
                min-height: 80px;
            }

            .form-submit-button-container {
                height: auto;
                width: 100%;
                background: transparent;
                right: 0;
                bottom: 40px;
                display: flex;
                justify-content: flex-end;
                .button-go  {
                    height: 40px;
                    width: 40px;
                    background: #FFDD4D;
                    padding: 6px;
                    cursor: pointer;
                }
            }
        }
    }

@media screen and (max-width: 768px) {
    .bp-modal-form {
        .bp-modal-submit-success {
            width: 100%;

            .form-submit-button-container {
                position: relative;
                left: 50%;
                top: 0px;
                transform: translateX(-60px);
            }
        }

        .bp-modal-form-content {
            width: 100%;
            height: 70%;
            padding: 24px;

            .official-width-default {
                flex-wrap: wrap;
            }

            .form-input-container {
                width: 100%;

                .input-official-form {
                    width: 100%;
                }
            }

            .form-submit-button-container {
                justify-content: center;
            }
        }
    }
}

@media screen and (max-width: 480px) {
    .bp-modal-form {
        .bp-modal-form-content {
            height: auto;
            padding: 8px 24px;
            -webkit-overflow-scrolling: touch;
            .form-textarea {
                width: 100%!important;
                flex-shrink: 0;
                margin-bottom: 5px!important;
            }
        }
    }
}
</style>
<template>
<div class="upload-area">
    <div class="upload-data-area">
        <div class="header-area">
            <span class="header-title">上传文件</span>
            <img :src="closeIcon" class="icon-close" alt="" @click="cancel">
        </div>
        <div class="upload-content">
            <div class="select">
                <!-- <bp-input placeholder="文件名称" :value="fileName"></bp-input> -->
                <span class="filename-input">{{fileName}}</span>
                <bp-button text="选择文件" @click="selectFile" ></bp-button>
            </div>
            <div class="sheet">
                <span class="title">sheet</span>
                <bp-input placeholder="请输入sheet名称" class="filename-input" @input="inputSheet"></bp-input>
            </div>
            <div class="memo">
                <span class="title">备注</span>
                <bp-textarea class="textarea" placeholder="请输入备注信息" id="" cols="30" rows="10" @input="inputTextarea"></bp-textarea>
            </div>
        </div>
        <div class="button-area">
            <bp-button text="取消" class="cancel" @click="cancel"></bp-button>
            <bp-button text="确认" class="confirm" @click="confirm"></bp-button>
        </div>
    </div>
</div>
</template>

<script>
import bpButton from '../../node_modules/vue-components/src/components/bp-button.vue'
import bpInput from '../../node_modules/vue-components/src/components/bp-input.vue'
import bpTextarea from '../../node_modules/vue-components/src/components/bp-textarea.vue'
import { staticFilePath } from '../config/envConfig'


export default {
    components: {
        bpButton,
        bpInput,
        bpTextarea
    },
    data() {
        return {
            closeIcon: `${staticFilePath}` + "/icon_close.svg",
            memo: "",
            classNames: false,
            sheet: ""
        }
    },
    props: {
        uploadData: {
            type: Object,
            default: function () {
                return {}
            }
        },
        fileName: String
    },
    computed: {},
    methods: {
        cancel() {
            this.$emit("cancel")
        },
        selectFile() {
            this.$emit("selectFile")
        },

        inputTextarea(value) {
            this.memo = value
        },
        inputSheet(value) {
            this.sheet = value
        },
        confirm() {
            if(!this.memo || this.momo == '') {
                alert("请输入备注信息")
            }else if(!this.sheet || this.sheet == '') {
                alert("请输入sheet名称")
            } else {
                this.$emit("confirm", this.memo, this.sheet)
            }
        }
    }
}
</script>

<style lang="scss">
* {
    box-sizing: border-box;
}
.textarea-border {
    border-color: red !important;
}
.upload-area {
    height: 100vh;
    width: 100vw;
    background: rgba(37, 35, 45, 0.55);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9999;
    justify-content: center;
    align-items: center;
    .upload-data-area {
        height: 375px;
        width: 400px;
        background: #FFFFFF;
        border-radius: 2px;
        overflow-y: auto;
    }
    .header-area {
        height: 56px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 20px 12px;
        .icon-close {
            cursor: pointer;
        }
        .header-title {
            font-family: SFProText-Regular;
            font-size: 16px;
            color: #25232D;
            letter-spacing: 0.25px;
            line-height: 24px;
            font-weight: 400;
        }
    }
    .upload-content {
        padding: 20px;
        .filename-input {
            margin-right: 4px;
            width: 276px;
            height: 32px;
            border: 1px solid #E1DFE9;
            border-radius: 2px;
            display: flex;
            align-items: center;
            font-family: PingFangSC-Light;
            font-size: 14px;
            color: #706F79;
            letter-spacing: 0.25px;
            line-height: 20px;
            font-weight: 200;
            padding-left: 4px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .sheet {
            display: flex;
            flex-direction: column;
            margin-bottom: 10px;
            input {
                width: 360px !important;
            }
        }
        .select {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            button {
                width: 85px;
                height: 32px;
                background: #f6f6f7;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #57565F;
                letter-spacing: 0;
                text-align: center;
                line-height: 20px;
                font-weight: 500;
                display: flex;
                justify-content: center;
                align-items: center;
            }
        }
        .title {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #706F79;
            letter-spacing: 0.25px;
            text-align: left;
            line-height: 16px;
            font-weight: 400;
            margin-bottom: 4px;
            margin-right: 10px;
        }
        .memo {
            display: flex;
            flex-direction: column;
            .textarea {
                width: 360px;
                height: 80px;
                border: 1px solid #E1DFE9;
                border-radius: 2px;
            }
        }
    }
    .button-area {
        display: flex;
        justify-content: flex-end;
        margin-right: 20px;
        margin-top: 12px;
        button {
            width: 80px;
            height: 32px;
            font-family: PingFangSC-Medium;
            font-size: 14px;
            letter-spacing: 0;
            text-align: center;
            line-height: 20px;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .cancel {
            background: none;
            color: #57565F;
        }
        .confirm {
            background: #7163C5;
            color: #FFFFFF;
        }
    }
}
</style>

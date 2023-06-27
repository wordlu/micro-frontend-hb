<template>
    <div class="prepare">
        <div class="prepare_header">
            <div class="header_left">
                <img :src="prepare_icon" alt="">
                <span>Prepare</span>
            </div>
            <div class="header_right">
                <button class="save" @click="save">保存</button>
            </div>
        </div>
        <div class="prepare_tab">
            <span class="tab">
                设置
            </span>
            <span>|</span>
            <span class="tab">
                输入/输出
            </span>
        </div>
        <div class="content">
            <div class="prepare_content">
                <div class="form_item">
                    <span class="item_title">筛选行:</span>
                    <textarea class="row_text" cols="100" rows="15" v-model="rowParams"> </textarea>
                </div>
                <div class="form_item">
                    <span class="item_title">筛选列:</span>
                    <textarea class="col_text" cols="100" rows="10" v-model="colParams"> </textarea>
                </div>
                <div class="form_item">
                    <span class="item_title">将 “nan”与“null”替换为:</span>
                    <div class="input_area">
                        <textarea class="param_text" cols="100" rows="3" v-model="changeParams"> </textarea>
                        <div class="note">
                            <img :src="error_icon" alt=""> 
                            若无替换内容，含有“nan”与“null”的行将被删除。
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { staticFilePath } from '../config/envConfig'

export default {
    data: ()=> {
        return {
            prepare_icon: `${staticFilePath}` + "/icons/prepare%E6%AD%A3%E5%B8%B8.svg",
            error_icon: `${staticFilePath}` + "/icons/error.svg",
            rowParams: '[{"key": ["=", "value"]}]',
            colParams: '["col1", "col2"]',
            changeParams: "value"
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
    watch: {
        "allData.operatorParameters": function() {
            console.log(this.allData.operatorParameters)
            if(this.allData.operatorParameters && this.allData.operatorParameters.length > 0) {
                this.rowParams = JSON.stringify(this.allData.operatorParameters[1])
                this.colParams = JSON.stringify(this.allData.operatorParameters[3])
                this.changeParams = this.allData.operatorParameters[5]
            }
        }
    },
    methods: {
        isJSON_test(str) {
            if (typeof str == 'string') {
                try {
                    this.jsonValue = JSON.parse(str);
                    return true;
                } catch(e) {
                    if(str != "") {
                        alert("筛选行和筛选列需要输入JSON字符串！")
                        return false;
                    } else {
                        return true
                    }
                }
            }
        },
        save() {
            const event = new Event("event")
            this.rowParams = this.rowParams === "" ? "[]" : this.rowParams
            this.colParams = this.colParams === "" ? "[]" : this.colParams
            let rowParams = this.isJSON_test(this.rowParams)
            let colParams = this.isJSON_test(this.colParams)
            if(rowParams === true && colParams === true) {
                event.args = {
                    callback: "prepare",
                    element: this,
                    param: {
                        name: "prepare",
                        rowParams: JSON.parse(this.rowParams),
                        colParams: JSON.parse(this.colParams),
                        changeParams: this.changeParams,
                        projectId: this.allData.projectId,
                        projectName: this.allData.projectName,
                        message: this.allData.message
                    }
                }
                console.log(event)
                this.$emit('event', event)
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    .prepare {
        box-sizing: border-box;
        .prepare_header {
            height: 48px;
            padding: 0 15px;
            border-bottom: 1px solid #cccccc;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .header_left {
                display: flex;
                align-items: center;
                img {
                    width: 30px;
                    height: 30px;
                    margin-right: 10px;
                }
                span {
                    font-size: 20px;
                    color: #000000;
                    letter-spacing: 0.21px;
                    font-weight: 600;
                }
            }
            .header_right {
                button {
                    width: 65px;
                    height: 26px;
                    border: 1px solid #57565F;
                    border-radius: 2px;
                    background: none;
                    cursor: pointer;
                }
            }
        }
        .prepare_tab {
            height: 35px;
            border-bottom: 1px solid #cccccc;
            padding: 0 20px;
            display: flex;
            align-items: center;
            .tab {
                padding: 0 15px;
                cursor: pointer;
                font-size: 14px;
                color: #000000;
                letter-spacing: 0.15px;
                font-weight: 400;
            }
        }
        .content {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 100px;
            .prepare_content {
                display: flex;
                flex-direction: column;
                .form_item {
                    display: flex;
                    flex-wrap: nowrap;
                    // align-items: center;
                    margin-bottom: 50px;
                    .item_title {
                        display: block;
                        width: 100px;
                        text-align: left;
                        margin-right: 14px;
                        font-size: 14px;
                        color: #000000;
                        letter-spacing: 0.12px;
                        font-weight: 600;
                    }
                    textarea {
                        resize: none;
                        border: 1px solid #ccc;
                        border-radius: 4px;
                    }
                    .input_area {
                        display: flex;
                        flex-direction: column;
                        .note {
                            margin-top: 10px;
                            font-size: 12px;
                            color: #EE3E70;
                            letter-spacing: 0.1px;
                            font-weight: 700;
                            display: flex;
                            align-items: center;
                            img {
                                width: 14px;
                                height: 14px;
                                margin-right: 5px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
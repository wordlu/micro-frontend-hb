<template>
    <div class="text-dialog">
        <div class="text_dialog_container">
            <div class="dialog_area">
                <div class="data_id">
                    <span>数据 ID:</span>
                    <div class="data_id_space">
                        <input ref="dataid" type="text" v-model="dataID" @change="inputStrChecked(dataID, 'dataid', 'dataID')">
                    </div> 
                </div>
                <div class="upload_ds">
                    <input  @click="radio('dataSet')" type="radio" class="radio" name="radio" ref="radioData" :checked="radioState == 'dataSet'">
                    <span class="up"  @click="radio('dataSet')">上传到数据集:</span>
                    <div @click="toggle">
                        <div class="input">
                            <p ref="dataSet">{{newData}}</p>
                        </div>
                        <div class="icon" >
                            <img :src="dropDownIcon">
                        </div>
                    </div>
                    <div class="dialog" v-if="showDialog" ref="toggle">
                        <p class="dialog_select" v-for="(item,index) in datasetArr" :key="index">
                            <span @click="select" class="dialog_select_span">{{item.name}}</span>
                        </p>
                    </div>
                </div>
                <div class="new_dataset">
                    <input type="radio" class="radio" name="radio"  ref="radioNew" :checked="radioState == 'newData'" @click="radio('newData')">
                    <span @click="radio('newData')">新建数据集:</span>
                    <div class="new_dataset_space">
                        <input type="text" ref="newData" v-model="newDataName" :disabled="true" @change="inputStrChecked(newDataName, 'newData', 'newDataName')">
                    </div>
                </div>
                <div class="btn">
                    <button @click="close">取消</button>
                    <button class="confirm" @click="confirm">确定</button>
                </div>
            </div>
            <div class="dialog" v-if="showDialog">
                <span></span>
            </div>
        </div>
    </div>
</template>

<script>
import { staticFilePath } from '../config/envConfig'

export default {
    data() {
        return {
            dropDownIcon: `${staticFilePath}` + "/xiala.svg",
            showDialog: false,
            newData: '', 
            newDataName: '',
            dataID: '',
            radioState: ''
        }
    },
    methods: {
        // 验证输入字符串时候的特殊字符
        inputStrChecked(value, ref, name) {
            // let r = /[(|)|（|）| 【|】| @ # $ % & * ^ \ - = ——\[|\] ]/;、
            // 只允许输入数字、字母、汉字、下划线
            let r = /^[a-zA-Z0-9_^\u4E00-\u9FA5]{1,}$/
            if (r.test(value)) {
                if(value.length > 30) {
                    this.$refs[ref].value = ""
                    this[name] = ""
                    alert("输入内容过长！")
                    return false;
                }
                return value
            } else {
                this.$refs[ref].value = ""
                this[name] = ""
                alert("请勿输入特殊字符！")
                return false;
            }
        },
        toggle() {
            if(this.$refs.radioData.checked) {
                this.showDialog = !this.showDialog
            }
        },
        close() {
            this.$emit('closeDialog')
        },
        select(e) {
            this.newData = e.target.innerHTML
            this.showDialog = false
        },
        confirm() {
            if(this.newData == '' && this.newDataName == '') {
                alert('数据集不能为空！')
                return false
            } else if(this.dataID == '') {
                alert('数据ID不能为空！')
            } else {
                const event = new Event("event")
                event.args = {
                    callback: "uploadFiles",
                    element: this,
                    param: {
                        files: this.fileList,
                        property: {
                            dataID: this.dataID,
                            dataset: this.radioState === 'dataSet' ? this.newData : this.newDataName,
                            type: this.$refs.radioData.checked ? "selectDataset" : "createDataset"
                        }
                    }
                }
                this.$emit('uploadFilesEvent', event)
                // this.$router.push('/excel-column-clean')
            }
        },
        radio(state) {
            this.radioState = state
            this.showDialog = false
            if(state === 'dataSet') {
                this.$refs.newData.disabled = true
                this.$refs.dataSet.disabled = false
                this.newDataName = ''
            }else if(state === 'newData'){
                this.$refs.dataSet.disabled = true
                this.$refs.newData.disabled = false
                this.newData = ''
                this.data = []
            }
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        datasetArr: {
            type: Array,
            default: function() {
                return []
            }
        },
        fileList: {
            type: Array,
            default: function() {
                return []
            }
        }
    }	
}
</script>

<style lang="scss" scoped>
* {
    padding: 0;
    margin: 0;
}
.text_dialog_container {
    height: 100vh;
    width: 100vw;
    background: rgba(37,35,45,0.55);
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
    .dialog_area {
        position: absolute;
        width: 500px;
        height: 287px;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 2px solid #9b9b9b;
        background: #ffffff;
        .data_id {
            display: flex;
            margin-left: 72px;
            margin-top: 41px;
            align-items: center;
            span {
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #000000;
                font-weight: 600;
            }
            .data_id_space {
                width: 200px;
                height: 30px;
                border: 1px solid #979797;
                margin-left: 66px;
                input {
                    outline: none;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    border: 0;
                    color: #000000;
                    font-weight: 600;
                    margin-left: 10px;
                    // line-height: 24px;
                }
            }
        }
        .upload_ds {
            display: flex;
            position: relative;
            margin-left: 40px;
            margin-top: 40px;
            align-items: center;
            cursor: pointer;
            .warning {
                color: red;
            }
            .up {
                margin-left: 10px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #000000;
                font-weight: 600;
                margin-left: 10px;
            }
            .input {
                width: 200px;
                height: 30px;
                border: 1px solid #979797;
                margin-left: 37px;
                p {
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #000000;
                    font-weight: 600;
                    margin-left: 10px;
                    line-height: 24px;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    padding-right: 10px;
                }
            }
            .icon {
                position: absolute;
                top: 4px;
                right: 120px;
                // width: 26px; 
                height: 18px;
                img {
                    width: 12px;
                    height: 12px;
                }
            }
            .dialog {
                position: absolute;
                top: 25px;
                right: 104px;
                width: 206px;
                height: 100px;
                overflow-y: auto;
                overflow-x: hidden;
                border: 1px solid #979797;
                background: white;
                .dialog_select {
                    width: 200px;
                    height: 24px;
                    margin: -1px;
                    border: 1px solid #979797;
                    background: #ffffff;
                    span {
                        display: block;
                        width: 100%;
                        height: 100%;
                        font-family: PingFangSC-Medium;
                        font-size: 14px;
                        color: #000000;
                        font-weight: 600;
                        margin-left: 10px;
                    }
                    .dialog_select_span {
                        width: 200px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            
        }
        .new_dataset {
            display: flex;
            margin-top: 40px;
            align-items: center;
            margin-left: 40px;
            cursor: pointer;
            span {
                margin-left: 15px;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #000000;
                font-weight: 600;
            }
            .new_dataset_space {
                width: 200px;
                height: 30px;
                border: 1px solid #979797;
                margin-left: 45px;
                 input {
                    outline: none;
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #000000;
                    font-weight: 600;
                    margin-left: 10px;
                    border: 0;
                    background: none;
                }
            }



        }
        .btn {
            margin-left: 260px;
            margin-top: 27px;
            button {
                display: inline-block;
                width: 80px;
                height: 32px;
                background: #ffffff;
                border: 1px solid #eeedf7;
                color: #000000;
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #7163C5;
                font-weight: 600;
                border-radius: 4px;
            }
            .confirm {
                margin-left: 20px;
                background: #7163c5;
                color: #fff;
            }
        }
    }
}

</style>
<template>
    <div class="eh-container">
        <!-- <div class="project_name_header">
            <p class="project_name" @click="linkToPage('linkToProject')">{{allData.projectName}}</p>
        </div> -->
        <div class="project_name_header heaber_opt">
            <p class="project_name new_upload">New Uploaded File Dataset</p>
            <div class="project-actions">
                <button text="运行" class="run" @click="createDataSetIndex">直接导入数据集</button>
                <button text="运行" class="run" @click="linkToPage('advancedMapping')">使用高级映射</button>
            </div>
        </div>
        <div class="content">
            <div class="eh-title">
                <span>{{allData.fileName}}</span>
            </div>
            <div class="eh-preview">
                <bp-excel ref="excel" viewHeight="25vh"
                    :isNeedPopmenu="false"
                    v-on:countIsReady="totalCountIsReady"
                    :datasource="excelDatasource"
                    :schema="excelSchema"
                    class="excel" />
            </div>
            <div class="eh-control-panel">
                <div class="eh-file-btns">
                    <div class="eh-justify-type">
                        <div class="eh-file-type">
                            <table border="0">
                                <tr>
                                    <td class="left"><span>Type</span></td>
                                    <td><input disabled v-model="typeValue"/></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="eh-refresh-btns">
                        <button @click="skipFirstLine">Update</button>
                        <button @click="skipFirstLine">ReDetect</button>
                    </div>
                </div>

                <div class="eh-header-panel">
                    <div class="eh-first-line-panel">
                        <table border="0">
                            <tr>
                                <td class="left">Skip First Lines</td>
                                <td>
                                    <input type="number" v-model="firstSkipValue" min="0" @blur="skipFirstLine" ref="firstLine"/>
                                </td>
                            </tr>
                            <tr>
                                <td class="left">&nbsp;</td>
                                <td class="skip-first-area">
                                    <input class="skip-first" type="checkbox" min="0" checked disabled/>
                                    <span>Parse next line as column headers</span>
                                </td>
                            </tr>
                            <tr class="skip-next">
                                <td class="left">Skip Next Lines</td>
                                <td><input type="number" v-model="nextSkipValue" @blur="skipNextLine" ref="nextLine"/></td>
                            </tr>
                        </table>
                    </div>
                    <div class="eh-sheet-panel">
                        <span class="radio-title">Select Sheet</span>
                        <div class="radio_arr">
                            <div class="eh-sheet-radio" v-for="(item,index) in sheetArr" :key="index">
                                <input type="radio" name="sheet" :value="item" @change="sheetRadio" v-model="sheet">
                                <label >{{item}}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import bpExcel from '../../../vue-excelv2-component/src/components/ph-excel-container'
import PhExcelPreviewSource from "./model/previewDatasource"
import PhExcelPreviewSchema from "./model/previewSchema"
import PhExcelProxy from "./model/dataproxy"

export default {
    data() {
        return {
            firstSkipValue: 0,
            nextSkipValue: 0,
            sheet: '',
            tmpname: '',
            sheetArr: [],
            showExcel: true,
            typeValue: ''
        }
    },
    props: {
        allData: {
            type: Object,
            default: function() {
                return {
                    fileName: "filename",
                    projectName: "projectName"
                }
            }
        },
        excelDatasource: {
            type: Object,
            default: function() {
                return new PhExcelPreviewSource('2', this.tmpname, this.firstSkipValue, this.nextSkipValue, this.sheet, this)
            }
        },
        excelSchema: {
            type: Object,
            default: function() {
                return new PhExcelPreviewSchema('1')
            }
        },
        dataProxy: {
            type: Object,
            default: function() {
                return new PhExcelProxy('3', this.excelDatasource, this.excelSchema)
            }
        }
    },
    components: {
        bpExcel
    },
    mounted() {
        this.dataProxy.refreshData(this.$refs.excel)
    },
    created() {
        let uriParam = window.location.href
        this.tmpname = uriParam.split("tmpname=")[1].split("&")[0]
        this.excelDatasource.set('tmpname', this.tmpname)
        this.typeValue = this.tmpname.split(".")[1]
    },
    methods: {
        linkToPage(name) {
            const event = new Event("event")
            event.args = {
                callback: "linkToPage",
                element: this,
                param: {
                    "name": name,
                    "projectName": this.allData.projectName,
                    "projectId": this.allData.projectId
                }
            }
            this.$emit('event', event)
        },
        createDataSetIndex() {
            const event = new Event("event")
            event.args = {
                callback: "createDataSetIndex",
                element: this,
                param: {
                    "fileId": this.allData.tmpname,
                    "skipValue": Number(this.firstSkipValue),
                    "jumpValue": Number(this.nextSkipValue),
                    "fileType": this.allData.tmpname.split('.')[1],
                    "fileSheet": this.sheet,
                    // "fileSheet": 'Sheet1',
                    "fileName": this.allData.filename,
                    "isAppend": false,
                    "destination": this.allData.dataset,
                    "version": this.allData.version, // 需要自己加上
                    "projectName": this.allData.projectName,
                    "projectId": this.allData.projectId
                }
            }
            this.$emit('event', event)
        },
        skipFirstLine(data) {
            if(this.firstSkipValue == '') {
                this.firstSkipValue = 0
            }
            let legalInput = this.inputNumInteger(this.firstSkipValue)
            if(legalInput || this.firstSkipValue === 0) {
                this.excelDatasource.firstSkipValue = Number(this.firstSkipValue)
                this.excelDatasource.sheet = this.sheet
                this.dataProxy.refreshData(this.$refs.excel)
                // this.excelDatasource.refreshData(this.$refs.excel)
            } else {
                this.$refs.firstLine.value = 0
                this.firstSkipValue = 0
            }
        },
        skipNextLine(data) {
            if(this.nextSkipValue == '') {
                this.nextSkipValue = 0
            }
            let legalInput = this.inputNumInteger(this.nextSkipValue)
            if(legalInput || this.nextSkipValue === 0) {
                this.excelDatasource.nextSkipValue = Number(this.nextSkipValue)
                this.excelDatasource.sheet = this.sheet
                // this.excelDatasource.refreshData(this.$refs.excel)
                this.dataProxy.refreshData(this.$refs.excel)
            } else {
                this.$refs.nextLine.value = 0
                this.nextSkipValue = 0
            }
        },
        sheetRadio(data) {
            this.sheet = data.target.defaultValue
            this.excelDatasource.firstSkipValue = Number(this.firstSkipValue)
            this.excelDatasource.nextSkipValue = Number(this.nextSkipValue)
            this.excelDatasource.sheet = this.sheet
            // this.excelDatasource.refreshData(this.$refs.excel)
            this.dataProxy.refreshData(this.$refs.excel)
        },
        //正整数判断
        inputNumInteger(value) {
            let r = /^\d*$/;
            if (r.test(value)) {
                return value
            } else {
                value = ''
                alert("请输入一个正整数")
                return false;
            }
        },
        totalCountIsReady(val) {
            console.log(val)
        }
    }
}
</script>

<style lang="scss" scoped>
    .eh-container {
        display: flex;
        flex-direction: column;
        .heaber_opt {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .run {
                // width: 80px;
                height: 32px;
                font-weight: 600;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                background: #7163C5;
                color: #ffffff;
            }
        }
        .project_name_header {
            height: 50px;
            // width: 100%;
            border-bottom: 2px solid #ccc;
            padding-right: 20px;
            .project_name {
                margin-left: 30px;
                font-family: PingFangSC-Medium;
                font-size: 16px;
                color: #000000;
                font-weight: 600;
                cursor: pointer;
            }
            .new_upload {
                font-size: 14px;
            }

            .project-actions {
                display: flex;
                flex-direction: row;
                button {
                    cursor: pointer;
                }
            }
        }
        .content {
            height: calc(100vh - 110px);
            background: #f7f7f7;
            padding: 0 20px;
            input {
                box-sizing: border-box;
                line-height: 24px;
                height: 26px;
                margin: 0;
                padding: 0px 4px;
                vertical-align: middle;
                border-radius: 0;
                width: 206px;
                background-color: #ffffff;
                border: 1px solid #cccccc;
            }
            .eh-first-line-panel {
                .skip-next {
                    height: 60px;
                }
                .skip-first-area {
                    display: flex;
                    align-items: center;
                    .skip-first {
                        width: 13px;
                        height: 13px;
                        margin-right: 5px;
                    }
                }
            }
            .eh-sheet-panel {
                input {
                    width: 13px;
                    height: 13px;
                    margin-bottom: 10px;
                }
                .radio-title {
                    margin-bottom: 10px;
                }
                .radio_arr {
                    height: 140px;
                    overflow: auto;
                }
            }
        }
        .eh-title {
            display: flex;
            flex-direction: row-reverse;
            margin-right: 10px;
            margin-bottom: 20px;
            margin-top: 10px;
            font-size: 10px;
            text-align: right;
            line-height: 14px;
        }
        .eh-preview {
            width: 100%;
            overflow: auto;
            .excel {
                display: inline-grid;
                margin: 10px;
                overflow: auto;
                width: 98%;
            }
        }
        .eh-control-panel {
            display: flex;
            flex-direction: column;
            height: 300px;
            background: #fff;
            border: 1px solid #dddddd;
            margin: 10px 0;
            padding: 10px;
            font-size: 13px;
            color: #444444;
            .eh-file-btns {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 66px;
                margin: 10px 0;
                .eh-justify-type {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;

                    .eh-file-type {
                        td.left {
                            width: 250px;
                        }
                        td {
                            width: 400px;
                        }
                    }
                }

                .eh-refresh-btns {
                    display: flex;
                    flex-direction: column;
                    button {
                        width: 80px;
                        height: 26px;
                        margin-bottom: 10px;
                        background-color: #ffffff;
                        color: #333333;
                        border: 1px solid #cccccc;
                        background-image: inherit;
                        box-shadow: none;
                        text-shadow: none;
                        box-sizing: border-box;
                        outline: 0;
                        cursor: pointer;
                    }
                }
            }

            .eh-header-panel {
                margin-top: 20px;
                display: flex;
                flex-direction: row;

                .eh-first-line-panel {
                    display: flex;
                    flex-direction: row;

                    td.left {
                        width: 250px;
                    }

                    td {
                        width: 400px;
                    }
                }

                .eh-sheet-panel {
                    display: flex;
                    flex-direction: column;

                    .eh-sheet-radio {
                        display: flex;
                        flex-direction: row;
                        margin-left: 10px;
                        align-items: center;
                        input {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }

    }
</style>

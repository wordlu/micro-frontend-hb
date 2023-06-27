<template>
    <div class="eh-container-upload">
        <div class="project_name_header heaber_opt">
            <p class="project_name new_upload">New Uploaded File Dataset</p>
            <div class="project-actions">
                <button text="运行" class="run" @click="createDataSetIndex">直接导入数据集</button>
<!--                <button text="运行" class="run" @click="linkToPage('advancedMapping')">使用高级映射</button>-->
                <button text="运行" class="run" >使用高级映射</button>
            </div>
        </div>
        <div class="content">
            <div class="eh-title">
                <span>{{fileName}}</span>
            </div>
            <p>{{dataProxy.progress}}</p>
            <div class="eh-preview" v-if="dataProxy.isCurrentReady">
                <bp-excel ref="excel" viewHeight="25vh"
                    :isNeedPopmenu="false"
                    v-on:countIsReady="totalCountIsReady"
                    :datasource="dataProxy.getDatasource()"
                    :schema="dataProxy.getSchema()"
                    class="excel" />
            </div>
            <div class="eh-control-panel_new">
                <div class="eh-file-btns">
                    <div class="eh-justify-type">
                        <div class="eh-file-type">
                            <table border="0">
                                <tr>
                                    <td class="left"><span>Type</span></td>
                                    <td><input disabled v-model="dataProxy.suffixType"/></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="eh-refresh-btns">
<!--                        <button @click="skipFirstLine">Update</button>-->
<!--                        <button @click="skipFirstLine">ReDetect</button>-->
                    </div>
                </div>

                <div class="eh-header-panel">
                    <div class="eh-first-line-panel">
                        <table border="0">
                            <tr>
                                <td class="left">Skip First Lines</td>
                                <td>
                                    <input type="number" :value="dataProxy.skipFirstLines" @change="skipFirstLinesChanges" min="0" ref="firstLine"/>
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
                                <td><input type="number" :value="dataProxy.skipNextLines" @change="skipNextLinesChanges" min="0" ref="nextLine"/></td>
                            </tr>
                        </table>
                    </div>
                    <div class="eh-sheet-panel">
                        <span class="radio-title">Select Sheet</span>
                        <div class="radio_arr">
                            <div class="eh-sheet-radio" v-for="(item,index) in dataProxy.getSheetNames()" :key="index">
                                <input type="radio" name="sheet" :value="item" @change="sheetRadio" v-model="dataProxy.currentSheet">
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
// import PhExcelPreviewSource from "./model/previewDatasource"
// import PhExcelPreviewSchema from "./model/previewSchema"
import PhExcelProxy from "./model/dataproxy"

export default {
    data() {
        return {
            currentFileIdx: 0,
            fileName: ''
        }
    },
    props: {
        fileList: Array,
        filePath: String,
        activePane: String,
        dsName: String,
        dataID: String,
        destinationType: String,
        dsId: String,
        dsSchema: Array,
        dataProxy: {
            type: Object,
            default: function() {
                return new PhExcelProxy('3', this.activePane, this.fileList)
            }
        }
    },
    components: {
        bpExcel
    },
    mounted() {
        this.dataProxy.projectId = this.getUrlParam("projectId")
        this.dataProxy.projectName = this.getUrlParam("projectName")
    },
    methods: {
        skipFirstLinesChanges() {
            const value = this.$refs.firstLine.value
            this.dataProxy.setSkipFirstLines(parseInt(value))
        },
        skipNextLinesChanges() {
            const value = this.$refs.nextLine.value
            this.dataProxy.setSkipNextLines(parseInt(value))
        },
        createDataSetIndex() {
            /**
             * 1. 将数据分块上传到s3上
             * 2. 将添加数据的索引
             */
            const uuid = this.guid()
            const schemaArray = this.dataProxy.getLocalDatasourceSchema()
            if (this.destinationType === "selectDataset" && JSON.stringify(this.dsSchema) !== JSON.stringify(schemaArray)) {
                alert("schema不匹配！")
                return false
            }
            // to表示上传dataset的路径
            const to = `huba/${this.dataProxy.projectId}/${this.dsName}/version=${this.dataID}`
            this.dataProxy.uploadCurrentData(to)
            const event = new Event("event")
            event.args = {
                callback: "importCurrentDataToDS",
                element: this,
                param: {
                    name: "importCurrentDataToDS",
                    destinationType: this.destinationType,
                    projectId: this.dataProxy.projectId,
                    projectName: this.dataProxy.projectName,
                    dsName: this.dsName,
                    uuid: uuid,
                    dsId: this.dsId,
                    dataID: this.dataID,
                    schemaArray: schemaArray
                }
            }
            this.$emit('importCurrentDataToDS', event)
        },
        guid() {
            return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
                /[xy]/g,
                function (c) {
                    var r = (Math.random() * 16) | 0,
                        v = c == "x" ? r : (r & 0x3) | 0x8
                    return v.toString(16)
                }
            )
        },
        sheetRadio() {
            this.dataProxy.setCurrentSheet(this.dataProxy.currentSheet)
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
        },

        getUrlParam( value) {
            let href = window.location.href
            let paramArr = href.split("?")[1].split("&")
            let data = paramArr.find(item => item.indexOf(value) > -1)
            return data ? decodeURI(data).split("=")[1] : undefined
        },

        getCookie(name) {
            let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg))
                return (arr[2]);
            else
                return null;
        }
    },
    watch: {
        "dataProxy.dataRefresh": function () {
            if (this.$refs.excel) {
                this.$refs.excel.dataRefresh++
            }
        }
    }
}
</script>

<style lang="scss">
    .eh-container-upload {
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
        .eh-control-panel_new {
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

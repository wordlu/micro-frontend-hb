<template>
    <div v-if="stage === 1" >
        <div v-if="allData.uploadType === 'localUpload'">
            <bp-select-file :file-list="fileList"
                            @fileSelected="uploadFileSelected"
                            @fileDeleted="uploadFileDeleted"
                            @confirm="showDestinationDlg = true" />
        </div>
        <div v-else-if="allData.uploadType === 's3Upload'">
            <bp-s3-file
                    :format-value="formatValue"
                    @formatValueChange="formatValueChange"
                    @pathChange="s3PathChange"
                    @confirm="showDestinationDlg = true" />

        </div>
        <next-dialog v-if="showDestinationDlg"
                     @closeDialog="showDestinationDlg = false"
                     :file-list="fileList"
                     :datasetArr="allData.datasetArr"
                     @destinationConfirm="destinationConfirm" />
    </div>
    <div v-else-if="stage === 2">
        <bp-excel-handler
                @importCurrentDataToDS="importCurrentDataToDS"
                :dsName="dataset"
                :dsId="dsId"
                :active-pane="allData.uploadType"
                :file-path="s3path"
                :file-list="fileList"
                :dataID="dataID"
                :destinationType="destinationType"
                :dsSchema="dsSchema"
        />
    </div>

</template>

<script>
import 'element-ui/packages/theme-chalk/lib/index.css'
import BpSelectFile from './select-file'
import BpS3File from './s3-file'
import BpExcelHandler from './bp-excel-handler'
import nextDialog from './next-dialog'
import { hostName } from "../config/envConfig"

export default {
    data() {
        return {
            // currentFileIdx: 0,
            // s3
            s3path: "",
            formatValue: "csv",
            // local
            fileList: [],
            // destination
            showDestinationDlg: false,
            dataID: "",
            dataset: "",
            destinationType: "",
            // stages
            stage: 1,
            dsId: "",
            dsSchema: []
        }
    },
    props: {
        allData: {
            type: Object,
            default: () => ({
                projectName: "demo",
                projectId: "ggjpDje0HUC2JW",
                uploadType: 'localUpload',
                datasetArr: []
            })
        }
    },
    components: {
        BpS3File,
        BpSelectFile,
        BpExcelHandler,
        nextDialog
    },
    mounted() {

    },
    created() {

    },
    methods: {
        importCurrentDataToDS(data) {
            this.$emit('event', data)
        },
        uploadFileSelected(f) {
            this.fileList.push(f)
        },
        uploadFileDeleted(i) {
            this.fileList.splice(i, 1)
        },
        s3PathChange(d) {
            this.s3path = d
        },
        formatValueChange(d) {
            this.formatValue = d
        },
        validation() {
            // TODO: 检验各种参数的正确性
            return true
        },
        getCookie(name) {
            let arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if ((arr = document.cookie.match(reg))) return arr[2];
            else return null;
        },
        async destinationConfirm(data) {
            this.dataID = data.dataID
            this.dataset = data.dataset
            this.destinationType = data.type
            let uploadParam = true
            const url = `${hostName}/hbdydatasource/query`
            const accessToken = this.getCookie("access_token")
            if (this.destinationType === "selectDataset") {
                //选择已有数据集，判断version重复
                const dsData = this.allData.datasetArr.filter(it => it.name === this.dataset)
                this.dsId = dsData[0].id
                this.dsSchema = JSON.parse(dsData[0].schema)
                let body = {
                    table: "version",
                    conditions: {
                        id: ["=", `${this.allData.projectId}_${this.dsId}`],
                        name: ["=", `${this.dataID}`]
                    },
                    limit: 100,
                    start_key: ""
                }
                let options = {
                    method: "POST",
                    headers: {
                        Authorization: accessToken,
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        accept: "application/json"
                    },
                    body: JSON.stringify(body)
                }
                let versionResult = await fetch(url, options).then((res) =>
                    res.json()
                )
                if (versionResult.data && versionResult.data.length > 0) {
                    uploadParam = false
                    alert("数据ID重复，请重新输入！")
                    return false
                }
            } else {
                // 新建数据集判断数据集是否已经存在
                this.allData.datasetArr.forEach((item) => {
                    if (item.name === this.dataset) {
                        uploadParam = false
                        alert("数据集已存在，请在下拉框选择数据集！")
                        throw new Error("数据集已存在")
                    }
                })
            }
            if (uploadParam && this.validation()) {
                this.stage = 2
            }
        }
    }
}
</script>

<style lang="scss" scoped>

</style>

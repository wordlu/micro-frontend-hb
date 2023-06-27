import PhExcelFormat from "./formats/excel"
import PhCsvFormat from "./formats/csv"
import PhDestination from "./s3-destination"
// import { hostName } from "../../config/envConfig"


export default class PhExcelPreviewProxy {
    constructor(id, activePane, fileList, currentFile=0) {
        this.id = id
        this.files = []
        this.readyList = []
        this.suffixType = ""
        this.fileList = fileList
        this.currentFile = currentFile

        this.prepareDatasource(activePane)
        this.isCurrentReady = false

        this.skipFirstLines = 0
        this.skipNextLines = 0
        this.dataRefresh = 0
        this.currentSheet = ""

        this.progress = ""
        this.destination = new PhDestination(this.id)

        this.company_id = "zudIcG_17yj8CEUoCTHg"
    }

    viewNeedRefresh() {
        this.isCurrentReady = this.readyList[this.currentFile]
        this.suffixType = this.files[this.currentFile].getType()
        this.skipFirstLines = this.files[this.currentFile].getSkipFirstLines()
        this.skipNextLines = this.files[this.currentFile].getSkipNextLines()
        this.currentSheet = this.files[this.currentFile].getCurrentSheetName()
        this.dataRefresh++
    }

    prepareDatasource(activePane) {
        if (activePane === "localUpload") {
            return this.prepareLocalDatasource()
        } else if (activePane === "s3Upload") {
            return this.prepareS3Datasource()
        }
    }

    readyCallback(idx) {
        this.readyList[idx] = true
        this.viewNeedRefresh()
    }

    prepareLocalDatasource() {
        for (let index = 0; index  < this.fileList.length; ++index) {
            const item = this.fileList[index]
            const fname = item.name
            const suffix = fname.split('.')[1]
            if (suffix === "xlsx") {
                this.files.push(new PhExcelFormat(index, item, this))
            } else if (suffix === "csv") {
                this.files.push(new PhCsvFormat(index, item, this))
            } else {
                alert("not implemented")
            }
            this.readyList.push(false)
        }
    }

    getLocalDatasourceSchema() {
        const schemas = this.files[this.currentFile].getSchema()
        console.log(schemas)
        let schemaArray = []
        schemas.schema.forEach(item => {
            schemaArray.push({
                src: item ? item.replace(/["'“”‘’]/g, "_") : item,
                des: item ? item.replace(/["'“”‘’]/g, "_") : item,
                type: "String"
            })
        })
        schemaArray.push({
            src: "version",
            des: "version",
            type: "String"
        })
        return schemaArray
    }

    prepareS3Datasource() {
        // TODO: s3 的 以后再调试
        // eslint-disable-next-line no-debugger
    }

    isReady() {
        // return this.readyList[this.currentFile]
        // TODO: ...
        return false
    }

    getDatasource() {
        return this.files[this.currentFile].getDatasource()
    }

    getSchema() {
        return this.files[this.currentFile].getSchema()
    }

    getSheetNames() {
        return this.files[this.currentFile].getSheetNames()
    }

    getCurrentSheetName() {
        return this.files[this.currentFile].getCurrentSheetName()
    }

    setSkipFirstLines(v) {
        if (this.skipFirstLines !== v) {
            this.files[this.currentFile].setSkipFirstLines(v)
            this.viewNeedRefresh()
        }
    }

    setSkipNextLines(v) {
        if (this.skipNextLines !== v) {
            this.files[this.currentFile].setSkipNextLines(v)
            this.viewNeedRefresh()
        }
    }

    setCurrentSheet(v) {
        this.files[this.currentFile].setCurrentSheet(v)
        this.viewNeedRefresh()
    }

    uploadCurrentData(to) {
        this.files[this.currentFile].uploadCurrentData(this.destination, to)
    }

    uploadProgress(progress) {
        this.progress = progress
    }


    getCookie(name) {
        let arr,
            reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if ((arr = document.cookie.match(reg))) return arr[2];
        else return null;
    }
}


import * as XLSX from 'xlsx/xlsx.mjs'
import PhExcelPreviewSource from "../previewDatasource"
import PhExcelPreviewSchema from "../previewSchema"


export default class PhExcelFormat {
    constructor(id, file, proxy) {
        this.id = id
        this.file = file
        this.batchSize = 20
        this.bufferSize= 100

        this.proxy = proxy
        this.sheets = []
        this.currentSheet = ""

        this.reader = new FileReader()
        const that = this
        this.reader.onload = function(e) {
            that.resetDataEvent(e, that)
        }
        this.reader.readAsArrayBuffer(file)

        this.data = {}
    }

    getDatasource() {
        return this.data[this.currentSheet].datasource
    }

    getSchema() {
        return this.data[this.currentSheet].schema
    }

    getSkipFirstLines() {
        return this.data[this.currentSheet].skipFirstLines
    }

    getSkipNextLines() {
        return this.data[this.currentSheet].skipNextLines
    }

    getSheetNames() {
        return this.sheets
    }

    getCurrentSheetName() {
        return this.currentSheet
    }

    getType() {
        return "xlsx"
    }

    resetDataEvent(e, s) {
        const workbook = XLSX.read(e.target.result, {type: "binary"})
        s.sheets = workbook.SheetNames
        s.currentSheet = this.sheets[0]

        for (let idx = 0; idx < this.sheets.length; ++idx) {
            const worksheet = workbook.Sheets[workbook.SheetNames[idx]]
            let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }).slice(0, this.bufferSize)
            data = data.map(x => x.map(x => x.toString()))
            const tmp = {}
            tmp.data = data
            tmp.skipFirstLines = 0
            tmp.skipNextLines = 0
            tmp.headerLine = 0

            tmp.datasource = new PhExcelPreviewSource(this.id)
            tmp.schema = new PhExcelPreviewSchema(this.id)

            this.__headerRefresh(tmp)
            this.__dataRefresh(tmp)
            s.data[workbook.SheetNames[idx]] = tmp
        }
        s.proxy.readyCallback(this.id)
    }

    // 读取所有sheet
    __headerRefresh(tmp) {
        const colsLength = Math.max(...tmp.data.map(x => x.length))
        const header = new Array(colsLength).fill("col") // this.data[tmp.headerLine]
        const ht = [...tmp.data[tmp.headerLine]]
        for (let htIdx = 0; htIdx < header.length; ++htIdx) {
            if (htIdx < ht.length) {
                header[htIdx] = ht[htIdx] ? ht[htIdx].replace(/["'“”‘’]/g, "_") : ht[htIdx]
            } else {
                header[htIdx] = "col_" + (htIdx - ht.length).toString()
            }
        }

        const dtype = new Array(colsLength).fill("Text")
        const colsWidth = new Array(colsLength).fill(118)
        tmp.schema.resetSchema(header, dtype, colsWidth)
    }

    __dataRefresh(tmp) {
        const startPos = tmp.skipFirstLines + 1 + tmp.skipNextLines
        const endPos = tmp.skipFirstLines + 1 + tmp.skipNextLines + this.batchSize
        tmp.datasource.resetData(tmp.data.slice(startPos, endPos))
    }

    setSkipFirstLines(v) {
        this.data[this.currentSheet].skipFirstLines = v
        this.data[this.currentSheet].headerLine = v
        this.__headerRefresh(this.data[this.currentSheet])
        this.__dataRefresh(this.data[this.currentSheet])
    }

    setSkipNextLines(v) {
        this.data[this.currentSheet].skipNextLines = v
        this.__headerRefresh(this.data[this.currentSheet])
        this.__dataRefresh(this.data[this.currentSheet])
    }

    setCurrentSheet(v) {
        this.currentSheet = v
        this.__headerRefresh(this.data[this.currentSheet])
        this.__dataRefresh(this.data[this.currentSheet])
    }

    uploadCurrentData(destination, to) {
        // const data = this.data[this.currentSheet]
        if (!to) {
            to = this.file.name
        }
        // TODO: @wodelu 加入skip lines 的逻辑
        const reader = new FileReader()
        const that = this
        reader.onload = async function(e) {
            const workbook = XLSX.read(e.target.result, {type: "binary"})
            const worksheet = workbook.Sheets[that.currentSheet]
            let data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
            const tmp = that.data[that.currentSheet]
            const startPos = tmp.skipFirstLines + 1 + tmp.skipNextLines
            // const endPos = tmp.skipFirstLines + 1 + tmp.skipNextLines + that.batchSize
            const endPos = data.length
            data = data.slice(startPos, endPos)
            await destination.upload(data, to, new Date().getTime())
            that.proxy.uploadProgress("uploading ended")
        }
        reader.readAsArrayBuffer(this.file)
        that.proxy.uploadProgress("uploading started")
    }
}

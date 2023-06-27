
import { staticFilePath, hostName } from "../../config/envConfig"

export default class PhExcelPreviewSource {
    constructor(id, tmpname, firstSkipValue, nextSkipValue, sheet, par, adapter) {
        this.id = id
        this.par = par
        this.tmpname = tmpname
        this.nextSkipValue = nextSkipValue
        this.firstSkipValue = firstSkipValue
        this.sheet = sheet
        this.data = []
        // this.sort = {}
        // this.filter = {}
        this.name = "not Implemented"
        this.batch_size = 10
        // this.schema = []
        // this.cols = this.schema
        this.url = `${hostName}/schemaexplorer`
        this.debugToken = "5f674a1058c5c0d8ee6b049f07d7d1832dc97ddac7cfe0c9fb6a2dd5430f155f"
        if (!adapter) {
            this.adapter = this.defaultAdapter
        }
    }

    resetUrl(url) {
        this.url = url
    }

    defaultAdapter(row, cols) {
        let result = []
        for (var idx in cols) {
            result.push(row[cols[idx]])
        }
        return result
    }

    buildQuery(ele) {
        let that = this
        const url = this.url
        const accessToken = ele.getCookie("access_token") || this.debugToken
        console.log(this.tmpname)
        let body = {
            "project":"max", //66875db6f287aaa382bd04152b092b90.xlsx
            "tempfile": this.tmpname || "2f18101b999e2d2802d543baf21b92a6.xlsx",
            "sheet": this.sheet || '',
            "out_number": 10,
            "skip_first": Number(this.firstSkipValue) || 0,
            "skip_next": Number(this.nextSkipValue) || 0
        }
        let options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/vnd.api+json",
                "Accept": "application/vnd.api+json",
                "Authorization": accessToken
            },
            body:JSON.stringify(body)
        }
        return fetch(url, options)
    }

    refreshData(ele, page, schema) {
        ele.data = this.data
        ele.dataIsReady++
    }

    proxyRefreshData(ele) {
        // if (schema.schema.length > 0) {
        ele.datasource.buildQuery(ele)
            .then((response) => response.json())
            .then((response) => {
                let sheetsResult =  response
                let sheets = sheetsResult.body
                this.par.sheetArr = sheetsResult.sheets //单选选项
                if(!this.par.sheet || this.par.sheet === '') {
                    this.par.sheet = this.par.sheetArr[0] //默认选中
                }
                //表格数据
                let datas = sheets.length > 0 ? sheets[0] : []
                //表头
                const length = datas.schema.length
                ele.schema.resetSchema(
                    datas.schema,
                    Array(length).fill("Text"),
                    Array(length).fill(118)
                )
                ele.datasource.data = datas.data
                ele.dataRefresh++
            })
    }

    set(key, value) {
        this[key] = value
    }

    queryTotalCount(ele) {
        let that = this
        return new Promise((resolve, reject) => {
            resolve(that.batch_size)
        })
    }
}

import { staticFilePath, hostName } from "../../config/envConfig"

export default class PhDataSource {
    constructor(id, tmpname, adapter) {
        this.id = id
        this.tmpname = tmpname
        this.data = []
        this.sort = {}
        this.filter = {}
        this.name = "not Implemented"
        this.batch_size = 10
        this.schema = []
        this.cols = this.schema
        if (!adapter) {
            this.adapter = this.defaultAdapter
        }
    }

    defaultAdapter(row, schema) {
        let schemas = this
        let arr = []
        schemas.forEach(item => {
            arr.push(row[item])
        })
        return arr
    }

    async buildQuery(ele, isAppend=false) {
        let that = this
        const url = `${hostName}/schemaexplorer`
        const accessToken = ele.getCookie("access_token") || "07c0c42a90d628b4ddbc74c8c72531aeb6813d32402b446e2a22a360dcf88023"
        console.log(this.tmpname)
        let body = {
            "project":"max",
            // "tempfile":"66875db6f287aaa382bd04152b092b90.xlsx",
            "tempfile": this.tmpname || "66875db6f287aaa382bd04152b092b90.xlsx",
            "sheet":"",
            "out_number": 10
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
        let sheetsResult =  await fetch(url, options).then(res => res.json())
        let sheets = sheetsResult.body

        let datas = sheets.length > 0 ? sheets[0] : []
        that.schema = datas.schema
        that.cols = datas.schema
        that.data = datas.data
        return datas.data
    }

    refreshData(ele) {
        let that = this
        ele.datasource.buildQuery(ele)
            .then((response) => {
                // ele.datasource.data = response.map(ele.datasource.adapter, that.schema)
                ele.datasource.data = this.data
                ele.needRefresh++
            })
    }

    appendData(ele) {
        ele.datasource.buildQuery(ele, true)
            .then((response) => {
                // ele.datasource.data = ele.datasource.data.concat(response.map(ele.datasource.adapter))
                ele.datasource.data = this.data
                ele.cur_page++
                ele.needRefresh++
            })
    }
}

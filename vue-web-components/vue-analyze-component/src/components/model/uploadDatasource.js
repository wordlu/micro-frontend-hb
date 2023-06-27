import { staticFilePath, hostName } from "../../config/envConfig"

export default class PhUploadDataSource{
    constructor(id, adapter, url) {
        this.id = id
        this.data = []
        this.projectId = ''
        this.filter = {}
        this.name = ""
        if (!url)
            this.url= `${hostName}/hbolapdatasource`
        if (!adapter)
            this.adapter = this.defaultAdapter
        this.debugToken = "531b7999f8c1ec0739de4574d810168db08d2090c1695226efa2682cff080bb9"
    }

    resetUrl(url) {
        this.url = url
    }

    defaultAdapter(row, cols) {
        let result = []
        for (var idx = 0; idx < cols.length; ++idx) {
            result.push(row[cols[idx]])
        }
        return result
    }

    uploadDatasource(ele) {
        const url = this.url
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            "table": "action",
            "conditions": {
                "projectId": this.projectId
            },
            "limit": 20,
            "start_key": ele
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/json; charset=UTF-8',
                "accept": "application/json"
            },
            body:JSON.stringify(body)
        }
        return fetch(url, options)
    }
}
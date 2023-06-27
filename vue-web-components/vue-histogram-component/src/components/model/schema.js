
import { staticFilePath, hostName } from "../../config/envConfig"

export default class PhExcelDataSchema {
    constructor(id, projectId, datasetName) {
        this.id = id
        this.schema = []
        this.cols = []
        this.dtype = []
        this.cellWidth = []
        this.cols = this.schema
        this.projectId = projectId
        this.name = datasetName
        this.debugToken = "943a2d87af3d5ff226830189339db32e4f8d2c2a5664f5c2b1cf30294b065782"
    }

    resetSchema(schema, dtype, cellWidth) {
        this.schema = schema
        this.dtype = dtype
        this.cellWidth = cellWidth
        this.cols = this.schema
    }

    colWidth(index) {
        return this.cellWidth[index]
    }

    totalWidth() {
        if (this.cellWidth.length > 0)
            return this.cellWidth.reduce((a, v) => a + v)
        else return 0
    }

    buildPolicyQuery(ele, query, schema) {
        const url = `${hostName}/hbolapdatasource`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const tenantId = ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
        let body = {
            "query": "SELECT `name`, `type` FROM system.columns where database='default' and table='"+ this.projectId + "_" + this.name + "';", // TODO:
            // "query": "SELECT `name`, `type` FROM system.columns where database='phmax' and table='ma';",
            "schema": ["name", "type"],
            "projectId": this.projectId,
            "tenantId": tenantId
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        return fetch(url, options)
    }

    async requestSchema(ele) {
        if (this.schema.length === 0) {
            await ele.policy.schema.buildPolicyQuery(ele)
                .then((response) => response.json())
                .then((response) => {
                    const s = []
                    const dt = []
                    for (let idx = 0; idx < response.length; ++idx) {
                        s.push(response[idx].name)
                        dt.push(response[idx].type)
                    }
                    this.resetSchema(s, dt, [])
                })
            return this.schema
        }
        else {
            return this.schema
        }
    }
}

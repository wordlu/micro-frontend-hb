
// import { FunctionChains, eqFilterValueFunctionStep } from "./function_chains"
import { staticFilePath, hostName } from "../../config/envConfig"


export default class PhDataSource {
    constructor(id, projectId, datasetName, adapter=null) {
        this.id = id
        this.sort = {}
        this.filter = {}
        this.projectId = projectId
        this.name = datasetName
        this.batch_size = 100
        if (!adapter)
            this.adapter = this.defaultAdapter
        this.debugToken = "943a2d87af3d5ff226830189339db32e4f8d2c2a5664f5c2b1cf30294b065782"
    }

    defaultAdapter(row, cols) {
        let result = []
        for (let idx = 0; idx < cols.length; ++idx) {
            result.push(row[cols[idx]])
        }
        return result
    }

    buildPolicyQuery(ele, query, schema) {
        const url = `${hostName}/hbolapdatasource`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const tenantId = ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
        let body = {
            "query": query,
            "schema": schema,
            "projectId": this.projectId,
            "tenantId": tenantId
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                "Content-Type": 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        return fetch(url, options)
    }

    refreshPolicyData(ele, policyQuery, policySchema) {
        ele.policy.datasource.buildPolicyQuery(ele, policyQuery, policySchema)
            .then((response) => response.json())
            .then((response) => {
                ele.policy.datasource.data = response //response.map(ele.datasource.adapter)
                // ele.policy.data = response //response.map(ele.datasource.adapter)
                ele.dataIsReady++
            })
    }
}

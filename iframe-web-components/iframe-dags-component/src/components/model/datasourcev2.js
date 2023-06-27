import { staticFilePath, hostName } from "../../config/envConfig"

export default class PhDagDatasource {
    constructor(id, adapter, url) {
        this.id = id
        this.data = []
        this.jobArr = []
        this.name = "demo"
        this.projectId = "ggjpDje0HUC2JW"
        this.title = "need a title"
        this.debugToken = 'a485d935b8705b15d3d49a42b7d8213581fa51ef68fdb142d293e3993474de9b'
        this.sizeHit = [0, 0]
        this.cal = { calculate: {}, selected: [] }
    }

    buildQuery(ele, isAppend=false) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "dag",
            "conditions": {
                "projectId": ["=", ele.projectId],
                "sortVersion": ["begins_with", "developer_"]
            },
            "limit": 200,
            "start_key": {}
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

    

    async refreshData(ele) {
        let that = this

        const response = (await (await ele.datasource.buildQuery(ele)).json())

        that.jobArr = response.data.filter(it => it.attributes.cat === "job" && it.attributes.ctype === "node")
        ele.datasource.data = response.data.filter(x => x["attributes"]["ctype"] === "node")
        // let maxLevel = -999
        ele.datasource.data = ele.datasource.data.map(x => {
            x["id"] = x["attributes"]["represent-id"]
            x["parentIds"] = []
            x["childrenIds"] = []
            x["representId"] = x["attributes"]["represent-id"]
            x["status"] = "normal"
            const cat = x["attributes"]["cat"]
            const runtime = x["attributes"]["runtime"]
            const name = x["attributes"]["name"]
            let result = "dataset"
            if (cat === "dataset" && runtime === "uploaded") {
                result = "DSuploaded"
            } else if (cat === "dataset" && runtime === "intermediate") {
                result = "DSIntermediate"
            } else if (cat === "dataset" && runtime === "input_index") {
                result = "max-in"
            } else if (cat === "dataset" && runtime === "output_index") {
                result = "max-out"
            } else if (cat === "dataset" && runtime === "catalog") {
                result = "catalog"
            } else if (cat === "dataset" && runtime === "shared") {
                result = "DSshared"
            } else if (cat === "dataset" && runtime === "export") {
                result = "DSexport"
            } else if (cat === "job" && runtime === "python3") {
                result = "python"
            } else if (cat === "job" && runtime === "pyspark") {
                result = "pyspark"
            } else if (cat === "job" && runtime === "sparkr") {
                result = "sparkr"
            } else if (cat === "job" && runtime === "r") {
                result = "r"
            } else if (cat === "job" && runtime === "prepare") {
                result = "prepare"
            } else if (cat === "job" && runtime === "sort") {
                result = "sort"
            } else if (cat === "job" && runtime === "sync") {
                result = "sync"
            } else if (cat === "job" && runtime === "distinct") {
                result = "distinct"
            } else if (cat === "job" && runtime === "topn") {
                result = "topn"
            } else if (cat === "job" && runtime === "join") {
                result = "join"
            } else if (cat === "job" && runtime === "stack") {
                result = "stack"
            } else if (cat === "job" && runtime === "group") {
                result = "group"
            } else if (cat === "job" && runtime === "pivot"){
                result = "pivot"
            } else if (cat === "job" && runtime === "shared"){
                result = "shared"
            } else if (cat === "job" && runtime === "export"){
                result = "export"
            } else if (cat === "dataset") {
                result = "dataset"
            } else if (cat === "job") {
                result = "job"
            }
            x["category"] = result
            x["selected"] = false
            const tmp = parseInt(x["attributes"]["level"])
            // if (tmp > maxLevel) {
            //     maxLevel = tmp
            // }
            return x
        })
        const links = response.data.filter(x => x["attributes"]["ctype"] === "link")
        for (let idx = 0; idx < links.length; ++idx) {
            const cmessage = JSON.parse(links[idx]["attributes"]["cmessage"])
            const targetId = cmessage["targetId"]
            const sourceId = cmessage["sourceId"]
            if (sourceId && sourceId.length > 0) {
                const tmp = ele.datasource.data.find(x => x["id"] === targetId)
                if(tmp) {
                    tmp["parentIds"].push(sourceId)
                }
            }

            if (targetId && targetId.length > 0) {
                const tmp = ele.datasource.data.find(x => x["id"] === sourceId)
                if(tmp) {
                    tmp["childrenIds"].push(targetId)
                }
            }
        }
        ele.needRefresh++
    }

    //查询 select
    async buildSelectItemsQuery(ele) {
        const uri = `${hostName}/hbstatemachineselect`
        const accessToken = ele.getCookie("access_token") || this.debugToken

        const tmp = {}
        if (ele.selectItem.attributes.cat === "job") {
            tmp['job'] = {
                "name": ele.selectItem.attributes.name,
                "represent-id": ele.selectItem.attributes['represent-id']
            }
        } else {
            tmp['dataset'] = {
                "name": ele.selectItem.attributes.name,
                "represent-id": ele.selectItem.attributes['represent-id']
            }
        }

        let body = {
            "projectId": ele.projectId,
            "projectName": ele.projectName,
            "element": tmp
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
        return fetch(uri, options)
    }

    async selectOneElement(ele) {
        let that = this
        const response = (await (await ele.datasource.buildSelectItemsQuery(ele)).json())
        that.cal = response
        ele.needRefresh++
    }
}

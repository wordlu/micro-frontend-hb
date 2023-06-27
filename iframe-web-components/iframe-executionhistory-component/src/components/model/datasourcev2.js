import { staticFilePath, hostName } from "../../config/envConfig"

export default class PhDagDatasource {
    constructor(id, adapter, url) {
        this.id = id
        this.originData = []
        this.data = []
        this.runJobName = ""
        this.name = "demo"
        this.projectId = "ggjpDje0HUC2JW"
        this.runnerId = "ggjpDje0HUC2JW"
        this.title = "need a title"
        this.debugToken = 'e89b531b01ff1eec456e60b23829e2ba3a671fd7936bf5005ac091e5acf2c6ad'
        this.cal = { calculate: {}, selected: [] }
        this.isChanged = false
    }

    data2Node() {
        this.data = this.originData.filter(x => x["attributes"]["ctype"] === "node")
        this.data = this.data.map(x => {
            x["id"] = x["attributes"]["represent-id"]
            x["parentIds"] = []
            x["childrenIds"] = []
            x["representId"] = x["attributes"]["represent-id"]
            x["status"] = "normal"
            const cat = x["attributes"]["cat"]
            const runtime = x["attributes"]["runtime"]
            // const name = x["attributes"]["name"]
            let result = "dataset"
            if (cat === "dataset" && runtime === "uploaded") {
                result = "DSuploaded"
            } else if (cat === "dataset" && runtime === "intermediate") {
                result = "DSIntermediate"
            } else if (cat === "dataset" && runtime === "shared") {
                result = "DSshared"
            } else if (cat === "dataset" && runtime === "export") {
                result = "DSexport"
            } else if (cat === "dataset" && runtime === "input_index") {
                result = "max-in"
            } else if (cat === "dataset" && runtime === "output_index") {
                result = "max-out"
            } else if (cat === "dataset" && runtime === "catalog") {
                result = "catalog"
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
            } else if (cat === "job" && runtime === "pivot"){
                result = "pivot"
            } else if (cat === "job" && runtime === "topn"){
                result = "topn"
            } else if (cat === "job" && runtime === "sort"){
                result = "sort"
            } else if (cat === "job" && runtime === "sync"){
                result = "sync"
            } else if (cat === "job" && runtime === "distinct"){
                result = "distinct"
            } else if (cat === "job" && runtime === "join"){
                result = "join"
            } else if (cat === "job" && runtime === "stack"){
                result = "stack"
            } else if (cat === "job" && runtime === "group"){
                result = "group"
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
            return x
        })
    }

    node2links() {
        const links = this.originData.filter(x => x["attributes"]["ctype"] === "link")
        for (let idx = 0; idx < links.length; ++idx) {
            const cmessage = JSON.parse(links[idx]["attributes"]["cmessage"])
            const targetId = cmessage["targetId"]
            const sourceId = cmessage["sourceId"]
            if (sourceId && sourceId.length > 0) {
                const tmp = this.data.find(x => x["id"] === targetId)
                if(tmp) {
                    tmp["parentIds"].push(sourceId)
                }
            }

            if (targetId && targetId.length > 0) {
                const tmp = this.data.find(x => x["id"] === sourceId)
                if(tmp) {
                    tmp["childrenIds"].push(targetId)
                }
            }
        }
    }

    refreshRenderData(isOnlyShowRunJobs=false) {
        this.data2Node()
        console.log(isOnlyShowRunJobs)
        if (isOnlyShowRunJobs) {
            this.data = this.data.filter(x => this.cal.selected.includes(x["id"]))
        }
        this.node2links()
    }

    buildRunJobsNameQuery(ele) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "execution",
            "conditions": {
                "runnerId": ["=", this.runnerId]
            },
            "index_name": "runnerId-startAt-index",
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

    async refreshRunJobsData(ele) {
        let that = this
        await ele.datasource.buildRunJobsNameQuery(ele)
            .then((response) => response.json())
            .then((response) => {
                const jobs = response["data"].map(x => x.attributes["job-show-name"])
                if (jobs.length > 0) {
                    that.runJobName = jobs[0]
                    ele.needRefresh++
                } else {
                    that.isChanged = true
                }
            })
    }

    buildQuery(ele, isAppend=false) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "dag",
            "conditions": {
                "projectId": ["=", this.projectId],
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
        await ele.datasource.buildQuery(ele)
            .then((response) => response.json())
            .then((response) => {
                that.originData = response.data
                ele.needRefresh++
            })
    }

    //查询 select
    buildSelectItemsQuery(ele, name) {
        const uri = `${hostName}/hbstatemachineselect`
        const accessToken = ele.getCookie("access_token") || this.debugToken

        let job = this.originData.filter(x => x.attributes['name'] === name)
        if (job.length === 0) {
            this.isChanged = true
            return
        }

        const tmp = {}
        tmp['job'] = {
            "name": name,
            "represent-id": job[0].attributes['represent-id']
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
        // return null
        return fetch(uri, options)
    }

    async selectOneElement(ele) {
        let that = this
        const p = ele.datasource.buildSelectItemsQuery(ele, this.runJobName)
        if (p) {
            await p.then((response) => response.json())
                .then((response) => {
                    that.cal = response
                    for (let idx = 0; idx < that.cal.selected.length; ++idx) {
                        if (that.originData.filter(x => x.attributes['represent-id'] === that.cal.selected[idx]).length === 0) {
                            that.isChanged = true
                        }
                    }
                    ele.needRefresh++
                })
        }
    }

    queryFlow(ele) {
        const logsUrl = `${hostName}/hbreadjsonfile`
        const accessToken = ele.getCookie( "access_token" ) || this.debugToken
        let phreadjsonfileBody = {
            "path": ele.executionTemplate.substring(0, ele.executionTemplate.length - 5)
        }
        let logsOptions = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(phreadjsonfileBody)
        }
        return fetch(logsUrl, logsOptions)
    }

    buildFlowQuery(ele) {
        ele.datasource.queryFlow(ele)
            .then((response) => response.json())
            .then((response) => {
                ele.dealBuildFlowQuery(response)
            })
    }
}

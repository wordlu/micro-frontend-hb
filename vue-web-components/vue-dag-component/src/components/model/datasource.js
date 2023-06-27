
import { hostName } from "../../config/envConfig"
// import { Message } from 'element-ui'
import { JsonApiDataStore } from "jsonapi-datastore"


export default class PhDagDatasource {
    constructor(id, projectId, parent) {
        this.id = id
        this.store = new JsonApiDataStore()
        this.debugToken = 'a485d935b8705b15d3d49a42b7d8213581fa51ef68fdb142d293e3993474de9b'

        this.adapter = this.defaultAdapter
        this.projectId = projectId
        this.title = "need a title"
        this.sizeHit = [0, 0]
        this.name = "demo"
        this.data = []
        this.cal = { calculate: {}, selected: [] }
        this.parent = parent
		this.version_start_key = ""
		this.version_total_count = 0
        this.versionArr = []
    }

    iframeComplete(event) {
        if(event.data.dagIsComplete && event.data.dagIsComplete.status === "complete") {
            console.info("complete is ok")
            const { data } = event.data.dagIsComplete
            this.datasource.data = JSON.parse(data)
        }
    }

    getClickNodeEvent(event) {
        if (event.data.dagSelectItem) {
            console.debug("click node")
            console.debug(event.data.dagId)
            console.debug(event.data.dagSelectItem)
            const { selectItemName, icon_header, cal, item } = JSON.parse(event.data.dagSelectItem)
            this.datasource.parent.selectItemName = selectItemName
            this.datasource.parent.icon_header = icon_header
            this.datasource.cal = cal
            this.datasource.parent.selectItem = item
        }
    }

    jsonapiAdapter(data) {
        const dashToHump = function (value) {
            const textArr = value.split("-")
            return textArr.map((item, index) => {
                if (index === 0) return item
                return item.slice(0, 1).toUpperCase() + item.slice(1);
            }).join("");
        }
        if (Array.isArray(data)) {
            data.map(item => {
                Object.keys(item).map(keys => {
                    let newK = dashToHump(keys)
                    if (newK !== keys) {
                        item[newK] = item[keys]
                        delete item[keys]
                    }
                })
                return item
            })
        } else {
            Object.keys(data).map(keys => {
                let newK = dashToHump(keys)
                if (newK !== keys) {
                    data[newK] = data[keys]
                    delete data[keys]
                }
            })
        }
        return data
    }

    // 数据集
    buildQuery1(ele){
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            table: "dataset",
            conditions: {
                projectId: ["=", ele.projectId]
            },
            index_name: "dataset-projectId-name-index",
            limit: this.dataset_size,
            start_key: ''
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
        return fetch(url, options)
    }

    // 加载数据集
    async refreshData1(ele) {
        let that = this
        await ele.datasource.buildQuery1(ele)
            .then((response) => response.json())
            .then((response) => {
                that.store.sync(response)
                that.dss = that.jsonapiAdapter(that.store.findAll("datasets"))
            })
    }

    // 数据目录
    buildQueryCatalog(ele){
        const url = `${hostName}/hbgetgluetable`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            "glue_database_name": ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
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

    // 加载数据目录
    async queryCatalog(ele) {
        let that = this
        await ele.datasource.buildQueryCatalog(ele)
            .then((response) => response.json())
            .then((response) => {
                that.versionArr = response.data.map((obj) => {
                    return obj["attributes"]["name"];
                })
            })
    }

    //查询version
    buildDistinctColQuery(ele, col, cat, dsName) {
        const uri = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const companyId = ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
        let id = ""
        if (cat === "catalog") {
            id = (companyId + "_" + dsName).toLowerCase()
        } else {
            id = ele.projectId + "_" + ele.representId
        }
        let body = {
            "table": "version",
            "conditions": {
                "id": [
                    "=",
                    id
                ]
            },
            "limit": 100,
            "start_key": this.version_start_key
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

    queryDlgDistinctCol(ele, row, cat, dsName) {
		const that = this
        return ele.datasource.buildDistinctColQuery(ele, row, cat, dsName)
            .then((response) => response.json())
            .then((response) => {
				let obj = {}
				response.data.forEach(x => {
					obj[x["attributes"]["name"]] = x["attributes"]["alias"]
				})
				that.aliasArray = obj
				that.version_start_key = response.meta.start_key
				that.version_total_count = response.meta.total_count
                return response.data.map(x => x["attributes"]["name"])
            })
    }

    guid() {
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c == "x" ? r : (r & 0x3) | 0x8
                return v.toString(16)
            }
        )
    }

    // 新建脚本
    buildCreateScripts(ele, data, uuid) {
        console.log(data)
        const uri = `${hostName}/hbresourcecreationtrigger`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const companyId = ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
        const accountId = ele.getCookie("account_id") || "c89b8123-a120-498f-963c-5be102ee9082"
        const params = data.args.param
		const schema = ele.runtime === "shared" ? ele.$refs.createOtherScript.catalog : ele.$refs.createOtherScript.address
        let datasets = []
        let dsNames = []
        params.inputs.forEach((item) => {
            datasets.push({
                name: item.name,
                cat: item.cat,
                format: "parquet",
                schema: []
            })
            dsNames.push(item.name)
        })
        datasets.push({
            name: params.outputs[0].name,
            cat: ele.runtime,
            format: "s3",
            schema: schema
        })
        const script = {
            name: params.jobName,
            flowVersion: "developer",
            runtime: ele.runtime,
            inputs: JSON.stringify(dsNames),
            output: params.outputs[0].name
        }
        
        let message = {
            common: {
                traceId: uuid,
                tenantId: companyId,
                projectId: params.projectId,
                projectName: params.projectName,
                flowVersion: "developer",
                dagName: params.projectName,
                owner: accountId,
                showName:  decodeURI(
                    decodeURI(
                        ele.getCookie("user_name_show")
                    )
                ) || "test"
            },
            action: {
                cat: "createScript",
                desc: "create script",
                comments: "something need to say",
                message: JSON.stringify({
                    optionName: "create_script",
                    cat: "shared",
                    runtime: "shared",
                    actionName: params.jobName
                }),
                required: true
            },
            datasets: datasets,
            script: script,
            notification: {
                required: true
            },
            result: {}
        }
        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(message)
        }
        return fetch(uri, options)
    }

    createScripts(ele, data) {
        const uuid = this.guid()
        const eventName = "createOtherScript"
        return ele.datasource.buildCreateScripts(ele, data, uuid)
            .then((response) => response.json())
            .then((response) => {
                if (response.status === "succeed") {
                    const model = {
						uuid: uuid,
						eventName: eventName
					}
                    ele.dealCreateOtherScript(model, (param, payload) => {
						const { status } = JSON.parse(payload)
						ele.saveNotification(status)
						ele.loading = false
                    })
                } else {
					ele.loading = false
					ele.saveNotification("failed")
                }
            })
    }

    // 返回是否运行和错误信息的回调  用于嵌套外侧的使用
    runningStatusCallback(event) {
        if (event.data.toVueDagRunStatus) { 
            const {
                isRunning, failedLogs,
                progressOver, retryButtonShow
            } = event.data.toVueDagRunStatus
            console.debug("progressOver", progressOver)
            this.datasource.parent.isRunning = isRunning
            this.datasource.parent.failedLogs = JSON.parse(failedLogs)
            this.datasource.parent.progressOver = progressOver
            this.datasource.parent.retryButtonShow = retryButtonShow

        }
    }
}

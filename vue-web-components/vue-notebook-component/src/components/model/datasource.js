
import { hostName } from "../../config/envConfig"
import { JsonApiDataStore } from "jsonapi-datastore"
import PhStatusModel from "./status-model"

export default class PhDataSource {
    constructor(id, parent) {
        this.id = id
        this.status = {}
        this.debugToken = "0a741ed989acbf5672a6616be1afcfff294aa1bb4658a9c194d9eda3ea3f6a80"
        this.isReady = false
        this.parent = parent
        this.model = []
        this.tenantId = ""
        this.dns = []
        this.startKey = ""
        this.totalCount = 0
        this.batch_size = 20
        this.tagsArray = []
        this.store = new JsonApiDataStore()
    }

    jsonapiAdapter(data) {
        const dashToHump = function (value) {
            const textArr = value.split("-");
            return textArr.map((item, index) => {
                if (index === 0) return item.toLowerCase();
                return item.slice(0, 1).toUpperCase() + item.slice(1);
            }).join("");
        }
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
        return data
    }

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }

    refreshPlaceholders(dns) {
        this.model = []
        dns.forEach(x => {
            this.model.push(new PhStatusModel(x.id, 0, this.guid(), x))
        })
    }

    // jupyter
    buildQuery(ele, key){
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        this.tenantId = ele.getCookie("company_id")
        let body = {
            table: "resource",
            conditions: {
                tenantId: ["=", this.tenantId],
                role: ["=", "codeeditor"]
            },
            index_name: "tenantId-role-index",
            limit: this.batch_size,
            start_key: key
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

    // 首次加载jupyter
    refreshJupyterData(ele, key, callback=null) {
        let that = this
        ele.datasource.buildQuery(ele, key)
            .then((response) => response.json())
            .then((response) => {
                that.store.sync(response)
                // 下一页的key
                that.startKey = response.meta.start_key
                that.totalCount = response.meta.total_count
                that.dns = that.jsonapiAdapter(that.store.findAll("resources"))

                let tags = new Set()
                that.dns.forEach((iter) => {
                	if (typeof iter.label == "string") {
                        if (iter.label == "" || iter.label == 'unknown') {
                            iter.label = "[]"
                            iter.label = JSON.parse(iter.label)
                            iter.label.map((it) => {
                                tags.add(it)
                            })
                        } else {
                            iter.label = JSON.parse(iter.label)
                            iter.label.map((it) => {
                                tags.add(it)
                            })
                        }
                	}
                })
                that.tagsArray = Array.from(tags)

                ele.needRefresh++
                if(callback)
                    callback()
            })
    }

    // 下一页jupyter
    appendJupyterData(ele, key, callback=null) {
        let that = this
        ele.datasource.buildQuery(ele, key)
            .then((response) => response.json())
            .then((response) => {
                // that.store = new JsonApiDataStore()
                that.store.sync(response)
                ele.datasource.dns = that.jsonapiAdapter(that.store.findAll("resources"))
                that.startKey = response.meta.start_key
                let tags = new Set()
                that.dns.forEach((iter) => {
                	if (typeof iter.label == "string") {
                        if (iter.label == "" || iter.label == 'unknown') {
                            iter.label = "[]"
                            iter.label = JSON.parse(iter.label)
                            iter.label.map((it) => {
                                tags.add(it)
                            })
                        } else {
                            iter.label = JSON.parse(iter.label)
                            iter.label.map((it) => {
                                tags.add(it)
                            })
                        }
                	}
                })
                that.tagsArray = Array.from(tags)
                ele.needRefresh++
                if(callback)
                    callback()
            })
    }

    buildStatusQuery(tenantId, resourceIds) {
        const url = `${hostName}/hbjupyterstatus`
        const accessToken = this.getCookie("access_token")
        let body = {
            "tenantId": tenantId,
            "resourceIds": resourceIds
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

    refreshStatus(tenantId, resourceIds, callback=null) {
        const that = this
        that.parent.loading = true
        this.buildStatusQuery(tenantId, resourceIds)
            .then((response) => response.json())
            .then((response) => {
                response["data"].forEach(x => {
                    if (x && x.status !== -99 && x.status !== 0) {
                        const tmp = that.model.find(it => it.resourceId === x.id)
                        tmp.status = x.status
                        tmp.switch = x.status === 1 || x.status === 2
                        tmp.editable = x.status === 0 || x.status === 2
                        tmp.traceId = x.traceId
                        tmp.resetMessage()
                    }
                })
                this.isReady = true
                that.parent.loading = false
                if(callback)
                    callback()
            })
    }

    buildStartQuery(tenantId, model) {
        const url = `${hostName}/hbjupyterboottrigger`
        const accessToken = this.getCookie("access_token")
        // const traceId = this.guid()
        let body = {
            "tenantId": tenantId,
            "traceId": model.traceId,
            // "owner": this.getCookie("account_id"),
            owner: model.detail.owner,
            "showName": decodeURI(
                decodeURI(
                    this.getCookie("user_name_show")
                )
            ),
            "resourceId": model.resourceId
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

    resourceStart(tenantId, model) {
        const that = this
        this.buildStartQuery(tenantId, model)
            .then((response) => response.json())
            .then((response) => {
                that.parent.loading = true
                if (response.status === "succeed") {
                    model.editable = false
                    that.parent.isStopStatus = false
                    model.status = 1
                    model.resetMessage()
                    that.parent.loading = false

                    that.parent.dealResourceStart(model, (param, payload) => {
                        console.log("resource start callback")
                        const { status } = JSON.parse(payload)
                        const tmp = that.model.find(x => x.traceId === param.id)

                        if (tmp) {
                            if (status === "started") {
                                that.parent.isStopStatus = false
                                tmp.status = 2
                            }
                            tmp.switch = tmp.status === 1 || tmp.status === 2
                            tmp.editable = tmp.status === 0 || tmp.status === 2
                            tmp.resetMessage()
                        }
                    })
                } else {
                    alert("启动失败")
                }
            })
    }

    buildStopQuery(tenantId, model) {
        const url = `${hostName}/hbjupyterstoptrigger`
        const accessToken = this.getCookie("access_token")
        // const traceId = this.getCookie("jupyterTraceId")
        let body = {
            "tenantId": tenantId,
            "traceId": model.traceId,
            // "owner": this.getCookie("account_id"),
            owner: model.detail.owner,
            "showName": decodeURI(
                decodeURI(
                    this.getCookie("user_name_show")
                )
            ),
            "resourceId": model.resourceId
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

    resourceStop(tenantId, model) {
        this.buildStopQuery(tenantId, model)
            .then((response) => response.json())
            .then((response) => {
                if (response.status === "succeed") {
                    model.editable = false
                    const that = this
                    that.parent.isStopStatus = false
                    model.status = 4
                    model.resetMessage()
                    that.parent.loading = false

                    that.parent.dealResourceStop(model, (param, payload) => {
                        console.log("resource stop callback")
                        const { status } = JSON.parse(payload)
                        const tmp = that.model.find(x => x.traceId === param.id)

                        if (tmp) {
                            if (status === "stopped") {
                                that.parent.isStopStatus = true
                                tmp.status = 0
                            }
                            tmp.switch = tmp.status === 1 || tmp.status === 2
                            tmp.editable = tmp.status === 0 || tmp.status === 2
                            tmp.resetMessage()
                        }
                    })
                } else {
                    alert("停止失败")
                }
            })
    }

    guid() {
        return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
                var r = (Math.random() * 16) | 0,
                    v = c === "x" ? r : (r & 0x3) | 0x8
                return v.toString(16)
            }
        )
    }
}

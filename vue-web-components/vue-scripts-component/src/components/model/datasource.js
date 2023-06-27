import { staticFilePath, hostName } from "../../config/envConfig"
import { JsonApiDataStore } from "jsonapi-datastore"


export default class PhDataSource {
    constructor(id, adapter=null) {
        this.id = id
        this.dcs = []
        this.dss = []
        this.startKey = ""
        this.totalCount = 0
        this.projectId = ''
        this.batch_size = 20
        this.dataset_size = 1000
        this.tagsArray = []
        // this.curPage = 0
        this.store = new JsonApiDataStore()
        this.debugToken = "23468fc87c8f6fd40f961d49cceeaeb2ee091d657cdcee906e823f56c1266466"
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

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }

    // 脚本
    buildQuery(ele, key){
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            table: "dagconf",
            conditions: {
                projectId: ["=", ele.projectId]
            },
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

    // 首次加载脚本 
    refreshData(ele, key, callback=null) {
        let that = this
        ele.datasource.buildQuery(ele, key)
            .then((response) => response.json())
            .then((response) => {
                that.store.sync(response)
                // 下一页的key
                that.startKey = response.meta.start_key
                that.totalCount = response.meta.total_count
                that.dcs = that.jsonapiAdapter(that.store.findAll("dag-confs"))
                // that.curPage = 1
                let tags = new Set()
                that.dcs.forEach((iter) => {
                	if (typeof iter.labels == "string") {
                        if (iter.labels == "" || iter.label == 'unknown') {
                            iter.labels = "[]"
                            iter.labels = JSON.parse(iter.labels)
                            iter.labels.map((it) => {
                                tags.add(it)
                            })
                        } else {
                            iter.labels = JSON.parse(iter.labels)
                            iter.labels.map((it) => {
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

    // 下一页脚本
    appendData(ele, key, callback=null) {
        let that = this
        ele.datasource.buildQuery(ele, key)
            .then((response) => response.json())
            .then((response) => {
                that.store.sync(response)
                ele.datasource.dcs = that.jsonapiAdapter(that.store.findAll("dag-confs"))
                that.startKey = response.meta.start_key
                let tags = new Set()
                ele.datasource.dcs.forEach((iter) => {
                	if (typeof iter.labels == "string") {
                        if (iter.labels == "" || iter.label == 'unknown') {
                            iter.labels = "[]"
                            iter.labels = JSON.parse(iter.labels)
                            iter.labels.map((it) => {
                                tags.add(it)
                            })
                        } else {
                            iter.labels = JSON.parse(iter.labels)
                            iter.labels.map((it) => {
                                tags.add(it)
                            })
                        }
                	}
                })
                that.tagsArray = []
                that.tagsArray = Array.from(tags)
                // ele.cur_page++
                ele.needRefresh++
                if(callback)
                    callback()
            })
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
    async refreshData1(ele, callback=null) {
        let that = this
        await ele.datasource.buildQuery1(ele)
            .then((response) => response.json())
            .then((response) => {
                that.store.sync(response)
                that.dss = that.jsonapiAdapter(that.store.findAll("datasets"))
            })
    }

    buildGetInputDs(ele, name) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            table: "dataset",
            conditions: {
                projectId: ["=", ele.projectId],
                name: ["=", name]
            },
            index_name: "dataset-projectId-name-index",
            limit: 10,
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

    async getInputDs(ele, name) {
        let that = this
        await ele.datasource.buildGetInputDs(ele, name)
            .then((response) => response.json())
            .then((response) => {
                const id = response.data[0].id
                that.store.sync(response)
                ele.inputDs = that.jsonapiAdapter(that.store.find("datasets", id))
            })
    }

}

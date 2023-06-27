
import { hostName } from "../../config/envConfig"
import { FunctionChains } from "./stepFuncChains"
import { JsonApiDataStore } from "jsonapi-datastore"

export default class PhStepDataSource {
    constructor(id, parent, adapter, url, ) {
        this.id = id
        this.data = []
        this.sort = {}
		this.parent = parent
        this.store = new JsonApiDataStore()
        this.projectId = this.getUrlParam("projectId")
        this.name = this.getUrlParam("inputName")
        this.filter = {}
        this.batch_size = 100
        this.funcChains = (new FunctionChains()).push("filter-eq", "__match", "1")
        // this.schema = []
        // this.cols = this.schema
        if (!url)
            this.url= `${hostName}/hbolapdatasource`
        if (!adapter)
            this.adapter = this.defaultAdapter
        this.debugToken = "eacce9388efc85f51de434531e31f1dc8ef188982c298a7b68ad503bb66d6dcd"
    }

	getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }

    getUrlParam( value) {
        let href = window.location.href
        let paramArr = href.split("?")[1].split("&")
        let data = paramArr.find(item => item.indexOf(value) > -1)
        return data ? decodeURI(data).split("=")[1] : undefined
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

	refreshDataset(projectId) {
        const that = this
        this.buildDatasetQuery(projectId)
            .then((response) => response.json())
            .then((response) => {
				console.log(response)
				that.store.sync(response)
                const data = that.store.findAll("datasets")
				that.parent.datasetArray = data
            })
    }

	buildDatasetQuery(projectId) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "dataset",
            "conditions": {
                "projectId": ["=", projectId]
            },
			index_name: "dataset-projectId-name-index",
            "limit": 1000,
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

	refreshInOut(projectId, jobName) {
        const that = this
        this.buildInOutQuery(projectId, jobName)
            .then((response) => response.json())
            .then((response) => {
				console.log(response)
				that.parent.inArray = response.input
				that.parent.outArray = response.output
            })
    }

	buildInOutQuery(projectId, jobName) {
        const url = `${hostName}/hbcheckinout`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
			"name": jobName,
			"projectId": projectId
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

    buildQuery(ele, page, schema) {
        function buildQueryString() {
            let sql_str = "SELECT "
            let selectParam = schema.map(item => '`' + item + '`').join(',')
            if (ele.datasource.projectId.length === 0)
                sql_str = sql_str + selectParam + " FROM " + ele.datasource.name
            else
                // sql_str = sql_str + selectParam + " FROM `" + ele.datasource.projectId + '_' +ele.datasource.name +'`'
                sql_str = sql_str + selectParam + " FROM `" + ele.datasource.name +'`'

            // filter
            let firstFilter = Object.keys(ele.datasource.filter)[0]
            let filterParam = " WHERE "
            for (const key in ele.datasource.filter) {
                if(key !== firstFilter) {
                    filterParam = " AND "
                }
                sql_str = sql_str + filterParam + ele.datasource.filter[key]
            }

            // sorts
            if(ele.datasource.sort && Object.keys(ele.datasource.sort).length !== 0) {
                sql_str = sql_str + " ORDER BY `"
                let lastSort = Object.keys(ele.datasource.sort)[Object.keys(ele.datasource.sort).length - 1]
                for (const key in ele.datasource.sort) {
                    if(lastSort == key) {
                        sql_str = sql_str + key +'`'
                    } else {
                        sql_str = sql_str + key +'`,`'
                    }
                    if (ele.datasource.sort[key] < 0) {
                        sql_str = sql_str + " desc "
                    }
                }
            }

            // pages
            sql_str = sql_str + " LIMIT " + ele.datasource.batch_size
            sql_str = sql_str + " OFFSET " + (page * ele.datasource.batch_size).toString()
            return sql_str
        }
        const url = this.url
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const tenantId = ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
        let body = {
            "query": buildQueryString(),
            "schema": schema,
            "projectId": ele.datasource.projectId,
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

    buildCountQuery(ele) {
        function buildQueryCountString() {
            let sql_str = "SELECT count(*)"

            if (ele.datasource.projectId.length === 0)
                sql_str = sql_str + " FROM `"  + ele.datasource.name + "`"
            else
                // sql_str = sql_str + " FROM `"  + ele.datasource.projectId + '_' + ele.datasource.name + "`"
                sql_str = sql_str + " FROM `"  + ele.datasource.name + "`"

            // filter
            let firstFilter = Object.keys(ele.datasource.filter)[0]
            let filterParam = " WHERE "
            for (const key in ele.datasource.filter) {
                if(key != firstFilter) {
                    filterParam = " AND "
                }
                sql_str = sql_str + filterParam + ele.datasource.filter[key]
            }

            return sql_str
        }
        const url = this.url
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const tenantId = ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"

        let body = {
            "query": buildQueryCountString(),
            "schema": ["count"],
            "projectId": ele.datasource.projectId,
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

    //显示行拼接sql
    buildDistinctColQuery(ele, col) {
        function buildDistinctColSql() {
            let sql_str = "SELECT DISTINCT " + col

            if (ele.datasource.projectId.length === 0)
                sql_str = sql_str + " FROM `" + ele.datasource.name + "`"
            else
                // sql_str = sql_str + " FROM `" + ele.datasource.projectId + '_'  + ele.datasource.name + "`"
                sql_str = sql_str + " FROM `" + ele.datasource.name + "`"

            sql_str = sql_str + " ORDER BY " + col

            return sql_str
        }
        const url = this.url
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const tenantId = ele.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg"
        let body = {
            "query": buildDistinctColSql(),
            "schema": [col],
            "projectId": ele.datasource.projectId,
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

    refreshData(ele, page, schema) {
        if (schema.schema.length > 0) {
            ele.datasource.buildQuery(ele, page, schema.schema)
                .then((response) => response.json())
                .then((response) => {
                    const tmp = []
                    for (var idx = 0; idx < response.length; ++idx) {
                        tmp.push(ele.datasource.adapter(response[idx], schema.cols))
                    }
                    ele.data = tmp //response.map(ele.datasource.adapter)
                    // ele.datasource.data = tmp //response.map(ele.datasource.adapter)
                    ele.dataIsReady++
                })
        }
    }

    queryTotalCount(ele) {
        return ele.datasource.buildCountQuery(ele)
            .then((response) => response.json())
            .then((response) => {
				if (response.status && response.status === "failed") {
					return response.message
				}
                return response[0]["count"]
            })
    }

    queryDlgDistinctCol(ele, row) {
        return ele.datasource.buildDistinctColQuery(ele, row)
            .then((response) => response.json())
            .then((response) => {
                return response.map(x => x[row])
            })
    }

    clientSideSearch(ele, txt) {
        let result = 0
        for (var idx = 0; idx < this.data.length; idx++) {
            const line = this.data[idx]
            for (const word in line) {
                if ((line[word]) && (line[word].startsWith(txt))) {
                    result++
                    break
                }
            }
        }
        return result
    }

    pushFilterCondition(key, condi) {
        this.filter[key] = condi
    }

    pushSortCondition(key, value) {
        this.sort[key] = value
    }

    clearSortCondition() {
        this.sort = {}
    }

    download2File(ele, schema, cat, fileName) {
        ele.datasource.buildDownloadQuery(ele, schema, cat, fileName)
            .then((response) => response.json())
            .then((response) => {
                if(response.status) {
                    window.open(response.message)
                } else {
                    alert(response.message)
                }
            })
    }

    buildDownloadQuery(ele, schema, cat, fileName) {
        function buildDownloadQueryString() {
            let sql_str = "SELECT "
            let selectParam = schema.map(item => '`' + item + '`').join(',')
            if (ele.datasource.projectId.length === 0)
                sql_str = sql_str + selectParam + " FROM " + ele.datasource.name
            else
                // sql_str = sql_str + selectParam + " FROM `" + ele.datasource.projectId + '_' +ele.datasource.name +'`'
                sql_str = sql_str + selectParam + " FROM `" + ele.datasource.name +'`'

            // filter
            let firstFilter = Object.keys(ele.datasource.filter)[0]
            let filterParam = " WHERE "
            for (const key in ele.datasource.filter) {
                if(key !== firstFilter) {
                    filterParam = " AND "
                }
                sql_str = sql_str + filterParam + ele.datasource.filter[key]
            }

            // sorts
            if(ele.datasource.sort && Object.keys(ele.datasource.sort).length !== 0) {
                sql_str = sql_str + " ORDER BY `"
                let lastSort = Object.keys(ele.datasource.sort)[Object.keys(ele.datasource.sort).length - 1]
                for (const key in ele.datasource.sort) {
                    if (lastSort === key) {
                        sql_str = sql_str + key +'`'
                    } else {
                        sql_str = sql_str + key +'`,`'
                    }
                    if (ele.datasource.sort[key] < 0) {
                        sql_str = sql_str + " desc "
                    }
                }
            }

            // pages
            // Download with no pages
            // sql_str = sql_str + " LIMIT " + ele.datasource.batch_size
            // sql_str = sql_str + " OFFSET " + (page * ele.datasource.batch_size).toString()
            return sql_str
        }
        const url = `${hostName}/hbdadownload`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            "sql": buildDownloadQueryString(),
            "schema": schema,
            "category": cat,
            "file_name": fileName,
            "project": ele.datasource.projectId
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

    // 请求version list
    buildVersionQuery(ele) {
        const url = this.url
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let id = ele.datasource.projectId + "_" + ele.allData.datasetId
        let body = {
            "table": "version",
            "conditions": {
                "id": [
                    "=",
                    id
                ]
            },
            "limit": 100,
            "start_key": ""
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
    //请求sample
    buildSampleQuery(ele) {
        const url = this.url
        const accessToken = ele.getCookie("access_token") || this.debugToken
        const body = {
            table: "dataset",
            conditions: {
                projectId: ["=",ele.datasource.projectId],
                id: ["=", ele.allData.datasetId]
            },
            limit: 100,
            start_key: ""
        }
        const options = {
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

    queryVersion(ele) {
        return ele.datasource.buildVersionQuery(ele)
            .then((response) => response.json())
            .then((response) => {
                return response.data.map(x => x["attributes"]["name"])
            })
    }

    querySample(ele) {
        return ele.datasource.buildSampleQuery(ele)
            .then((response) => response.json())
            .then((response) => {
                return response.data.map(x => x["attributes"]["sample"])
            })
    }
}

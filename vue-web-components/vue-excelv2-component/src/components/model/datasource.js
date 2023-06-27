
import { FunctionChains, eqFilterValueFunctionStep } from "./function_chains"
import { staticFilePath, hostName } from "../../config/envConfig"


export default class PhDataSource {
    constructor(id, adapter) {
        this.id = id
        this.sort = {}
        this.filter = {}
        this.funcChains = (new FunctionChains()).push("filter-eq", "Index", "1")
        this.projectId = ''
        this.name = "prod_clean_v2"
        this.batch_size = 100
        // this.schema = ["Index", "Id", "Hospname", "Province", "City", "lHospname", "lHospalias", "lDistrict", "lLevel", "lCat", "lOffweb"]
        // this.schema = schema
        // this.cols = this.schema
        if (!adapter)
            this.adapter = this.defaultAdapter
        this.debugToken = "29d19c5690360c3e7e1394284aa5e423eb2fbae886308e9626cd99743a28e9c8"
    }

    defaultAdapter(row, cols) {
        let result = []
        for (var idx = 0; idx < cols.length; ++idx) {
            result.push(row[cols[idx]])
        }
        return result
    }

    buildQuery(ele, page, schema) {
        function buildQueryString() {
            let sql_str = "SELECT "
            let selectParam = schema.map(item => '`' + item + '`').join(',')
            sql_str = sql_str + selectParam + " FROM `" + ele.datasource.name + '`'

            // filter
            let firstFilter = Object.keys(ele.datasource.filter)[0]
            let filterParam = " WHERE "
            for (const key in ele.datasource.filter) {
                if(key != firstFilter) {
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
        const url = `${hostName}/hbchproxyquery`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            "query": buildQueryString(),
            "schema": schema
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

    buildCountQuery(ele) {
        function buildQueryCountString() {
            let sql_str = "SELECT count(*)"

            // sql_str = sql_str + " FROM `"  + ele.datasource.projectId + '_' + ele.datasource.name + "`"
            sql_str = sql_str + " FROM `"  +  ele.datasource.name + "`"

            // filter
            let firstFilter = Object.keys(ele.datasource.filter)[0]
            let filterParam = " WHERE "
            for (const key in ele.datasource.filter) {
                if(key != firstFilter) {
                    filterParam = " AND "
                }
                sql_str = sql_str + filterParam + key + " LIKE '%" + ele.datasource.filter[key]+ "%'"
            }

            return sql_str
        }
        const url = `${hostName}/hbchproxyquery`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            "query": buildQueryCountString(),
            "schema": ["count"]
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

    pushFilterCondition(key, condi) {
        this.filter[key] = condi
    }

    pushSortCondition(key, value) {
        this.sort[key] = value
    }

    clearSortCondition() {
        this.sort = {}
    }
}

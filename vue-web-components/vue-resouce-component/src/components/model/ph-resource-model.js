
import { hostName } from "../../config/envConfig"
import { JsonApiDataStore } from "jsonapi-datastore"
import PhEngineModel from "./res/engine"
import PhCodeEditorModel from "./res/codeeditor"
import PhStorageModel from "./res/static-storage"
import PhOlapModel from './res/olap'

export default class PhResourceModel {
    constructor(id, tenantId='zudIcG_17yj8CEUoCTHg', parent) {
        this.id = id
		this.parent = parent
        this.tenantId = tenantId
        this.debugToken = "6dbc1697b62d10241ef0f132ea61b13c0f47d2fad34d99e0be33ccc5d7547946"
        this.store = new JsonApiDataStore()
        this.data = []

        this.engine = null
        this.olap = null
        this.codeeditors = []
        this.storage = []
		this.switch = 0
    }

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }

    async model() {
        if (this.data.length === 0) {
            this.store.reset()
            const resources = await this.buildResourceQuery(this.tenantId).then((response) => response.json())
            this.store.sync(resources)
            this.data = this.store.findAll("resources")
            for (let idx = 0; idx < this.data.length; ++idx) {
                const tmp = this.data[idx]
                if (tmp["role"] === "engine") {
                    this.engine = new PhEngineModel(tmp)
                } else if (tmp["role"] === "olap") {
                    this.olap = new PhOlapModel(tmp)
                } else if (tmp["role"] === "codeeditor") {
                    this.codeeditors.push(new PhCodeEditorModel(tmp))
                } else if (tmp["role"] === "storage") {
                    this.storage.push(new PhStorageModel(tmp))
                }
            }
        }
    }

    buildResourceQuery(tenantId) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "resource",
            "conditions": {
                "tenantId": ["=", tenantId],
            },
            "limit": 100,
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

	buildStartQuery(tenantId, row) {
        const url = `${hostName}/hbjupyterboottrigger`
        const accessToken = this.getCookie("access_token")
		const traceId = this.guid()
		console.log(tenantId)
        let body = {
            "tenantId": tenantId,
            // "tenantId": "alfredtest",
			"traceId": traceId,
			"owner": this.getCookie("account_id"),
			"showName":  decodeURI(
				decodeURI(
					this.getCookie("user_name_show")
				)
			),
			"resourceId": row.codeeditorsResourceId
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

    resourceStart(tenantId, row) {
        const that = this
        this.buildStartQuery(tenantId, row)
            .then((response) => response.json())
            .then((response) => {
				that.parent.dealResourceStart(response, row)
            })
    }

	buildStopQuery(tenantId, row) {
        const url = `${hostName}/hbjupyterstoptrigger`
        const accessToken = this.getCookie("access_token")
		const traceId = this.getCookie("jupyterTraceId")
		console.log(tenantId)
        let body = {
            "tenantId": tenantId,
            // "tenantId": "alfredtest",
			"traceId": traceId,
			"owner": this.getCookie("account_id"),
			"showName":  decodeURI(
				decodeURI(
					this.getCookie("user_name_show")
				)
			),
			"resourceId": row.codeeditorsResourceId
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

    resourceStop(tenantId, row) {
        const that = this
        this.buildStopQuery(tenantId, row)
            .then((response) => response.json())
            .then((response) => {
				that.parent.dealResourceStop(response, row)
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
}

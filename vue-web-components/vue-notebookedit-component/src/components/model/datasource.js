
import { hostName } from "../../config/envConfig"

export default class PhDataSource {
    constructor(id) {
        this.id = id
        this.data = {}
        this.isReady = false
        this.debugToken = ""
    }


    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }


    buildResourceQuery(tenantId, resourceId) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie("access_token") || this.debugToken
        let body = {
            table: "resource",
            conditions: {
                tenantId: ["=", tenantId],
                id: ["=", resourceId]
            },
            limit: 1,
            start_key: ""
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

    queryResourceData(tenantId, resourceId) {
        // const that = this
        this.buildResourceQuery(tenantId, resourceId)
            .then((response) => response.json())
            .then((response) => {
                console.log(response)
                const tmp = response.data[0]
                if (tmp["attributes"]["ctype"] === "jupyter") {
                    this.data["uri"] = "https://" + tmp["attributes"]["name"] + ".ide.hubadata.com/lab?token=f0f7a8476e7ca7d724a24f756ac3533dc1dc67dcb3be3cbb376c11a3d382d397"
                } else {
                    this.data["uri"] = "https://" + tmp["attributes"]["name"] + ".ide.hubadata.com/ide.html"
                }
                this.isReady = true
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

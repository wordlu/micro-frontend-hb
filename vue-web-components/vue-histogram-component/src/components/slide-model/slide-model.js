
import { staticFilePath, hostName } from '../../config/envConfig'

export default class PhSlideModel {
    constructor(id, data) {
        this.id = id
        this.debugToken = 	"7c2c24c1d31c74f1b1fbee18dfe59bcac9c1568b70aab55b776787ea0e94122f"
        // this.policies = []

        if (data) {
            this.queryContent = JSON.parse(data.content)
            this.content = [...this.queryContent]
            // this.content = Object.assign({}, this.queryContent)
            this.slideId = data.slideId
            this.pdId = data.pdId
            this.title = data.title
            this.idx = data.idx
            this.datasetName = data.datasetName || ""
            this.datasetId = data.datasetId || ""
            this.isSave = true
        } else {
            this.isSave = false
        }
    }

    querySlideContent() {
        // do nothing ...
    }
	
    checkSave(ele) {
        return JSON.stringify(this.queryContent) === JSON.stringify(this.content)
    }

    async save(ele) {
        function replacer(key, value) {
            if (key === "policy") {
                return undefined;
            }
            return value;
        }

        const body = {
            table: "slide",
            item: {
                id: this.pdId + "_" + this.slideId,
                pdId: this.pdId,
                slideId: this.slideId,
                title: this.title,
                content: JSON.stringify(this.queryContent, replacer),
                idx: this.idx,
                datasetName: this.datasetName
            }
        }

        const url = `${hostName}/hbdydatasource/put_item`
        let headers = {
            Authorization: ele.getCookie("access_token") || this.debugToken,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json"
        }
        let options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        }
        // const result = await fetch(url, options).then((res) => res.json())
        const result = await fetch(url, options) //.then((res) => res.json())
        return result.status === 200
    }

    async delete(ele) {
        const body = {
            table: "slide",
            conditions: {
                pdId: this.pdId,
                slideId: this.slideId
            }
        }

        const url = `${hostName}/hbdydatasource/delete_item`
        let headers = {
            Authorization: ele.getCookie("access_token") || this.debugToken,
            "Content-Type": "application/vnd.api+json",
            Accept: "application/vnd.api+json"
        }
        let options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body)
        }
        // const result = await fetch(url, options).then((res) => res.json())
        const result = await fetch(url, options) //.then((res) => res.json())
        return result.status === 200
    }
}

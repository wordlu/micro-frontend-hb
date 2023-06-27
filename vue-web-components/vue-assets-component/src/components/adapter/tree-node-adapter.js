
import { JsonApiDataStore } from "jsonapi-datastore"
import { hostName } from "../../config/envConfig"

export default class PhTreeNodeAdapter {
    constructor(id) {
        this.id = id
        this.store = new JsonApiDataStore()
        this.url = `${hostName}/`
        this.debugToken = "e93301fe363280d0eae4518edc6771e07559361c7848fa7f695fb86dd770e986"
    }

    resetTenantId(id) {
        this.tenantId = id
    }


    render(h, { node, data }) {
        function detailBtnClicked(data, event) {
            alert("this some project detail")
            console.log(data)
            event.preventDefault()
        }

        if (node.expanded) {
            return (
                <div class="item-line">
                    <p class="title">{data.label}</p>
                    <button class="button" onClick={(e) => detailBtnClicked.bind(data, e)}>查看元数据</button>
                </div>
            )
        } else {
            return (
                <div class="item-line">
                    <p class="title">{data.label}</p>
                    <button class="button" onClick={(e) => detailBtnClicked.bind(data, e)}>查看元数据</button>
                </div>
            )
        }
    }

    async lazyLoadWithLevel(ele, node, resolve) {
        const projectId = node.data.id
        const that = this
        that.store.reset()
        function loadProjectLevel() {
            const accessToken = ele.getCookie("access_token") || that.debugToken
            // const requestArgs = "hbplatform/resources?filter%5BresourceType%5D=standalone&filter%5Btenant%5D=" + that.tenantId + "&include=accounts"
            const requestArgs = "hbplatform/projects?filter%5Bowner%5D=" + that.tenantId
            const url = that.url + requestArgs
            let options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/vnd.api+json",
                    "Accept": "application/vnd.api+json",
                    "Authorization": accessToken
                }
                // body:JSON.stringify(body)
            }

            return fetch(url, options)
                .then((response) => response.json())
                .then((response) => {
                    that.store.sync(response)
                    return that.store.findAll("projects")
                })
        }

        function loadDatasetLevel() {
            const accessToken = ele.getCookie("access_token") || that.debugToken
            const requestArgs = "hbdydatasource/query"
            const url = that.url + requestArgs
            const body = {
                table: "dataset",
                index_name: "dataset-projectId-name-index",
                conditions: {
                    projectId: ["=", projectId]
                },
                limit: 100,
                start_key: ""
            }
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/vnd.api+json",
                    "Accept": "application/vnd.api+json",
                    "Authorization": accessToken
                },
                body:JSON.stringify(body)
            }

            return fetch(url, options)
                .then((response) => response.json())
                .then((response) => {
                    that.store.sync(response)
                    return that.store.findAll("datasets")
                })
        }

        function adapterProjectLevel(data) {
            let result = []
            for (let idx = 0; idx < data.length; ++idx) {
                const tmp = {}
                tmp["id"] = data[idx].id
                tmp["label"] = data[idx].name
                tmp["provider"] = data[idx].provider
                tmp["children"] = []
                result.push(tmp)
            }
            return result
        }

        function adapterDatasetLevel(data) {
            let result = []
            for (let idx = 0; idx < data.length; ++idx) {
                const tmp = {}
                tmp["id"] = data[idx].id
                tmp["label"] = data[idx].name
                tmp["schema"] = data[idx].schema
                tmp["leaf"] = true
                tmp["children"] = []
                result.push(tmp)
            }
            return result
        }

        if (node.level === 0) {
            resolve(adapterProjectLevel(await loadProjectLevel()))
        } else if (node.level === 1) {
            resolve(adapterDatasetLevel(await loadDatasetLevel()))
        }
    }

    exec() {
        return []
    }
}

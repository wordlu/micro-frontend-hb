
import { hostName } from "../../config/envConfig"
import { JsonApiDataStore } from "jsonapi-datastore"

export default class PhStepsDyModel {
    constructor(id, datasource, schema, parent) {
        this.id = id
        this.flowVersion = "developer"
        this.projectId = this.getUrlParam("projectId")
        this.projectName = this.getUrlParam("projectName")
        this.jobName = this.getJobName()
        this.dsName = this.getUrlParam("inputName")
        this.stepsCount = 100
        this.debugToken = "eacce9388efc85f51de434531e31f1dc8ef188982c298a7b68ad503bb66d6dcd"
        this.data = []
        this.store = new JsonApiDataStore()
        this.isReady = false
        this.datasource = datasource
        this.schema = schema
		this.parent = parent
        // this.isError = false
        // this.error = null
    }

    getUrlParam( value) {
        let href = window.location.href
        let paramArr = href.split("?")[1].split("&")
        let data = paramArr.find(item => item.indexOf(value) > -1)
        return data ? decodeURI(data).split("=")[1] : undefined
    }

    getJobName() {
        let jobShowName = this.getUrlParam("jobShowName") ? this.getUrlParam("jobShowName") : this.getUrlParam("jobName")
        return [this.projectName, this.projectName, this.flowVersion, jobShowName].join("_")
    }

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }

    buildQuery() {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "step",
            "conditions": {
                "pjName": ["=", this.projectId + "_" + this.jobName]
            },
            "limit": this.stepsCount,
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

    appendData() {
        const that = this
        this.buildQuery()
            .then((response) => response.json())
            .then((response) => {
                that.currentPageToken = response.meta.start_key
                that.store.sync(response)
                that.data = that.store.findAll("steps").sort((l, r) => l["index"] - r["index"])
				
                that.genQueryView()
            })
    }

    refreshData() {
        this.data = []
        this.store.reset()
        this.appendData()
    }

    buildGenViewBaseOnStepsQuery() {
        const url = `${hostName}/hbolapcreateview`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
            "project_id": this.projectId,
            "job_name": this.jobName,
            "tenant_id": this.getCookie("company_id") || "zudIcG_17yj8CEUoCTHg",
            "ds_name": this.dsName,
            "overwrite": false,
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

    genQueryView() {
        const that = this
		this.isReady = false
        this.buildGenViewBaseOnStepsQuery()
            .then((response) => response.json())
            .then((response) => {
                if (response["status"] === "succeed") {
                    that.datasource.name = response["view_name"]
                    that.schema.name = response["view_name"]
                    that.isReady = true
                } else {
					that.parent.sampleVisible = response.error.indexOf("exist") > 0
                    console.log(response)
                    // eslint-disable-next-line no-debugger
                }
            })
    }

}

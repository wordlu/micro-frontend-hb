
import { hostName } from "../../config/envConfig"
import { Message } from 'element-ui'

export default class PhCodeditorDatasource {
    constructor(id, projectId, jobId, parent) {
        this.id = id
        this.debugToken = '2cf3f6db81e7c979805383f76a04cde61d6e41db2f35903c513f651e271392fa'

        this.adapter = this.defaultAdapter
        this.projectId = projectId
        this.jobId = jobId

        this.data = []
        this.inputs = []
        this.outputs = ""
        this.codePath = []
        this.bucket = ""
        this.runtime = ""
        this.file_name = ""
        this.codeKey = ""
		this.parent = parent
    }

    defaultAdapter(row) {
        const attr = row["attributes"]
        this.inputs = JSON.parse(attr["inputs"])
        this.outputs = attr["outputs"]
        this.bucket = "hb-platform"
        this.runtime = attr["runtime"]
        let jobPath = attr["job-path"]
        this.file_name = jobPath.slice(jobPath.lastIndexOf("/")+1) //文件名称
        this.codeKey = jobPath.slice(0, jobPath.lastIndexOf("/")+1) //路径
    }

    buildQuery(ele) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = ele.getCookie("access_token") || this.debugToken
        let body = {
            "table": "dagconf",
            "conditions": {
                "projectId": [
                    "=",
                    this.projectId
                ],
                "id": [
                    "=",
                    this.jobId
                ]
            },
            "index_name": "dagconf-projectId-id-indexd",
            "limit": 10,
            "start_key": {}
        }

        let options = {
            method: "POST",
            headers: {
                "Authorization": accessToken,
                'Content-Type': 'application/json; charset=UTF-8',
                "accept": "application/json"
            },
            body: JSON.stringify(body)
        }
        return fetch(url, options)
    }

    refreshData(ele) {
        ele.datasource.buildQuery(ele)
            .then((response) => response.json())
            .then((response) => {
                ele.datasource.adapter(response.data[0])
                ele.downloadCode++
            })
    }

	iframeComplete(event) {
		if(event.data.editorStaus === "complete") {
			this.datasource.refreshData(this.datasource.parent)
		}
	}

	async saveEditorContent(codeEditorContent) {
		let url = `${hostName}/hbupdatejobcode`
		const accessToken = this.parent.getCookie("access_token") || this.debugToken
		let body = {
			"bucket": "hb-platform",
			"key": this.codeKey,
			"file_name": this.file_name,
			"data": encodeURI(codeEditorContent),
			"timespan": new Date().getTime()
		}
		let options = {
			method: "POST",
			headers: {
				"Authorization": accessToken,
				'Content-Type': 'application/json; charset=UTF-8',
				"accept": "application/json"
			},
			body: JSON.stringify(body)
		}
		let result = await fetch(url, options).then(res => res.json())
		if (result.status === 1) {
			Message({
				type: 'success',
				showClose: true,
				duration: 3000,
				message: '脚本保存成功！'
			})
		} else {
			Message({
				type: 'error',
				showClose: true,
				duration: 30000,
				message: '脚本保存失败！'
			})
		}
	}

	async getEditorContentEvent(event) {
		if (event.data.editorId === "codeEditor") {
			const codeEditorContent = event.data.content
			await this.datasource.saveEditorContent(codeEditorContent)
			this.downloadCode++
		}

	}
}

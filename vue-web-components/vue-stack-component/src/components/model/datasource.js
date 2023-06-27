
import { hostName } from "../../config/envConfig"
import { JsonApiDataStore } from "jsonapi-datastore"


export default class PhDataSource {
    constructor(id, parent) {
        this.id = id
        this.store = new JsonApiDataStore()
        this.resetData()
		this.parent = parent
        this.debugToken = "b83756d804ab100e44c4d822202d51079a8ac7521471bddffccecbba860b6bf6"
    }

    resetData() {
        this.store.reset()
        this.isReady = false
        this.isMetaReady = false
        this.hasNoSchema = false
        this.step = null
        this.dataset = null
    }

    getCookie(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
        arr = document.cookie.match(reg)
        if (arr) return (arr[2])
        else return null
    }

    buildQuery(projectId, jobId) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "step",
            "conditions": {
                // "pjName": ["=", this.projectId + "_" + this.jobName]
				"id": ["=", projectId + "_" + jobId]
            },
			"index_name": "id-index-index",
            "limit": 1,
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

    refreshData(projectId, jobName, jobId) {
        const that = this
        this.buildQuery(projectId, jobId)
            .then((response) => response.json())
            .then((response) => {
                that.currentPageToken = response.meta.start_key
                that.store.sync(response)
                const data = that.store.findAll("steps").sort((l, r) => l["index"] - r["index"])
                if (data.length === 0) {

                    const defaultPreFilter = this.datasets.map((x, i) => { return {
                        "ds": x,
						"index": i,
                        "preFilter": {
                            "distinct": false,
                            "enabled": true,
                            "expr": ""
                        }
                    }})

                    const defaultColumnMatches = this.datasets.map((x, i) => { return {
                        "ds": x,
						"index": i,
                        "columns": []
                    }})
					
                    const defaultOriginColumns = {
                        "enabled": false,
                        "columnName": "provider",
                        "originDatasets": this.datasets.map((x, i) => { return {
                            "ds": x,
							"index": i,
							"value": x
                        }})
                    }

                    that.step = {
                        "pj-name": [projectId, jobName].join("_"),
                        "step-id": "1",
                        ctype: "Stack",
                        expressions: JSON.stringify({
                            "params": {
                                "preFilters": defaultPreFilter,
                                "selectedColumns": [],
                                "columnsMatches": defaultColumnMatches,
                                "originColumn": defaultOriginColumns,
                                "postFilter": {
                                    "distinct": false,
                                    "enabled": false,
                                    "expr": ""
                                }
                            }
                        }),
                        "expressions-value": "JSON",
                        "group-index": "0",
                        "group-name": "",
						id: [projectId, jobId].join("_"),
                        index: "1",
                        runtime : "stack",
                        "step-name": "stack"
                    }

                } else {
                    that.step = data[0]
                }
                that.isReady = true
            })
    }

    refreshDataset(projectId) {
        const that = this
        this.buildDatasetQuery(projectId)
            .then((response) => response.json())
            .then((response) => {
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

    buildSaveQuery(param) { 
        const url = `${hostName}/hbdydatasource/put_item`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
			"table": "step",
			"item": {
				"id": this.step["id"],
				"pjName": this.step["pj-name"],
				"stepId": this.step["step-id"],
				"index": this.step["index"],
				"ctype": this.step["ctype"],
				"expressions": JSON.stringify({
					"type": "topn",
					"code": "pyspark",
					"params": param
				}),
				"runtime": this.step["runtime"],
				"groupName": this.step["group-name"],
				"groupIndex": this.step["group-index"],
				"expressionsValue": this.step["expressions-value"],
				"stepName": this.step["step-name"]
			}
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

    saveAndGenCode(param, ele) {
        this.buildSaveQuery(param)
			.then((response) => response.json())
			.then((response) => {
				if (response.data.id) {
					ele.$refs.changeInputOutput.save()
				} else {
					ele.saveNotification("failed")
				}
			})
    }

    buildRefreshScriptParameter(projectId, jobId) {
		const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
			"table": "dagconf",
			"conditions": {
				"projectId": [
					"=",
					projectId
				],
				"id": [
					"=",
					jobId
				]
			},
			"index_name": "dagconf-projectId-id-indexd",
			"limit": 10,
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

	refreshScriptParameter(projectId, jobId) {
		const that = this
        this.buildRefreshScriptParameter(projectId, jobId)
            .then((response) => response.json())
            .then((response) => {
				that.store.sync(response)
				const data = that.store.findAll("dag-confs")
				that.scriptData = data[0]
				that.scriptParamsData = []
				if (that.scriptData && that.scriptData.prop !== "") {
					that.scriptParamsData = JSON.parse(that.scriptData.prop)
				}
            })
	}

	buildSaveScriptParams(ele) {
		const url = `${hostName}/hbdydatasource/put_item`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
		const param = ele.datasource.scriptData
        let body = {
			"table": "dagconf",
			"item":  {
				"id": param["id"],
				"projectId": param["project-id"],
				"jobName": param["job-name"],
				"flowVersion": param["flow-version"],
				"dagName": param["dag-name"],
				"inputs": param["inputs"],
				"jobDisplayName": param["job-display-name"],
				"jobId": param["job-id"],
				"jobVersion": param["job-version"],
				"outputs": param["outputs"],
				"owner": param["owner"],
				"runtime": param["runtime"],
				"targetJobId": param["target-job-id"],
				"timeout": param["timeout"],
				"labels": param["labels"],
				"projectName": param["project-name"],
				"jobPath": param["job-path"],
				"jobShowName": param["job-show-name"],
				"prop": param["prop"],
				"operatorParameters": param["operator-parameters"],
				"actionName": param["job-show-name"]
			}
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

	saveScriptParams(data, ele) {
		const param = data.args.param
		ele.datasource.scriptData.prop = JSON.stringify(param.scriptParamsList)
		// const that = this
		ele.datasource.buildSaveScriptParams(ele)
			.then((response) => response.json())
			.then((response) => {
				if (response.data.id) {
					ele.saveSetting()
				} else {
					ele.saveNotification("failed")
				}
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

	buildChangeInputOutputQuery(ele, dssOutputs, dssInputs, script, changeuuid) {
        const url = `${hostName}/hbchangeresourcepositiontrigger`
        const accessToken = this.getCookie("access_token") || this.debugToken
		const tenantId = this.getCookie("company_id")
		const owner = this.getCookie("account_id")
        let body = {
			common: {
				traceId: changeuuid,
				tenantId: tenantId,
				projectId: ele.projectId,
				projectName: ele.projectName,
				owner: owner,
				showName:  decodeURI(
					decodeURI(
						this.getCookie("user_name_show")
					)
				)
			},
			action: {
				cat: "changeResourcePosition",
				desc: "change resource position",
				comments: "something need to say",
				message: JSON.stringify({
					optionName: "changeInputOutput",
					cat: "intermediate",
					runtime: "topn",
					actionName: ele.jobShowName
				}),
				required: true
			},
			datasets: {
				inputs: dssInputs,
				output: dssOutputs
			},
			script: script,
			notification: {
				required: true
			}
		}
        let options = {
			method: "POST",
			headers: {
				Authorization: accessToken,
				"Content-Type":
					"application/x-www-form-urlencoded; charset=UTF-8",
				accept: "application/json"
			},
			body: JSON.stringify(body)
		}
        return fetch(url, options)
    }

    changeInputOutputQuery(ele, dssOutputs, dssInputs, script) {
		const changeuuid = this.guid()
		const eventName = "changeInputOutput"
        this.buildChangeInputOutputQuery(ele, dssOutputs, dssInputs, script, changeuuid)
            .then((response) => response.json())
            .then((response) => {
                if (response.status === "succeed") {
                    const model = {
						changeuuid: changeuuid,
						eventName: eventName
					}
                    ele.dealChangeInputOutputQuery(model, (param, payload) => {
						const { status } = JSON.parse(payload)
						ele.saveNotification(status)
						ele.loading = false
                    })
                } else {
					ele.saveNotification("failed")
                }
            })
    }

    buildDsMetaQuery(projectId, dsName) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "dataset",
            "index_name": "dataset-projectId-name-index",
            "conditions": {
                "projectId": ["=", projectId],
                "name": ["=", dsName]
            },
            "limit": 1,
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

    buildJobQuery(projectId, jobId) {
        const url = `${hostName}/hbdydatasource/query`
        const accessToken = this.getCookie( "access_token" ) || this.debugToken
        let body = {
            "table": "dagconf",
            "index_name": "dagconf-projectId-id-indexd",
            "conditions": {
                "projectId": ["=", projectId],
                "id": ["=", jobId],
            },
            "limit": 1,
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

    async queryJob(projectId, jobName) {
        const that = this
        await this.buildJobQuery(projectId, jobName)
            .then((response) => response.json())
            .then((response) => {
                // console.log(response)
                that.store.sync(response)
                const data = that.store.findAll("dag-confs")
                that.job = data[0]
                that.datasets = JSON.parse(that.job["inputs"])
            })
    }

    async refreshMateData(projectId, dsNames) {
        const that = this
        const ps = dsNames.map(x => this.buildDsMetaQuery(projectId, x)
            .then((response) => response.json())
            .then((response) => {
                that.store.sync(response)
            }))

        Promise.all(ps).then(() => {
            const data = that.store.findAll("datasets")
            that.schema = {}
            data.forEach(ds => {
                that.schema[ds["name"]] = JSON.parse(ds["schema"])
            })

            Object.keys(that.schema).forEach(x => that.hasNoSchema | that.schema[x].length === 0)

            if (Object.keys(that.schema).length !== dsNames.length) {
                that.hasNoSchema = true
            } else {
                that.isMetaReady = true
            }

			that.refreshDataset(projectId)
        })
    }
}




// import { hostName } from "../../config/envConfig"
// import { JsonApiDataStore } from "jsonapi-datastore"


// export default class PhDataSource {
//     constructor(id, parent) {
//         this.id = id
// 		this.parent = parent
//         this.store = new JsonApiDataStore()
//         this.resetData()
//         this.debugToken = "74c791b26de28fc7fb6731bd98c2336a0d60917c9b58f50838064b9c7076affe"
//     }

//     resetData() {
//         this.store.reset()
//         this.isReady = false
//         this.isMetaReady = false
//         this.hasNoSchema = false
//         this.step = null
//         this.datasets = null
//     }

//     getCookie(name) {
//         let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)")
//         arr = document.cookie.match(reg)
//         if (arr) return (arr[2])
//         else return null
//     }

//     buildJobQuery(projectId, jobId) {
//         const url = `${hostName}/hbdydatasource/query`
//         const accessToken = this.getCookie( "access_token" ) || this.debugToken
//         let body = {
//             "table": "dagconf",
//             "index_name": "dagconf-projectId-id-indexd",
//             "conditions": {
//                 "projectId": ["=", projectId],
//                 "id": ["=", jobId],
//             },
//             "limit": 1,
//             "start_key": {}
//         }

//         let options = {
//             method: "POST",
//             headers: {
//                 "Authorization": accessToken,
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                 "accept": "application/json"
//             },
//             body: JSON.stringify(body)
//         }
//         return fetch(url, options)
//     }

//     async queryJob(projectId, jobName) {
//         const that = this
//         await this.buildJobQuery(projectId, jobName)
//             .then((response) => response.json())
//             .then((response) => {
//                 // console.log(response)
//                 that.store.sync(response)
//                 const data = that.store.findAll("dag-confs")
//                 that.job = data[0]
//                 that.datasets = JSON.parse(that.job["inputs"])
//             })
//     }

//     buildQuery(projectId, jobName, jobId) {
//         const url = `${hostName}/hbdydatasource/query`
//         const accessToken = this.getCookie( "access_token" ) || this.debugToken
//         let body = {
//             "table": "step",
//             "conditions": {
//                 // "pjName": ["=", this.projectId + "_" + this.jobName]
// 				"id": ["=", projectId + "_" + jobId]
//             },
// 			"index_name": "id-index-index",
//             "limit": 1,
//             "start_key": {}
//         }

//         let options = {
//             method: "POST",
//             headers: {
//                 "Authorization": accessToken,
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                 "accept": "application/json"
//             },
//             body: JSON.stringify(body)
//         }
//         return fetch(url, options)
//     }

//     refreshData(projectId, jobName, jobId) {
//         const that = this
//         this.buildQuery(projectId, jobName, jobId)
//             .then((response) => response.json())
//             .then((response) => {
//                 that.currentPageToken = response.meta.start_key
//                 that.store.sync(response)
//                 const data = that.store.findAll("steps").sort((l, r) => l["index"] - r["index"])
//                 if (data.length === 0) {

//                     const defaultPreFilter = this.datasets.map((x, i) => { return {
//                         "ds": x,
// 						"index": i,
//                         "preFilter": {
//                             "distinct": false,
//                             "enabled": true,
//                             "expr": ""
//                         }
//                     }})

//                     const defaultColumnMatches = this.datasets.map((x, i) => { return {
//                         "ds": x,
// 						"index": i,
//                         "columns": []
//                     }})
					
//                     const defaultOriginColumns = {
//                         "enabled": false,
//                         "columnName": "provider",
//                         "originDatasets": this.datasets.map((x, i) => { return {
//                             "ds": x,
// 							"index": i,
// 							"value": x
//                         }})
//                     }

//                     that.step = {
//                         "pj-name": [projectId, jobName].join("_"),
//                         "step-id": "1",
//                         ctype: "Stack",
//                         expressions: JSON.stringify({
//                             "params": {
//                                 "preFilters": defaultPreFilter,
//                                 "selectedColumns": [],
//                                 "columnsMatches": defaultColumnMatches,
//                                 "originColumn": defaultOriginColumns,
//                                 "postFilter": {
//                                     "distinct": false,
//                                     "enabled": false,
//                                     "expr": ""
//                                 }
//                             }
//                         }),
//                         "expressions-value": "JSON",
//                         "group-index": "0",
//                         "group-name": "",
// 						id: [projectId, jobId].join("_"),
//                         index: "1",
//                         runtime : "stack",
//                         "step-name": "stack"
//                     }

//                 } else {
//                     that.step = data[0]
//                 }
//                 that.isReady = true
//             })
//     }

//     buildDsMetaQuery(projectId, dsName) {
//         const url = `${hostName}/hbdydatasource/query`
//         const accessToken = this.getCookie( "access_token" ) || this.debugToken
//         let body = {
//             "table": "dataset",
//             "index_name": "dataset-projectId-name-index",
//             "conditions": {
//                 "projectId": ["=", projectId],
//                 "name": ["=", dsName]
//             },
//             "limit": 1,
//             "start_key": {}
//         }

//         let options = {
//             method: "POST",
//             headers: {
//                 "Authorization": accessToken,
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                 "accept": "application/json"
//             },
//             body: JSON.stringify(body)
//         }
//         return fetch(url, options)
//     }

//     async refreshMateData(projectId, dsNames) {
//         const that = this
//         const ps = dsNames.map(x => this.buildDsMetaQuery(projectId, x)
//             .then((response) => response.json())
//             .then((response) => {
//                 that.store.sync(response)
//             }))

//         Promise.all(ps).then(() => {
//             const data = that.store.findAll("datasets")
//             that.schema = {}
//             data.forEach(ds => {
//                 that.schema[ds["name"]] = JSON.parse(ds["schema"])
//             })

//             Object.keys(that.schema).forEach(x => that.hasNoSchema | that.schema[x].length === 0)

//             if (Object.keys(that.schema).length !== dsNames.length) {
//                 that.hasNoSchema = true
//             } else {
//                 that.isMetaReady = true
//             }

// 			that.refreshDataset(projectId)
//         })
//     }

// 	refreshDataset(projectId) {
//         const that = this
//         this.buildDatasetQuery(projectId)
//             .then((response) => response.json())
//             .then((response) => {
// 				that.store.sync(response)
//                 const data = that.store.findAll("datasets")
// 				that.parent.datasetArray = data
//             })
//     }

// 	buildDatasetQuery(projectId) {
//         const url = `${hostName}/hbdydatasource/query`
//         const accessToken = this.getCookie( "access_token" ) || this.debugToken
//         let body = {
//             "table": "dataset",
//             "conditions": {
//                 "projectId": ["=", projectId]
//             },
// 			index_name: "dataset-projectId-name-index",
//             "limit": 1000,
//             "start_key": {}
//         }

//         let options = {
//             method: "POST",
//             headers: {
//                 "Authorization": accessToken,
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                 "accept": "application/json"
//             },
//             body: JSON.stringify(body)
//         }
//         return fetch(url, options)
//     }

// 	refreshInOut(projectId, jobName) {
//         const that = this
//         this.buildInOutQuery(projectId, jobName)
//             .then((response) => response.json())
//             .then((response) => {
// 				console.log(response)
// 				that.parent.inArray = response.input
// 				that.parent.outArray = response.output
//             })
//     }

// 	buildInOutQuery(projectId, jobName) {
//         const url = `${hostName}/phcheckinout`
//         const accessToken = this.getCookie( "access_token" ) || this.debugToken
//         let body = {
// 			"name": jobName,
// 			"projectId": projectId
// 		}

//         let options = {
//             method: "POST",
//             headers: {
//                 "Authorization": accessToken,
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//                 "accept": "application/json"
//             },
//             body: JSON.stringify(body)
//         }
//         return fetch(url, options)
//     }

//     buildSaveQuery(projectId, jobName, param, inputs) {
// 		const steps = [{
// 			pjName: this.step["pj-name"],
// 			stepId: this.step["step-id"],
// 			ctype: this.step["ctype"],
// 			expressions: {
// 				"type": "stack",
// 				"code": "pyspark",
// 				"params": param
// 			},
// 			expressionsValue: this.step["expressions-value"],
// 			groupIndex: this.step["group-index"],
// 			groupName: this.step["group-name"],
// 			id: this.step["id"],
// 			index: this.step["index"],
// 			runtime : this.step["runtime"],
// 			stepName: this.step["step-name"]
// 		}]
// 		const event = new Event("event")
// 		event.args = {
// 			callback: "saveStack",
// 			element: this,
// 			param: {
// 				name: "saveStack",
// 				projectId: this.parent.projectId,
// 				projectName: this.parent.projectName,
// 				stepsArr: steps,
// 				inputs: inputs
// 			}
// 		}
// 		this.parent.$emit('event', event)
//     }

//     saveAndGenCode(projectId, jobName, param, inputs) {
//         this.buildSaveQuery(projectId, jobName, param, inputs)
//     }
// }

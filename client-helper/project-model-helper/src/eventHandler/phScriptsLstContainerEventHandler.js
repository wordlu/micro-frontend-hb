// eslint-disable-next-line no-unused-vars
import { hostName, actionTableName } from "../config/envConfig"

export async function phScriptsLstContainerEventHandler(e, route) {
	let params = e.detail[0].args.param
	let uri = "projects"
	let preUrl = ""
	const createScriptsEventName = "createScripts"
	// const deleteDatasetsEventName = "deleteDatasets"
	const deleteScriptsEventName = "deleteResource"
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "localUpload") {
				uri =
					"index-input?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (
				params.name === "linkToProject" ||
				params.name === "project"
			) {
				uri = `projects/${this.projectId}?projectName=${this.projectName}&projectId=${this.projectId}`
			} else if (params.name === "analyze") {
				uri = `dataset/${params.dataset.name}?projectName=${params.projectName}&projectId=${params.projectId}&datasetId=${params.dataset.id}&datasetName=${params.dataset.name}`
			} else if (params.name === "datasets") {
				uri =
					"dataset-lst?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "scripts") {
				uri =
					"recipes?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "sort"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "sort_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "sort",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"sort?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&datasetId=" +
					params.inputDS["id"] +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "group"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "group_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "group",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"group?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&datasetId=" +
					params.inputDS["id"] +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "pivot"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "pivot_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "pivot",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"pivot?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&datasetId=" +
					params.inputDS["id"] +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "join"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "join_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "join",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"join?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "stack"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "stack_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "stack",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"stack?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "distinct"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "distinct_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "distinct",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"distinct?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&datasetId=" +
					params.inputDS["id"] +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "topn"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "topn_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "topn",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"topn?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&datasetId=" +
					params.inputDS["id"] +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "sync"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "sync_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "sync",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"sync?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&outputName=" +
					recipt.outputs +
					"&jobId=" +
					recipt.jobId
			} else if (
				params.name === "codeditor" &&
				params.recipt.runtime === "prepare"
			) {
				let recipt = params.recipt
				let inputName = JSON.parse(recipt.inputs)[0]
				let scripts = {
					name: "editScripts",
					jobName: recipt.jobName,
					jobId: recipt.jobId,
					targetJobId: recipt.targetJobId,
					inputs: JSON.parse(recipt.inputs),
					outputs: recipt.outputs,
					jobVersion: recipt.jobVersion,
					projectName: params.projectName,
					jobDisplayName: recipt.jobDisplayName,
					jobShowName: recipt.jobShowName,
					projectId: params.projectId,
					jobCat: "prepare_edit"
				}
				route.store.unloadAll("tempdata")
				route.store.pushPayload({
					data: [
						{
							type: "tempdatas",
							id: "prepare",
							attributes: {
								jsondata: scripts
							}
						}
					]
				})
				uri =
					"prepare-set?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobName=" +
					recipt.jobName +
					"&jobShowName=" +
					recipt.jobShowName +
					"&inputName=" +
					inputName +
					"&jobId=" +
					recipt.jobId
			} else if (params.name === "codeditor") {
				uri =
					"codeditor?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobId=" +
					params.recipt.jobId
			} else if (params.name === "flow") {
				uri =
					"flow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "airflow") {
				uri =
					"airflow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			}
			route.router.transitionTo("shell", encodeURI(uri))
			break
		case "createScripts":
			if (params) {
				const url = `${hostName}/hbresourcecreationtrigger`
				const accessToken = route.cookies.read("access_token")
				const uuid = guid()
				route.loadingService.loading.style.display = "flex"
				route.loadingService.loading.style["z-index"] = 2
				//需要新建dataset
				route.projectId = params.projectId
				route.projectName = params.projectName
				route.store.unloadAll("tempdata")

				let datasets = []
				let dsNames = []
				params.inputs.forEach((item) => {
					datasets.push({
						name: item.name,
						cat: item.cat,
						format: "parquet",
						schema: []
					})
					dsNames.push(item.name)
				})
				datasets.push({
					name: params.outputs[0].name,
					cat: "intermediate",
					format: "parquet",
					schema: []
				})
				let script = {
					name: params.jobName,
					flowVersion: "developer",
					runtime: params.runtime,
					inputs: JSON.stringify(dsNames),
					output: params.outputs[0].name
				}

				if (params.runtime === "prepare") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "prepare",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"prepare-set?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&inputName=" +
						params.inputs[0]["name"] +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				} else if (params.runtime === "topn") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "topn",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"topn?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				} else if (params.runtime === "distinct") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "distinct",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"distinct?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				} else if (params.runtime === "sort") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "sort",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"sort?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				} else if (params.runtime === "group") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "group",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"group?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				} else if (params.runtime === "pivot") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "pivot",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"pivot?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				} else if (params.runtime === "sync") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "sync",
								attributes: {
									jsondata: params
								}
							}
						]
					})

					preUrl =
						"sync?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&inputName=" +
						params.inputs[0]["name"] +
						"&outputName=" +
						params.outputs[0].name +
						"&jobId="

					script.version = []
				} else if (params.runtime === "join") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "join",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"join?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				} else if (params.runtime === "stack") {
					route.store.pushPayload({
						data: [
							{
								type: "tempdatas",
								id: "stack",
								attributes: {
									jsondata: params
								}
							}
						]
					})
					preUrl =
						"stack?projectName=" +
						params.projectName +
						"&projectId=" +
						params.projectId +
						"&jobName=" +
						params.jobName +
						"&datasetId=" +
						params.inputs[0]["id"] +
						"&jobId="
				}

				let message = {
					common: {
						traceId: uuid,
						tenantId: route.cookies.read("company_id"),
						projectId: params.projectId,
						projectName: params.projectName,
						flowVersion: "developer",
						dagName: params.projectName,
						owner: route.cookies.read("account_id"),
						showName: decodeURI(
							route.cookies.read("user_name_show")
						)
					},
					action: {
						cat: "createScript",
						desc: "create script",
						comments: "something need to say",
						message: JSON.stringify({
							optionName: "create_script",
							cat: "intermediate",
							runtime: params.runtime,
							actionName: params.jobName
						}),
						required: true
					},
					datasets: datasets,
					script: script,
					notification: {
						required: true
					},
					result: {}
				}
				let scriptOptions = {
					method: "POST",
					headers: {
						Authorization: accessToken,
						"Content-Type":
							"application/x-www-form-urlencoded; charset=UTF-8",
						accept: "application/json"
					},
					body: JSON.stringify(message)
				}
				route.creatScriptsQuery = await fetch(url, scriptOptions).then(
					(res) => res.json()
				)
				route.noticeService.defineAction({
					type: "iot",
					remoteResource: "notification",
					runnerId: "",
					id: uuid,
					eventName: createScriptsEventName,
					projectId: params.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: createScriptNoticeCallback
				})
			}
			break
		case "addTags":
			if (params) {
				let selectedDatasets = params.selectedDatasets //需要更新的dataset
				let datasetArray = params.datasetArray //发送请求的参数在这取
				let selectedTags = params.selectedTags //选中的tag数组
				selectedDatasets.forEach(async (targetId) => {
					let targetDataset = datasetArray.filter(
						(it) => it.id == targetId
					)[0]
					let targetLabels = Array.from(
						new Set(targetDataset.labels.concat(selectedTags))
					)
					const url = `${hostName}/hbdydatasource/put_item`
					const accessToken = route.cookies.read("access_token")
					let body = {
						table: "dagconf",
						item: {
							id: targetDataset.id,
							projectId: params.projectId,
							labels: JSON.stringify(targetLabels),
							actionName: targetDataset.actionName,
							flowVersion: targetDataset.flowVersion,
							jobDisplayName: targetDataset.jobDisplayName,
							jobName: targetDataset.jobName,
							jobPath: targetDataset.jobPath,
							jobShowName: targetDataset.jobShowName,
							dagName: targetDataset.dagName,
							inputs: targetDataset.inputs,
							jobId: targetDataset.jobId,
							jobVersion: targetDataset.jobVersion,
							outputs: targetDataset.outputs,
							owner: targetDataset.owner,
							projectName: targetDataset.projectName,
							runtime: targetDataset.runtime,
							targetJobId: targetDataset.targetJobId,
							timeout: targetDataset.timeout
							// schema: targetDataset.schema,
							// date: new Date().getTime(),
							// version: targetDataset.version,
							// name: targetDataset.name
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
					await fetch(url, options)
					window.location.reload()
				})
			}
			break
		//删除脚本
		case "deleteScripts":
			if (params) {
				route.loadingService.loading.style.display = "flex"
				route.loadingService.loading.style["z-index"] = 2
				let selectedScriptsDel = params.selectedScripts //需要更新的dataset
				let scriptArrayDel = params.scriptArray //发送请求的参数在这取
				let msgArr = []
				selectedScriptsDel.forEach(async (targetId) => {
					let targetDataset = scriptArrayDel.filter(
						(it) => it.id == targetId
					)[0]
					msgArr.push({
						actionName: targetDataset.jobShowName,
						jobName: targetDataset.jobName
					})
				})
				const deluuid = guid()
				let body = {
					common: {
						traceId: deluuid,
						projectId: params.projectId,
						projectName: params.projectName,
						flowVersion: "developer",
						owner: route.cookies.read("account_id"),
						showName: decodeURI(
							route.cookies.read("user_name_show")
						),
						tenantId: route.cookies.read("company_id")
					},
					action: {
						cat: "deleteResource",
						desc: "delete script",
						comments: "something need to say",
						message: JSON.stringify({
							optionName: "delete_script",
							cat: "intermediate",
							runtime: "python3",
							actionName: msgArr[0].actionName
						}),
						required: true
					},
					datasets: [],
					scripts: msgArr,
					notification: {
						required: true
					},
					result: {}
				}
				const urldel = `${hostName}/hbresdeletiontrigger`
				const accessTokendel = route.cookies.read("access_token")
				let options = {
					method: "POST",
					headers: {
						Authorization: accessTokendel,
						"Content-Type":
							"application/x-www-form-urlencoded; charset=UTF-8",
						accept: "application/json"
					},
					body: JSON.stringify(body)
				}
				await fetch(urldel, options).then((res) => res.json())
				route.noticeService.defineAction({
					type: "iot",
					remoteResource: "notification",
					runnerId: "",
					id: deluuid,
					eventName: deleteScriptsEventName,
					projectId: params.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: deleteDatasetsNoticeCallback
				})
			}
			break
		default:
			console.log("other click event!")
	}

	function deleteDatasetsNoticeCallback(param, payload) {
		const { message, status } = JSON.parse(payload)
		const {
			cnotification: { error }
		} = JSON.parse(message)
		if (status === "succeed") {
			alert("删除脚本成功！")
			window.location.reload()
		} else if (status === "failed") {
			let errorObj = error !== "" ? error : "删除脚本失败，请重新操作！"
			alert(errorObj)
		}
		route.loadingService.loading.style.display = "none"
	}

	function createScriptNoticeCallback(param, payload) {
		const { message, status } = JSON.parse(payload)
		const {
			cnotification: {
				data: { runtime, jobId },
				error
			}
		} = JSON.parse(message)
		const codeditorArr = ["python3", "pyspark", "sparkr", "r"]
		if (!codeditorArr.includes(runtime)) {
			preUrl = preUrl + jobId
			route.router.transitionTo("shell", preUrl)
		} else if (status == "succeed") {
			alert("新建脚本成功！")
			route.router.transitionTo(
				"shell",
				`codeditor?projectName=${route.projectName}&projectId=${route.projectId}&jobId=${jobId}`
			)
		} else if (status == "failed") {
			console.log(error)
			alert("新建脚本失败，请重新操作！")
		}
		route.loadingService.loading.style.display = "none"
	}

	function guid() {
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

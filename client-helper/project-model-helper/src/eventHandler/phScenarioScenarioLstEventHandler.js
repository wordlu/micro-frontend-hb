// eslint-disable-next-line no-unused-vars
import { hostName, actionTableName } from "../config/envConfig"

export async function phScenarioScenarioLstEventHandler(e, route) {
	let customCallbackFuncs = {}
	let params = e.detail[0].args.param
	const accessToken = route.cookies.read("access_token")
	const deleteScenarioEventName = "deleteScenarios"
	let uri = ""
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "scenario-detail") {
				uri = `scenario-detail?projectId=${params.projectId}&projectName=${params.projectName}&scenarioName=${params.scenario.scenarioName}&scenarioId=${params.scenario.id}`
			}
			route.router.transitionTo("shell", uri)
			break
		case "addTags":
			if (params) {
				let selectedscenarios = params.selectedscenarios //需要更新的scenario
				let scenarioArray = params.scenarioArray //发送请求的参数在这取
				let selectedTags = params.selectedTags //选中的tag数组
				selectedscenarios.forEach(async (targetId) => {
					let targetscenario = scenarioArray.filter(
						(it) => it.id == targetId
					)[0]
					let targetLabels = Array.from(
						new Set(targetscenario.label.concat(selectedTags))
					)
					const url = `${hostName}/hbdydatasource/put_item`
					let body = {
						table: "scenario",
						item: {
							id: targetscenario.id,
							projectId: params.projectId,
							projectName: params.projectName,
							scenarioName: targetscenario.scenarioName,
							label: JSON.stringify(targetLabels),
							args: targetscenario.args,
							owner: targetscenario.owner,
							active: targetscenario.active,
							index: targetscenario.index,
							// name: targetscenario.name,
							traceId: targetscenario.traceId,
							showName: decodeURI(
								route.cookies.read("user_name_show")
							)
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
		case "resetScenario":
			if (params) {
				const targetscenario = params.scenario //需要更新的scenario
				const url = `${hostName}/hbdydatasource/put_item`
				let body = {
					table: "scenario",
					item: {
						id: targetscenario.id,
						projectId: params.projectId,
						projectName: params.projectName,
						scenarioName: targetscenario.scenarioName,
						label: targetscenario.label,
						args: targetscenario.args,
						owner: targetscenario.owner,
						active: targetscenario.active,
						index: targetscenario.index,
						traceId: targetscenario.traceId,
						showName: decodeURI(
							route.cookies.read("user_name_show")
						)
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
			}
			break
		case "createScenario":
			if (params) {
				route.loadingService.loading.style.display = "flex"
				route.loadingService.loading.style["z-index"] = 2
				const targetscenario = params.scenario //需要更新的scenario
				const url = `${hostName}/hbscenariostrigger`
				const tenantId = route.cookies.read("company_id")
				const traceId = guid()
				const scenarioId = guid()
				let body = {
					common: {
						traceId: traceId,
						projectId: params.projectId,
						projectName: params.projectName,
						owner: route.cookies.read("account_id"),
						showName: decodeURI(
							route.cookies.read("user_name_show")
						),
						tenantId: tenantId
					},
					action: {
						cat: "createScenario",
						desc: "create scenario",
						comments: "create scenario",
						message: JSON.stringify({
							optionName: "create_scenario",
							cat: "scenario",
							actionName: targetscenario.scenarioName
						}),
						required: true
					},
					notification: {
						required: true
					},
					scenario: {
						id: `${params.projectId}_${scenarioId}`,
						active: true,
						scenarioName: targetscenario.scenarioName,
						deletion: false,
						index: 0
					},
					triggers: [],
					steps: [],
					reports: [],
					result: {}
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
				let createScenarioResult = await fetch(url, options).then(
					(res) => res.json()
				)
				customCallbackFuncs[createScenarioResult.traceId] =
					params.callback
				console.log(createScenarioResult)
				route.noticeService.defineAction({
					type: "iot",
					remoteResource: "notification",
					runnerId: "",
					id: createScenarioResult.trace_id,
					eventName: "createScenario",
					projectId: params.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: createScenarioCallback
				})
				route.scenarioDetailUri = `scenario-detail?projectId=${params.projectId}&projectName=${params.projectName}&scenarioName=${targetscenario.scenarioName}&scenarioId=${params.projectId}_${scenarioId}`
				// if (result.status === "failed") {
				// 	alert("创建失败！")
				// } else {
				// 	const scenarioDetailUri = `scenario-detail?projectId=${params.projectId}&projectName=${params.projectName}&scenarioName=${targetscenario.scenarioName}&scenarioId=${params.projectId}_${scenarioId}`
				// 	route.router.transitionTo("shell", scenarioDetailUri)
				// }
			}
			break
		case "deleteScenarios":
			if (params) {
				route.loadingService.loading.style.display = "flex"
				route.loadingService.loading.style["z-index"] = 2
				const selectedScenarioDel = params.selectedScenarios
				const scenarioArrayDel = params.scenarioArray
				const deluuid = guid()
				const delUri = `${hostName}/hbscenariosdeletiontrigger`
				let scenarios = []
				scenarioArrayDel.forEach((item) => {
					if (selectedScenarioDel.includes(item.id)) {
						scenarios.push({
							id: item.id,
							active: item.active,
							scenarioName: item.scenarioName,
							deletion: false,
							index: item.index
						})
					}
				})
				const scenarioNames = scenarios
					.map((it) => it.scenarioName)
					.toString()
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
						cat: "deleteScenario",
						desc: "delete scenario",
						comments: "something need to say",
						message: JSON.stringify({
							optionName: "delete_scenario",
							cat: "scenario",
							actionName: scenarioNames
						}),
						required: true
					},
					scenario: scenarios,
					triggers: [],
					reports: [],
					steps: [],
					notification: {
						required: true
					},
					result: {}
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
				await fetch(delUri, options).then((res) => res.json())
				route.noticeService.defineAction({
					type: "iot",
					remoteResource: "notification",
					runnerId: "",
					id: deluuid,
					eventName: deleteScenarioEventName,
					projectId: params.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: deleteScenariosNoticeCallback
				})
			}
			break
		default:
			console.log("other click event!")
	}

	function deleteScenariosNoticeCallback(param, payload) {
		const { message, status } = JSON.parse(payload)
		console.log(message, status)
		const {
			cnotification: { error }
		} = JSON.parse(message)
		if (status == "success") {
			alert("删除scenario成功！")
			window.location.reload()
		} else if (status == "failed") {
			// let errorObj = error !== "" ? JSON.parse(error) : ""
			// let msg =
			// 	errorObj["message"]["zh"] !== ""
			// 		? errorObj["message"]["zh"]
			// 		: "删除scenario失败，请重新操作！"
			console.log(error)
			alert("删除scenario失败，请重新操作！")
		}
		route.loadingService.loading.style.display = "none"
	}

	function createScenarioCallback(param, payload) {
		console.log(payload)
		const { status } = JSON.parse(payload)
		if (status == "success") {
			alert("新建scenario成功！")
			route.router.transitionTo("shell", route.scenarioDetailUri)
		} else if (status == "failed") {
			customCallbackFuncs[param.traceId](param, payload)
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

// eslint-disable-next-line no-unused-vars
import { hostName, actionTableName } from "../config/envConfig"

export async function phScenarioScenarioDetailContainerEventHandler(e, route) {
	const params = e.detail[0].args.param
	const tenantId = route.cookies.read("company_id")
	const accessToken = route.cookies.read("access_token")
	let uri = ""
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "scenario-detail") {
				uri = `scenario-detail?projectId=${params.projectId}?projectName=${params.projectName}&scenarioName=${params.scenario.name}&scenarioId=${params.scenario.id}`
			}
			route.router.transitionTo("shell", uri)
			break
		case "saveScenario":
			if (params) {
				// const targetscenario = params.scenario //需要更新的scenario
				const traceId = guid()
				const scenarioId = guid()
				const url = `${hostName}/hbscenariostrigger`
				route.loadingService.loading.style.display = "flex"
				route.loadingService.loading.style["z-index"] = 2

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
						cat: "createOrUpdateScenario",
						desc: "create or update scenario",
						comments: "something need to say",
						message: JSON.stringify({
							optionName: "update_scenario",
							cat: "scenario",
							actionName: params.scenarioName
						}),
						required: true
					},
					notification: {
						required: true
					},
					scenario: {
						id:
							params.scenarioId ||
							`${params.projectId}_${scenarioId}`,
						active: params.active,
						scenarioName: params.scenarioName,
						deletion: false,
						index: 0,
						args: params.args
					},
					triggers: params.triggerDisplay,
					steps: params.stepDisplay,
					reports: params.reportDisplay,
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
				let updateScenarioResult = await fetch(url, options).then(
					(res) => res.json()
				)
				route.noticeService.defineAction({
					type: "iot",
					remoteResource: "notification",
					runnerId: "",
					id: updateScenarioResult.trace_id,
					eventName: "updateScenario",
					projectId: params.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: updateScenarioCallback
				})
				route.scenarioListUri = `scenarios?projectId=${params.projectId}&projectName=${params.projectName}`
			}
			break

		default:
			console.log("other click event!")
	}

	function updateScenarioCallback(param, payload) {
		console.log(payload)
		const { message, status } = JSON.parse(payload)
		const {
			cnotification: { error }
		} = JSON.parse(message)
		if (status == "success") {
			if (params.type === "trigger") {
				triggerScenario()
			} else {
				alert("更新scenario成功！")
				route.router.transitionTo("shell", route.scenarioListUri)
			}
		} else if (status == "failed") {
			alert("更新失败")
			console.log(error)
		}
		route.loadingService.loading.style.display = "none"
	}

	async function triggerScenario() {
		const traceId = guid()
		const url = `${hostName}/hbscenarioexecutiontrigger`
		const body = {
			common: {
				traceId: traceId,
				projectId: params.projectId,
				projectName: params.projectName,
				owner: route.cookies.read("account_id"),
				showName: decodeURI(route.cookies.read("user_name_show")),
				tenantId: tenantId
			},
			action: {
				cat: "scenarioTrigger",
				desc: "scenario trigger",
				comments: "something need to say",
				message: JSON.stringify({
					optionName: "scenario_trigger",
					cat: "scenario",
					actionName: params.scenarioName
				}),
				required: true
			},
			notification: {
				required: true
			},
			scenario: {
				scenarioId: params.scenarioId,
				runtime: "manual",
				codeFree: params.codeFree ? params.codeFree : {}
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
		let triggerScenarioResult = await fetch(url, options).then((res) =>
			res.json()
		)
		if (triggerScenarioResult.status === "succeed") {
			const uri = `executions?projectName=${params.projectName}&projectId=${params.projectId}`
			route.router.transitionTo("shell", uri)
		} else {
			alert("运行失败，请重新操作！")
		}
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

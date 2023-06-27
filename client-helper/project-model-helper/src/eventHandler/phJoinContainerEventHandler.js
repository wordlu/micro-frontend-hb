// import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phJoinContainerEventHandler(e, route) {
	const params = e.detail[0].args.param
	// const element = e.detail[0].args.element
	// const accessToken = route.cookies.read("access_token")
	let customCallbackFuncs = {}
	let transition = 0
	let joinData = await route.store.peekRecord("tempdata", "join")
	let scriptsParams = {}
	// let inputs = []
	let outputs = []
	if (joinData) {
		scriptsParams = joinData.jsondata

		// inputs = scriptsParams.inputs[0].name
		// 	? scriptsParams.inputs
		// 			.map((it) => it.name)
		// 			.join(",")
		// 			.split(",")
		// 	: scriptsParams.inputs

		let outputsData = scriptsParams.outputs[0].name
			? scriptsParams.outputs[0].name
			: scriptsParams.outputs
		outputs.push(outputsData)
	}
	let uri = ""
	route.msg = "新建"
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "linkToProject" || params.name == "project") {
				uri = `/projects/` + params.projectId
			} else if (params.name === "datasets") {
				uri =
					"/dataset-lst?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name === "scripts") {
				uri =
					"/recipes?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name == "flow") {
				uri =
					"/flow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name == "airflow") {
				uri =
					"/airflow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			}
			route.router.transitionTo(uri)
			break
		case "changScriptInputOutput":
			if (params) {
				customCallbackFuncs[params.changeuuid] = params.callback
				transition = params.transition
				route.projectId = params.projectId
				route.projectName = params.projectName
				route.noticeService.defineAction({
					type: "iot",
					remoteResource: "notification",
					runnerId: "",
					id: params.changeuuid,
					eventName: params.eventName,
					projectId: params.projectId,
					ownerId: route.cookies.read("account_id"),
					callBack: changeInputOutputNoticeCallback
				})
			}
			break
		default:
			console.log("submit event to parent")
	}

	function changeInputOutputNoticeCallback(param, payload) {
		const { message, status } = JSON.parse(payload)
		const {
			cnotification: { error }
		} = JSON.parse(message)
		if (status == "success" || status == "succeed") {
			customCallbackFuncs[param.id](param, payload)
			if (transition) {
				route.router.transitionTo(
					"shell",
					`flow?projectId=${route.projectId}&projectName=${route.projectName}&flowVersion=developer`
				)
			}
		} else {
			console.log(error)
			customCallbackFuncs[param.id](param, payload)
		}
	}
}

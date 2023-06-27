export async function phDistinctContainerEventHandler(e, route) {
	const params = e.detail[0].args.param

	let customCallbackFuncs = {}
	let transition = 0
	let uri = ""
	route.msg = "新建"

	let distinctData = await route.store.peekRecord("tempdata", "distinct")
	let scriptsParams = {}
	let inputs = []
	let outputs = []

	if (distinctData) {
		scriptsParams = distinctData.jsondata
		let inputsData = scriptsParams.inputs[0].name
			? scriptsParams.inputs[0].name
			: scriptsParams.inputs[0]
		inputs.push(inputsData)
		let outputsData = scriptsParams.outputs[0].name
			? scriptsParams.outputs[0].name
			: scriptsParams.outputs
		outputs.push(outputsData)
	}

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

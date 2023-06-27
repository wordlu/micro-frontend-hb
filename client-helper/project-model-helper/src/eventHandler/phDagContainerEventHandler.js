export async function phDagContainerEventHandler(e, route) {
	const params = e.detail[0].args.param

	let runDagStatusCallbacks = {}
	let customCallbackFuncs = {}

	if (e.detail[0].args.callback === "runDagStatus") {
		if (params) {
			runDagStatusCallbacks = params.callbacks
			const notification = runDagStatusCallbacks["notification"]
			const executionStatus = runDagStatusCallbacks["executionStatus"]
			route.projectId = params.projectId
			let jobNamePre = notification["runnerId"].split("_")
			jobNamePre.pop()
			jobNamePre = jobNamePre.join("_")
			route.noticeService.defineAction({
				type: "iot",
				remoteResource: "notification",
				runnerId: "",
				id: notification["runnerId"],
				eventName: notification["eventName"],
				projectId: jobNamePre,
				ownerId: route.cookies.read("account_id"),
				callBack: runDagCallBack
			})
			route.noticeService.defineAction({
				type: "iot",
				remoteResource: "notification",
				runnerId: "",
				id: executionStatus["runnerId"],
				eventName: executionStatus["eventName"],
				projectId: params.projectId,
				ownerId: route.cookies.read("account_id"),
				callBack: executionStatusCallback
			})
		}
	} else if (e.detail[0].args.callback === "createOtherScript") {
		if (params) {
			customCallbackFuncs[params.uuid] = params.callback
			route.projectId = params.projectId
			route.projectName = params.projectName
			route.noticeService.defineAction({
				type: "iot",
				remoteResource: "notification",
				runnerId: "",
				id: params.uuid,
				eventName: params.eventName,
				projectId: params.projectId,
				ownerId: route.cookies.read("account_id"),
				callBack: createOtherScriptCallback
			})
		}
	}

	function createOtherScriptCallback(param, payload) {
		customCallbackFuncs[param.id](param, payload)
	}

	function runDagCallBack(param, payload) {
		console.debug("run dag callback")
		runDagStatusCallbacks["notification"]["func"](param, payload)
	}

	function executionStatusCallback(param, payload) {
		console.debug("execution status callback")
		runDagStatusCallbacks["executionStatus"]["func"](param, payload)
	}
}

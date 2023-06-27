export async function phAnalyzeBpExecutionsLogsEventHandler(e, route) {
	let params = e.detail[0].args.param
	console.log(params)
	let uri = ""
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name == "executions-logs") {
				uri =
					"executions-logs?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId +
					"&jobIndex=" +
					params["executionItem"]["job-index"] +
					"&jobShowName=" +
					params["executionItem"]["job-show-name"] +
					"&jobShowName=" +
					params["executionItem"]["job-show-name"]
			}
			route.router.transitionTo("shell", uri)
			break
	}
}

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeExcelColumnCleanEventHandler(e, route) {
	let params = e.detail[0].args.param
	let uri = ""
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "linkToProject" || params.name == "project") {
				uri = `projects/` + params.projectId
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
			} else if (params.name == "flow") {
				uri =
					"flow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			} else if (params.name == "airflow") {
				uri =
					"airflow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			}
			this.router.transitionTo("shell", uri)
			break
		default:
			console.log("submit event to parent")
	}
}

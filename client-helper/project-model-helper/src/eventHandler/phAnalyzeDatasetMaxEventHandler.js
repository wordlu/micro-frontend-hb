import { hostName } from "../config/envConfig"

// eslint-disable-next-line no-unused-vars
export async function phAnalyzeDatasetMaxEventHandler(e, route) {
	let params = e.detail[0].args.param
	let uri = ""
	switch (e.detail[0].args.callback) {
		case "linkToPage":
			if (params.name === "datasets") {
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
			} else if (
				params.name === "linkToProject" ||
				params.name === "project"
			) {
				uri = `projects/` + params.projectId
			} else if (params.name == "airflow") {
				uri =
					"airflow?projectName=" +
					params.projectName +
					"&projectId=" +
					params.projectId
			}
			this.router.transitionTo("shell", uri)
			break
		case "downloadclick":
			on_btn_click(params.path, params.datasetName)
			break
	}

	async function on_btn_click(path, datasetName) {
		let body = {
			bucket: "hb-platform",
			path: path.split("hb-platform/")[1],
			dataset_name: datasetName
		}
		let url = `${hostName}/hboutputdown`
		let scriptOptions = {
			method: "POST",
			headers: {
				Authorization: route.cookies.read("access_token"),
				"Content-Type":
					"application/x-www-form-urlencoded; charset=UTF-8",
				accept: "application/json"
			},
			body: JSON.stringify(body)
		}
		let result = await fetch(url, scriptOptions).then((res) => res.json())
		if (result.status === 1) {
			let downloadUrl = result.message
			window.open(downloadUrl)
		} else {
			alert(result.message)
		}
	}
}
